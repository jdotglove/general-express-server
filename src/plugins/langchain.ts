import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { 
    entrypoint, 
    addMessages, 
    getPreviousState,
    MemorySaver,
    task,
} from "@langchain/langgraph";
import { 
    AIMessage, 
    BaseMessage, 
    HumanMessage, 
    type BaseMessage as LangchainBaseMessageType,
} from "@langchain/core/messages";
import { type ToolCall as LangchainToolCallType } from "@langchain/core/messages/tool";

export default {
    Anthropic: {
        ChatAnthropic,
    },
    OpenAI: {
        ChatOpenAI,
    },
    LangGraph: {
        Entrypoint: entrypoint,
        AddMessages: addMessages,
        GetPreviousState: getPreviousState,
        MemorySaver,
        Task: task,
    },
    Core: {
        AIMessage,
        BaseMessage,
        HumanMessage,
    },
}

export type BaseMessageType = LangchainBaseMessageType;
export type ToolCallType = LangchainToolCallType;