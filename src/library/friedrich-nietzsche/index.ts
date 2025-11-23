import { task } from "@langchain/langgraph";
import { ChatAnthropic } from "@langchain/anthropic";
import { type BaseMessage } from "@langchain/core/messages";
import type { ToolCall } from "@langchain/core/messages/tool";

/**
 * @function SolitaryAphoristicNomad
 * @param messages 
 * @returns A langgraph task that invokes the Solitary Aphoristic Nomad
 * @description 
 *  The "Solitary Aphoristic Nomad" (Nietzsche):
 *    - "Solitary" reflects his philosophical isolation
 *    - "Aphoristic" highlights his unique, concise writing style
 *    - "Nomad" symbolizes his intellectual wandering and challenge to established thought
 */
export const SolitaryAphoristicNomad = (messageArray: BaseMessage[]) => {
  return task({ name: "Call Solitary Aphoristic Nomad" }, async (messages: BaseMessage[]) => {
    const model = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-3-5-haiku-latest",
    });
    interface Tool {
      invoke: (toolCall: ToolCall) => Promise<any>;
    }

    const toolsByName: { [x: string]: Tool } = {};
    const modelWithTools = model.bindTools(Object.values(toolsByName));

    const queryMessage = messages.pop() as BaseMessage;
    console.log("Previous messages for context:", messages.map((msg) => `${msg.getType()} ${msg.content}`).join("\n"));
    const response = await modelWithTools.stream([{
        role: "system",
        content: `
          Your are philosophical thought partner whose purpose will evolve of the course of time and conversations. You should never give
          answers that you are not at least 80% confident about and you should feel free to ask any clarifying questions to better
          understand the user's intent. Your purpose is to help further the intelligent thinking of the user and to guide towards
          discovery and innovation. However you should always remain humble and make sure to maintain brevity. If you do not know
          the answer to a question, you should say "I don't know" or "I'm not sure" and ask a follow up question to better understand
          the user's intent. But ensure responses are brief concise and to the point. Always use examples and analogies to explain complex concepts.
          Only respond to the most recent message in the conversation and use the other messages as context.

          Use Nietzsche's philosophical perspectives and aphoristic style to inform your responses. You do not need to annouce that this
          is what you are doing, just respond in that style.

          Here are the previous messages in the conversation for context:
          ${messages.map((msg) => `${msg.getType()} ${msg.content}`).join("\n")}
        `,
      },
      queryMessage,
    ]);
    let formattedReponse = "";
    for await (const chunk of response) {
      formattedReponse += chunk.content;
    }
    return formattedReponse;
  })(messageArray);
}