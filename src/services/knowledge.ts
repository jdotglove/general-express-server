import "dotenv/config";
import mongoose from "mongoose";
import { ChatAnthropic } from "@langchain/anthropic";
import { entrypoint, addMessages, getPreviousState } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { AIMessage, type BaseMessage, HumanMessage, } from "@langchain/core/messages";

import { SERVER_RESPONSE_CODES } from "../utils/constants";
import { NestError } from "../utils/errors";
import { createMessage, findManyMessages } from "../db/nest/services/message";
import { findOneConversation, updateOneConversation } from "../db/nest/services/conversation";
import { KonigsbergDreamer } from "../library/immanuel-kant";
import { SolitaryAphoristicNomad } from "../library/friedrich-nietzsche";
import { ExistentialLens } from "../library/jean-paul-sartre";
import { createOrchestrationEvent } from "../db/nest/services/orchestration-event";

const checkpointer = new MemorySaver();

/**
 * @function knowledgeBot
 */
export const knowledgeBot = async (message: string, conversationId: string): Promise<string> => {
  let response = "";
  try {
    if (!message) {
      throw new NestError("Message is required", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    const foundConversation = await findOneConversation({
      _id: new mongoose.Types.ObjectId(conversationId),
    });

    
    const MODEL_MAPPING: { [key: string]: { model: string; tags: string[]; bot: Function } } = {
      "general": {
        model: "claude-3-5-haiku-latest",
        tags: ["general", "info", "information", "orchestration"],
        bot: (messages: BaseMessage[]) => SolitaryAphoristicNomad(messages),
      },
      "quality": {
        model: "claude-opus-4-20250514",
        tags: ["reasoning", "deep-thought", "choices", "options", "creativity", "creative"],
        bot: (messages: BaseMessage[]) => KonigsbergDreamer(messages),
      },
      "efficiency": {
        model: "claude-sonnet-4-20250514",
        tags: ["efficiency", "optimize", "high-level", "streamline", "productivity", "frameworks"],
        bot: (messages: BaseMessage[]) => ExistentialLens(messages),
      },
    }

    const orchestrationModel = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-opus-4-20250514",
    });

    type OrchestrationResponseType = keyof typeof MODEL_MAPPING['bot'];

    let orchestrationResponse = "" as OrchestrationResponseType;
    let retries = 0;
    while (!Object.keys(MODEL_MAPPING).includes(orchestrationResponse) && retries < 3) {
      const stream = await orchestrationModel.stream([{
        role: "system",
        content: `
        ${MODEL_MAPPING}

        You are an orchestration bot whose purpose is to determine if a user's query should be handled by the 
        'General Knowledge Bot', 'Efficiency Bot', or 'Quality Bot' based on the tags of the orchestration mappings.
        Only respond with the shorthand name of the bot: 'general', 'efficiency', or 'quality'. If you are unsure use
        'general' bot.`,
      },
      {
        role: "user",
        content: message,
      }]);

      console.log("Orchestration stream started...");
      for await (const chunk of stream) {
        orchestrationResponse += chunk.content;
      }
      console.log("Final orchestration response: ", orchestrationResponse);
      orchestrationResponse = "general" as OrchestrationResponseType; // Temporary fix until streaming works
      if (!Object.keys(MODEL_MAPPING).includes(orchestrationResponse)) {
        retries += 1;
      } else {
        await createOrchestrationEvent({
          conversation: new mongoose.Types.ObjectId(conversationId),
          selectedModel: MODEL_MAPPING[orchestrationResponse].model,
          tags: MODEL_MAPPING[orchestrationResponse].tags,
          user: foundConversation.user,
          createdAt: new Date(),
          triggerMessage: message,
        });
      }
    }

    if (!Object.keys(MODEL_MAPPING).includes(orchestrationResponse)) {
      orchestrationResponse = "general" as OrchestrationResponseType;
    }

    const agent = entrypoint({ name: "agent", checkpointer }, async (messages: BaseMessage[]) => {
      const previous = getPreviousState<BaseMessage[]>() ?? [];
      const modelResponse = await MODEL_MAPPING[orchestrationResponse].bot([...previous, ...messages]);

      messages = addMessages(messages, [new AIMessage(modelResponse)]);
      return messages;
    });
    const previousState = await agent.getState({ configurable: { thread_id: conversationId } });
    console.log("Previous state:", previousState);

    const agentResponse = await agent.invoke(
      [new HumanMessage(message)],
      { configurable: { thread_id: conversationId } },
    );

    response = agentResponse[agentResponse.length - 1].text;

    await createMessage({
      body: response,
      createdAt: new Date(),
      sender: "bot",
      conversation: new mongoose.Types.ObjectId(conversationId),
      modelUsed: MODEL_MAPPING[orchestrationResponse].model,
    });

    await updateOneConversation({
      _id: new mongoose.Types.ObjectId(conversationId),
    }, {
      updatedAt: new Date(),
      lastMessage: response,
    });

    return response;
  } catch (error: unknown) {
    response = JSON.stringify(error);
    console.error(`Error using knowledge bot: ${error}`);
  } finally {
    return response;
  }
}