import "dotenv/config";
import mongoose from "mongoose";
import { ChatAnthropic } from "@langchain/anthropic";
import { entrypoint, addMessages, getPreviousState } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { AIMessage, type BaseMessage, HumanMessage, } from "@langchain/core/messages";

import { NestError, SERVER_RESPONSE_CODES } from "../../utils/errors";
import { createMessage } from "../../db/nest/services/message";
import { findOneConversation, updateOneConversation } from "../../db/nest/services/conversation";
import { createOrchestrationEvent } from "../../db/nest/services/orchestration-event";
import { PERSONA_MAPPING } from "../../utils/constants";
import { checkIfValidOrchestrationResponse } from "../../utils/knowledge";

const checkpointer = new MemorySaver();
const orchestrationModel = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-opus-4-20250514",
});
const MAX_ORCHESTRATION_RETRIES = 3;

const knowledgeComposer = async (message: string, conversationId: string): Promise<Array<{
  message: string;
  personaName: string;
}>> => {
  if (!message) {
    throw new NestError("Message is required", SERVER_RESPONSE_CODES.BAD_REQUEST);
  }

  const parsedOrchestrationArray = await generateOrchestrationResponse(message, conversationId);

  const agentResponseArray: Array<{
    personaName: string;
    message: string;
    personaModel: string;
  }> = [];
  for (let i = 0; i < parsedOrchestrationArray.length; i++) {
    const agentResponse = await runAgentTaskAndInvokeResponse({
      persona: parsedOrchestrationArray[i],
      message,
      conversationId,
    });

    agentResponseArray.push({
      personaName: PERSONA_MAPPING[parsedOrchestrationArray[i]].name,
      message: agentResponse[agentResponse.length - 1].text,
      personaModel: PERSONA_MAPPING[parsedOrchestrationArray[i]].model,
    });
  }

  agentResponseArray.forEach(async (agentResponseObject) => {
    await createMessage({
      body: agentResponseObject.message,
      createdAt: new Date(),
      sender: agentResponseObject.personaName,
      conversation: new mongoose.Types.ObjectId(conversationId),
      modelUsed: agentResponseObject.personaModel,
    });
  });

  await updateOneConversation({
    _id: new mongoose.Types.ObjectId(conversationId),
  }, {
    updatedAt: new Date(),
    lastMessage: agentResponseArray[agentResponseArray.length - 1].message,
  });

  return agentResponseArray;
}

const generateOrchestrationResponse = async (message: string, conversationId: string): Promise<Array<string>> => {
  let retries = 0;
  let isValidOrchestrationResponse = false
  let orchestrationResponse = "";

  while (!isValidOrchestrationResponse && retries < MAX_ORCHESTRATION_RETRIES) {
    const stream = await orchestrationModel.stream([{
      role: "system",
      content: `
        ${PERSONA_MAPPING}
  
        You are an orchestration bot whose purpose is to determine which bot is best suited to respond to a user's query
        and rank the bots based on which tags of the orchestration mappings most align with what the user's query entails.
        The three bots are 'Solitary Aphoristic Nomad Bot', 'Konigsberg Dreamer Bot', or 'Existential Lens Bot'. 
        Only respond with an array that includes the shorthand name of the bot: 'aphoristic-nomad', 'konigsberg-dreamer', 
        or 'existential-lens'.
  
        Example reponses are as follows: 
        <>["konigsberg-dreamer", "aphoristic-nomad", "existential-lens"]</>
        <>["aphoristic-nomad", "existential-lens", "konigsberg-dreamer"]</>
        <>["existential-lens", "konigsberg-dreamer", "aphoristic-nomad"]</>
        <>["konigsberg-dreamer", "existential-lens", "aphoristic-nomad"]</>
        <>["aphoristic-nomad", "konigsberg-dreamer", "existential-lens"]</>
        <>["existential-lens", "aphoristic-nomad", "konigsberg-dreamer"]</>
            
        If you are unsure use: 
        <>["aphoristic-nomad", "existential-lens", "konigsberg-dreamer"]</>
  
        Only respond with the ranking as a string and nothing else.
      `,
    }, {
      role: "user",
      content: message,
    }]);

    for await (const chunk of stream) {
      orchestrationResponse += chunk.content;
    }

    isValidOrchestrationResponse = checkIfValidOrchestrationResponse(orchestrationResponse);

    if (!isValidOrchestrationResponse) {
      retries += 1;
    } else {
      const foundConversation = await findOneConversation({
        _id: new mongoose.Types.ObjectId(conversationId),
      });

      console.log("Orchestration Response: ", orchestrationResponse);
      await createOrchestrationEvent({
        conversation: new mongoose.Types.ObjectId(conversationId),
        personaRanking: orchestrationResponse,
        personaMappingSnapshot: JSON.stringify(PERSONA_MAPPING),
        user: foundConversation.user,
        createdAt: new Date(),
        triggerMessage: message,
      });
    }
  }

  if (!checkIfValidOrchestrationResponse(orchestrationResponse)) {
    orchestrationResponse = `["aphoristic-nomad", "existential-lens", "konigsberg-dreamer"]`;
  }

  return JSON.parse(orchestrationResponse);
}

const runAgentTaskAndInvokeResponse = async ({
  persona,
  message,
  conversationId,
}: {
  persona: keyof Nest.OrchestrationResponse;
  message: string;
  conversationId: string;
}) => {
  const agentTaskRunner = entrypoint({ name: "agent", checkpointer }, async (messages: BaseMessage[]) => {
    const previous = getPreviousState<BaseMessage[]>() ?? [];
    const modelResponse = await PERSONA_MAPPING[persona].bot([...previous, ...messages]);
    messages = addMessages(messages, [new AIMessage(modelResponse)]);
    return messages;
  });

  return await agentTaskRunner.invoke(
    [new HumanMessage(message)],
    { configurable: { thread_id: conversationId } },
  );
}

export default knowledgeComposer;