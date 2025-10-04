import "dotenv/config";
import mongoose from "mongoose";
import { ChatAnthropic } from "@langchain/anthropic";

import { SERVER_RESPONSE_CODES } from "../utils/constants";
import { NestError } from "../utils/errors";
import { createMessage } from "../db/nest/services/message";

/**
 * @function knowledgeBot
 */
export const knowledgeBot = async (message: string, userId: string, conversationId: string): Promise<string> => {
  let response = "";
  try {
    if (!message) {
      throw new NestError("Message is required", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    await createMessage({ 
      body: message, 
      createdAt: new Date(), 
      sender: "user", 
      user: new mongoose.Types.ObjectId(userId),
      conversation: new mongoose.Types.ObjectId(conversationId),
    });
    const MODEL_MAPPING = {
      "general": {
        model: "claude-3-5-haiku-latest",
        keys: ["general", "info", "information", "orchestration"],
      },
      "quality": {
        model: "claude-opus-4-20250514",
        keys: ["reasoning", "deep-thought", "choices", "options", "creativity", "creative" ],
      },
      "efficiency": {
        model: "claude-sonnet-4-20250514",
        keys: ["efficiency", "optimize", "high-level", "streamline", "productivity", "frameworks"],
      },
    }
    const model = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: MODEL_MAPPING["general"].model,
    });

    const stream = await model.stream([{
      role: "system",
      content: `
        Your are philosophical thought partner whose purpose will evovle of the course of time and conversations.
        You should never give answers that you are not at least 80% confident about and you should feel free to ask
        any clarifying questions to better understand the user's intent. Your purpose is to help further the intelligent
        thinking of the user and to guide towards discovery and innovation. However you should always remain humble and
        make sure to maintain brevity. If you do not know the answer to a question, you should say "I don't know" or 
        "I'm not sure" and ask a follow up question to better understand the user's intent. But ensure responses are brief
        concise and to the point. Always use examples and analogies to explain complex concepts.
      `,
    }, {
      role: "user",
      content: message,
    }]);

    for await (const chunk of stream) {
      response += chunk.content;
    };

    await createMessage({ 
      body: response, 
      createdAt: new Date(), 
      sender: "bot",
      conversation: new mongoose.Types.ObjectId(conversationId),
    });
    return response;
  } catch (error: unknown) {
    response = JSON.stringify(error);
    console.error(`Error using knowledge bot: ${error}`);
  } finally {
    return response;
  }
}