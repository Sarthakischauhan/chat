import type { UIMessage } from "ai";
import {
  consumeStream,
  createIdGenerator,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { saveThreadMessages } from "@/lib/db/chat";

const MOCK_REPLY_PONG = "pong";
const MOCK_REPLY_TIME = "It is 12:00 PM UTC.";
const MOCK_REPLY_DEFAULT = "Hello from the Chat SDK mock provider.";

const userText = (message: UIMessage) =>
  message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join(" ");

export const cannedAssistantText = (message: UIMessage) => {
  const text = userText(message).toLowerCase();

  if (/\bpong\b/.test(text)) {
    return MOCK_REPLY_PONG;
  }

  if (/what time|current time|timezone/.test(text)) {
    return MOCK_REPLY_TIME;
  }

  return MOCK_REPLY_DEFAULT;
};

export const streamMockChatResponse = ({
  threadId,
  messages,
  modelId,
}: {
  threadId: string;
  messages: UIMessage[];
  modelId: string;
}) => {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  const reply = lastUser ? cannedAssistantText(lastUser) : MOCK_REPLY_DEFAULT;
  const generateMessageId = createIdGenerator({
    prefix: "msg",
    size: 16,
  });

  const stream = createUIMessageStream({
    originalMessages: messages,
    generateId: generateMessageId,
    execute: ({ writer }) => {
      const id = "text-1";
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: reply });
      writer.write({ type: "text-end", id });
    },
    onFinish: async ({ messages: responseMessages }) => {
      await saveThreadMessages({
        threadId,
        messages: responseMessages,
        provider: "mock",
        model: modelId,
      });
    },
  });

  return createUIMessageStreamResponse({
    stream,
    consumeSseStream: consumeStream,
  });
};
