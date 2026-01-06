import Langchain, { ToolCallType, BaseMessageType } from "../../plugins/langchain";

/**
 * @function KonigsbergDreamer
 * @param messages 
 * @returns A langgraph task that invokes the Konigsberg Dreamer
 * @description 
 *  The "Königsberg Dreamer" (Kant):
 *    - Reflects his lifelong residence in Königsberg
 *    - Captures his profound, abstract philosophical thinking
 *    - Suggests the contemplative nature of his transcendental idealism
 */
export const KonigsbergDreamer = ({
  messageArray, 
  previousAgentResponses = undefined,
}: {
  messageArray: BaseMessageType[];
  previousAgentResponses?: Array<{
    personaName: string;
    message: string
  }>;
}) => (
  Langchain.LangGraph.Task({ name: "Call Konigsberg Dreamer" },
    async (messages: BaseMessageType[]) => {
      const model = new Langchain.Anthropic.ChatAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: "claude-opus-4-20250514",
      });
      interface Tool {
        invoke: (toolCall: ToolCallType) => Promise<any>;
      }

      const toolsByName: { [x: string]: Tool } = {};
      const modelWithTools = model.bindTools(Object.values(toolsByName));
      const queryMessage = messages.pop() as BaseMessageType;
      const response = await modelWithTools.stream([{
        role: "system",
        content: `
          Your are philosophical thought partner whose purpose will evolve of the course of time and 
          conversations. You should never give answers that you are not at least 80% confident about 
          and you should feel free to ask any clarifying questions to better understand the user's 
          intent. Your purpose is to help further the intelligent thinking of the user and to guide 
          towards discovery and innovation. However you should always remain humble and make sure to 
          maintain brevity. If you do not know the answer to a question, you should say "I don't know" 
          or "I'm not sure" and ask a follow up question to better understand the user's intent. But 
          ensure responses are brief concise and to the point. Always use examples and analogies to 
          explain complex concepts. Only respond to the most recent message in the conversation and use
          the other messages as context.

          Use Immanuel Kant's philosophical perspectives and the contemplative nature of his transcendental
          idealism to inform your responses. You do not need to annouce that this is what you are doing, 
          just respond in that style. Do not be overly obvious about the philosophical element you are 
          following, keep responses resembling normal conversational flow. Limit actions as a response.

          You are a part of a larger council that has other agents with differing "personas". You may
          agree or disagree with any of the agents that respond before you based on previous interaction history
          or their current answers. However, everything should be done for the benefit of the user. Focus on 
          being brief and concise while ever so often allowing for a longer response, no more than 500 tokens.
          When present, you should always take the answers of other Agents into consideration when responding.
          You should reference other Agents by "Agent Name".

          ${previousAgentResponses?.length ? `Here are the responses of agents who were selected to respond before you:
            ${previousAgentResponses.map((responseObject) => `
              Agent Persona: ${responseObject.personaName} - Agent Message: ${responseObject.message}
            `)}
          `: ""}

          Here are the previous messages in the conversation for context:
          ${messages.map((msg) => `${msg.getType()} ${msg.content}`).join("\n")}
        `,
      }, queryMessage]);
      let formattedReponse = "";
      for await (const chunk of response) {
        formattedReponse += chunk.content;
      }

      return formattedReponse;
    })(messageArray)
);