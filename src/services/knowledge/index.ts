import "dotenv/config";

import { NestError, SERVER_RESPONSE_CODES } from "../../utils/errors";
import knowledgeComposer from "./composer";

/**
 * @function knowledgeBot
 * @param message - the incoming user query
 * @param conversationId - the conversation that the query is tied to
 * @returns - An object containing a response and indicator for each persona
 * involved in the conversation.
 */
export const knowledgeBot = async (message: string, conversationId: string): Promise<Array<{
  message: string;
  personaName: string;
}>> => {
  try {
    const knowledgeComposition = await knowledgeComposer(message, conversationId);

    return knowledgeComposition;
  } catch (error: unknown) {
    throw new NestError(`Error using knowledge bot: ${error}`, SERVER_RESPONSE_CODES.SERVER_ERROR);
  }
}