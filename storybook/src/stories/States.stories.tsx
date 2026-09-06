import { LoadingState, MessageContent, ThinkingBlock } from "@sarchauhan/chat";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Messages/States",
  parameters: {
    hideComposer: true,
  },
} satisfies Meta;

export default meta;

export const Loading: StoryObj = {
  name: "Loading state",
  render: () => <LoadingState />,
};

export const Thinking: StoryObj = {
  name: "Thinking complete",
  render: () => (
    <ThinkingBlock isComplete elapsedMs={4_000}>
      <div className="md-thinking-body">
        The response trace remains available without taking focus away from the conversation.
      </div>
    </ThinkingBlock>
  ),
};

export const ThinkingPending: StoryObj = {
  name: "Thinking",
  render: () => (
    <ThinkingBlock isComplete={false}>
      <div className="md-thinking-body">
        Parsing the incoming stream and mapping parts…
      </div>
    </ThinkingBlock>
  ),
};

export const ToolChips: StoryObj = {
  name: "Tools",
  render: () => (
    <MessageContent
      parts={[
        {
          type: "tool",
          toolName: "list_files",
          toolCallId: "storybook-tool-1",
          state: "output-available",
          title: "Read project files",
          input: { path: "packages/chat/src/components" },
          output: { files: ["message.tsx", "message.thinking.tsx"] },
        },
        {
          type: "tool",
          toolName: "web_search",
          toolCallId: "storybook-tool-2",
          state: "input-streaming",
          title: "Search references",
          input: { query: "modern conversational interface patterns" },
        },
        {
          type: "tool",
          toolName: "run_command",
          toolCallId: "storybook-tool-3",
          state: "approval-requested",
          title: "Run command",
          input: { command: "bun run build:chat" },
        },
        {
          type: "tool",
          toolName: "read_file",
          toolCallId: "storybook-tool-4",
          state: "output-error",
          title: "Read missing file",
          input: { path: "does-not-exist.ts" },
          errorText: "ENOENT: no such file or directory",
        },
        {
          type: "tool",
          toolName: "delete_file",
          toolCallId: "storybook-tool-5",
          state: "output-denied",
          title: "Delete file",
          input: { path: "packages/chat/package.json" },
        },
      ]}
    />
  ),
};

export const SourcesAndFiles: StoryObj = {
  name: "Sources and files",
  render: () => (
    <MessageContent
      parts={[
        {
          type: "text",
          text: "Here are the citations and a generated preview.",
        },
        {
          type: "source-url",
          sourceId: "src_docs",
          url: "https://example.com/docs",
          title: "Chat package docs",
        },
        {
          type: "source-document",
          sourceId: "src_spec",
          mediaType: "application/pdf",
          title: "Design spec",
          filename: "design-spec.pdf",
        },
        {
          type: "file",
          mediaType: "text/plain",
          url: "https://example.com/notes.txt",
          filename: "notes.txt",
        },
      ]}
    />
  ),
};
