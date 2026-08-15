import type { ChatAdapter, ChatMessagePart } from "@sarchauhan/chat";
import { demoMessages } from "./parts";

export const noRegistryUrl = "/api/storybook__no__registry";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const assistantId = "assistant-response";

/** Progressive states of a single assistant turn, streamed one by one. */
export type StreamStep = {
  parts: ChatMessagePart[];
  wait?: number;
};

export const createScriptedAdapter = (
  script: (userText: string) => StreamStep[],
): ChatAdapter => ({
  sendMessage: async function* ({ message }) {
    const userText = message.parts
      .filter((part) => part.type === "text")
      .map((part) => ("text" in part ? String(part.text) : ""))
      .join("\n")
      .trim();

    for (const step of script(userText)) {
      if (step.wait) {
        await sleep(step.wait);
      }
      yield { id: assistantId, role: "assistant", parts: step.parts };
    }
  },
});

const summaryStep = (count: number) =>
  "A **streaming** assistant answers `" +
  String(count) +
  "` questions with message *parts* — reasoning, tools and text arrive as they stream.";

export const interactiveScript = (userText: string): StreamStep[] => {
  const question = userText.slice(0, 40);

  return [
    {
      wait: 250,
      parts: [
        {
          type: "reasoning",
          state: "streaming",
          text: `Breaking down “${question}” into reasoning, a tool call and a short answer…`,
        },
      ],
    },
    {
      wait: 700,
      parts: [
        {
          type: "reasoning",
          state: "done",
          text: `Breaking down “${question}” into reasoning, a tool call and a short answer…`,
        },
        {
          type: "tool",
          toolName: "web_search",
          toolCallId: "call_stream_1",
          state: "input-streaming",
          title: "Search the web",
          input: { query: question },
        },
      ],
    },
    {
      wait: 600,
      parts: [
        {
          type: "reasoning",
          state: "done",
          text: `Breaking down “${question}” into reasoning, a tool call and a short answer…`,
        },
        {
          type: "tool",
          toolName: "web_search",
          toolCallId: "call_stream_1",
          state: "output-available",
          title: "Search the web",
          input: { query: question },
          output: { results: ["…", "…", "…"] },
        },
        { type: "text", state: "streaming", text: summaryStep(0) },
      ],
    },
    {
      wait: 900,
      parts: [
        {
          type: "reasoning",
          state: "done",
          text: `Breaking down “${question}” into reasoning, a tool call and a short answer…`,
        },
        {
          type: "tool",
          toolName: "web_search",
          toolCallId: "call_stream_1",
          state: "output-available",
          title: "Search the web",
          input: { query: question },
          output: { results: ["…", "…", "…"] },
        },
        { type: "text", state: "done", text: summaryStep(42) },
        {
          type: "data",
          name: "usage",
          data: { input_tokens: 401, output_tokens: 96, reasoning_tokens: 47, total_tokens: 544 },
        },
        {
          type: "data",
          name: "context",
          data: { current_tokens: 2541, context_window: 200000 },
        },
      ],
    },
  ];
};

export const interactiveAdapter = createScriptedAdapter(interactiveScript);

export const existingThreadAdapter: ChatAdapter = {
  loadMessages: async () => demoMessages,
  sendMessage: async function* () {},
};
