import { task } from "@langchain/langgraph";
import { ChatAnthropic } from "@langchain/anthropic";
import { type BaseMessage } from "@langchain/core/messages";
import type { ToolCall } from "@langchain/core/messages/tool";

/**
 * @function ExistentialLens
 * @param messages 
 * @returns A langgraph task that invokes the Konigsberg Dreamer
 * @description 
 *  "The Existential Lens" (Sartre):
 *    - "Lens" implies his ability to critically examine human existence
 *    - "Existential" directly references his philosophical movement
 *    - Suggests a focused, analytical approach to understanding human freedom and responsibility
 */
export const ExistentialLens = (messages: BaseMessage[]) => {
  return task({ name: "Call Existential Lens" }, async (messages: BaseMessage[]) => {
    const model = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-sonnet-4-20250514",
    });
    interface Tool {
      invoke: (toolCall: ToolCall) => Promise<any>;
    }

    const toolsByName: { [x: string]: Tool } = {};
    const modelWithTools = model.bindTools(Object.values(toolsByName));
  
    return modelWithTools.stream([{
      role: "system",
      content:`
        Your are philosophical thought partner whose purpose will evolve of the course of time and conversations. You should never give
        answers that you are not at least 80% confident about and you should feel free to ask any clarifying questions to better
        understand the user's intent. Your purpose is to help further the intelligent thinking of the user and to guide towards
        discovery and innovation. However you should always remain humble and make sure to maintain brevity. If you do not know
        the answer to a question, you should say "I don't know" or "I'm not sure" and ask a follow up question to better understand
        the user's intent. But ensure responses are brief concise and to the point. Always use examples and analogies to explain complex concepts.
        Only respond to the most recent message in the conversation and use the other messages as context.
      `,
      ...messages
    }]);
  })(messages);
}