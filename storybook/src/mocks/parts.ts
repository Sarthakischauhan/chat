import type { AgentPart, ChatMessage } from "@sarchauhan/chat";

export const SVG_CHART =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='80' viewBox='0 0 160 80'%3E%3Crect width='160' height='80' rx='10' fill='%2310a37f' fill-opacity='0.08'/%3E%3Crect x='18' y='44' width='22' height='24' rx='3' fill='%2310a37f'/%3E%3Crect x='48' y='32' width='22' height='36' rx='3' fill='%2310a37f' fill-opacity='0.72'/%3E%3Crect x='78' y='22' width='22' height='46' rx='3' fill='%2310a37f' fill-opacity='0.46'/%3E%3Crect x='108' y='12' width='22' height='56' rx='3' fill='%2310a37f' fill-opacity='0.24'/%3E%3C/svg%3E";

export const userReferenceText = [
  "Use the following selected references as context:",
  "",
  "<reference 1>",
  "React 19 release notes — Actions and useActionState",
  "</reference 1>",
  "",
  "User message:",
  "Summarize streaming in React",
].join("\n");

/** A single assistant turn that exercises every part type. */
export const richAssistantParts: AgentPart[] = [
  {
    type: "reasoning",
    state: "done",
    text: "The user wants a short answer. One line, plus a tiny code sample.",
  },
  {
    type: "tool",
    toolName: "list_files",
    toolCallId: "call_9f2a",
    state: "output-available",
    title: "Read project files",
    input: { path: "packages/chat/src" },
    output: { files: ["message.tsx", "message.thinking.tsx", "message.feedback.tsx"] },
  },
  {
    type: "tool",
    toolName: "write_file",
    toolCallId: "call_write_1",
    state: "output-available",
    title: "Write file",
    input: { path: "packages/chat/src/components/Message/message.part.tool.tsx" },
    output: {
      path: "packages/chat/src/components/Message/message.part.tool.tsx",
      lines: 204,
      additions: 74,
      deletions: 41,
    },
  },
  {
    type: "tool",
    toolName: "web_search",
    toolCallId: "call_7b01",
    state: "input-streaming",
    title: "Search the web",
    input: { query: "react streaming patterns" },
  },
  {
    type: "text",
    text: `**One line:** the chat package turns agent output into themeable message *parts* — text, thinking, tools, sources and data.

\`\`\`ts
const parts = normalizeAgentParts(raw);
return <MessageContent parts={parts} />;
\`\`\``,
  },
  {
    type: "source-url",
    sourceId: "src_1",
    url: "https://example.com/docs",
    title: "Chat package — docs",
  },
  {
    type: "source-document",
    sourceId: "src_2",
    mediaType: "application/pdf",
    title: "Design spec",
    filename: "design-spec.pdf",
  },
  {
    type: "file",
    mediaType: "image/svg+xml",
    url: SVG_CHART,
    filename: "usage.svg",
  },
  {
    type: "data",
    name: "agent.progress",
    data: { step: 3, total: 5, label: "Summarizing sources" },
  },
];

export const usageParts: { type: "data"; name: string; data: unknown }[] = [
  {
    type: "data",
    name: "usage",
    data: { input_tokens: 8421, output_tokens: 1204, reasoning_tokens: 633, total_tokens: 10258 },
  },
  {
    type: "data",
    name: "context",
    data: { current_tokens: 41206, context_window: 200000 },
  },
];

export const demoMessages: ChatMessage[] = [
  {
    id: "msg_user",
    role: "user",
    parts: [{ type: "text", text: "Explain this package in one line." }],
  },
  {
    id: "msg_assistant",
    role: "assistant",
    parts: [
      ...richAssistantParts.slice(0, 6),
      {
        type: "data",
        name: "usage",
        data: { input_tokens: 1234, output_tokens: 567, reasoning_tokens: 210, total_tokens: 2011 },
      },
      {
        type: "data",
        name: "context",
        data: { current_tokens: 3200, context_window: 200000 },
      },
    ],
  },
];
