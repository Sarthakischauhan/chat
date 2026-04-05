"use client";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat as useAiChat } from "@ai-sdk/react";
import { createContext, ReactNode, useContext, useReducer } from "react";

export enum ProviderId{
    OPENAI = "openai", 
    GOOGLE = "google", 
    CLAUDE = "anthropic"
}

export type ChatStatus = "submitted" | "streaming" | "ready" | "error";

export type SendMessage = (
  message: { text: string },
  options?: { body?: { provider?: string } },
) => Promise<void>;

type ChatAction = {
    type : "setInput";
    data : { input : string}
} | {
    type : "setProvider";
    data : { provider : ProviderId}    
}

type ChatState = {
    input: string;
    provider: ProviderId;
}

type ChatContextType = {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  messages: UIMessage[];
  status: ChatStatus;
  sendMessage: SendMessage;
  submitInput: () => Promise<void>;
};

const intialState = {
  input: "",
  provider: ProviderId.OPENAI,
};

const reducer = (state: ChatState, action: ChatAction) => {
  switch (action.type) {
    case "setInput":
      return { ...state, input: action.data?.input };
    case "setProvider":
      return { ...state, provider: action.data?.provider };
    default:
      return state;
  }
};

const ChatContext = createContext<ChatContextType | null>(null);

type ChatContextProviderProps = {
  children: ReactNode;
};

export const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, intialState);
  const { messages, sendMessage, status } = useAiChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const submitInput = async () => {
    const text = state.input.trim();
    if (!text) {
      return;
    }

    const provider = state.provider;
    dispatch({ type: "setInput", data: { input: "" } });

    try {
      await sendMessage({ text }, { body: { provider } });
    } catch (error) {
      dispatch({ type: "setInput", data: { input: text } });
      throw error;
    }
  };

  const defaultValue: ChatContextType = {
    state,
    dispatch,
    messages,
    status,
    sendMessage,
    submitInput,
  };

  return (
    <ChatContext.Provider value={defaultValue}>{children}</ChatContext.Provider>
  );
};

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used inside ChatProvider");
  }
  return ctx;
}
