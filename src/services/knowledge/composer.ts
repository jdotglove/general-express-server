import "dotenv/config";
import mongoose from "mongoose";

import Langchain, { BaseMessageType } from "../../plugins/langchain";
import { NestError, SERVER_RESPONSE_CODES } from "../../utils/errors";
import { createMessage } from "../../db/nest/services/message";
import { findOneConversation, updateOneConversation } from "../../db/nest/services/conversation";
import { createOrchestrationEvent } from "../../db/nest/services/orchestration-event";

import { checkIfValidOrchestrationResponse } from "../../utils/knowledge";
import { CouncilMember, findManyCouncilMembers } from "../../db/nest/services/council-member";
import { generateCouncilMemberResponse } from "./generator";

const checkpointer = new Langchain.LangGraph.MemorySaver();
const orchestrationModel = new Langchain.Anthropic.ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-opus-4-5-20251101",
});
const MAX_ORCHESTRATION_RETRIES = 3;
let PERSONA_ATTRIBUTE_MAPPING: Record<string, Partial<CouncilMember>> = {};

const knowledgeComposer = async (message: string, conversationId: string): Promise<Array<{
  message: string;
  personaName: string;
}>> => {
  if (!message) {
    throw new NestError("Message is required", SERVER_RESPONSE_CODES.BAD_REQUEST);
  }

  const parsedOrchestrationArray = await generateOrchestrationResponse(message, conversationId);
  const agentResponseArray: Array<Nest.AgentResponse> = [];

  for (let i = 0; i < parsedOrchestrationArray.length; i++) {
    const agentResponse = await runAgentTaskAndInvokeResponse({
      persona: parsedOrchestrationArray[i],
      message,
      conversationId,
      previousAgentResponses: agentResponseArray,
    });

    agentResponseArray.push({
      personaName: PERSONA_ATTRIBUTE_MAPPING[parsedOrchestrationArray[i]]?.name || "",
      message: agentResponse[agentResponse.length - 1].text,
      personaModel: PERSONA_ATTRIBUTE_MAPPING[parsedOrchestrationArray[i]].baseModel || "",
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

  const foundCouncilMembers = await findManyCouncilMembers({
    conversation: new mongoose.Types.ObjectId(conversationId),
    active: true,
  });

  let personaMapping = "[";
  let availableBotString = "";

  foundCouncilMembers.forEach((member, index) => {
    const personaKey = member?.name.toLowerCase().replace(/ /g, "-");
    PERSONA_ATTRIBUTE_MAPPING[personaKey] = {
      baseModel: member.baseModel,
      name: member?.name,
      basePersona: member.basePersona
    };
    availableBotString += `${member?.name}`;
    if (personaKey) {
      personaMapping += `"${personaKey}"`;
      if (index < foundCouncilMembers.length - 1) {
        personaMapping += ", ";
        availableBotString += ", ";
      } else {
        availableBotString += ", and" ;
      }
    }
  });
  personaMapping += "]";

  while (!isValidOrchestrationResponse && retries < MAX_ORCHESTRATION_RETRIES) {
    const stream = await orchestrationModel.stream([{
      role: "system",
      content: `
        ${PERSONA_ATTRIBUTE_MAPPING}
  
        You are an orchestration bot whose purpose is to determine which bot is best suited to respond to a user's query
        and rank the bots based on which base persona of the orchestration mappings most align with what the user's query 
        entails. The available bots are ${availableBotString}. Only respond with an array that includes the shorthand 
        name of the bot: ${availableBotString}.
  
        It should following the format:
        ["persona-key-1", "persona-key-2", "persona-key-3"]
  
        Where persona-key is the key that corresponds to the persona mapping provided. The order of the array should
        reflect the ranking of which bot is best suited to respond to the user's query, with the first element being the
        You can use any permuatation of the following persona key array: 
        <>${personaMapping}</>
  
        Only respond with the ranking array and nothing else.
      `,
    }, {
      role: "user",
      content: message,
    }]);

    for await (const chunk of stream) {
      orchestrationResponse += chunk.content;
    }

    isValidOrchestrationResponse = checkIfValidOrchestrationResponse(orchestrationResponse, PERSONA_ATTRIBUTE_MAPPING);

    if (!isValidOrchestrationResponse) {
      retries += 1;
    } else {
      const foundConversation = await findOneConversation({
        _id: new mongoose.Types.ObjectId(conversationId),
      });

      await createOrchestrationEvent({
        conversation: new mongoose.Types.ObjectId(conversationId),
        personaRanking: orchestrationResponse,
        personaMappingSnapshot: JSON.stringify(PERSONA_ATTRIBUTE_MAPPING),
        user: foundConversation.user,
        createdAt: new Date(),
        triggerMessage: message,
      });
    }
  }

  if (!checkIfValidOrchestrationResponse(orchestrationResponse, PERSONA_ATTRIBUTE_MAPPING)) {
    orchestrationResponse = `${personaMapping}`;
  }

  return JSON.parse(orchestrationResponse);
}

const runAgentTaskAndInvokeResponse = async ({
  persona,
  message,
  conversationId,
  previousAgentResponses,
}: {
  persona: keyof Nest.OrchestrationResponse;
  message: string;
  conversationId: string;
  previousAgentResponses: Array<Nest.AgentResponse>;
}) => {
  const agentTaskRunner = Langchain.LangGraph.Entrypoint({
    name: "agent",
    checkpointer
  }, async (messages: BaseMessageType[]) => {
    const previous = Langchain.LangGraph.GetPreviousState<BaseMessageType[]>() ?? [];
    const modelResponse = await generateCouncilMemberResponse({
      messageArray: [...previous, ...messages], 
      previousAgentResponses,
      councilMemberConfig: PERSONA_ATTRIBUTE_MAPPING[persona],
    });
    messages = Langchain.LangGraph.AddMessages(messages, [new Langchain.Core.AIMessage(modelResponse)]);
    return messages;
  });

  return await agentTaskRunner.invoke(
    [new Langchain.Core.HumanMessage(message)],
    { configurable: { thread_id: conversationId } },
  );
}

export default knowledgeComposer;