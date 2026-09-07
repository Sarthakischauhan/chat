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
  name: "Tool chips",
  render: () => (
    <MessageContent
      parts={[
        {
          type: "tool",
          toolName: "think",
          toolCallId: "storybook-tool-think",
          state: "output-available",
          title: "Thinking",
          input: { query: "Planning the chip layout…" },
        },
        {
          type: "tool",
          toolName: "write_file",
          toolCallId: "storybook-tool-write",
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
          toolName: "run_command",
          toolCallId: "storybook-tool-run",
          state: "input-streaming",
          title: "Rebuild and verify",
          input: { command: "npm run build:chat" },
        },
        {
          type: "tool",
          toolName: "read_image",
          toolCallId: "storybook-tool-image",
          state: "output-available",
          title: "Read image",
          input: { filename: "flavor-chart.png" },
        },
        {
          type: "data",
          name: "diffs",
          data: {
            files: [
              { file: "flavors.css", additions: 13 },
              { file: "ChurnSchedule.tsx", additions: 74, deletions: 41 },
              { file: "menu.ts", additions: 8, deletions: 2 },
              { file: "index.ts", additions: 4 },
              { file: "tokens.css", additions: 6, deletions: 1 },
            ],
          },
        },
      ]}
    />
  ),
};

export const ToolStates: StoryObj = {
  name: "Tool states",
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

export const TaskRows: StoryObj = {
  name: "Task rows",
  render: () => (
    <MessageContent
      parts={[
        {
          type: "data",
          name: "tasks",
          data: {
            items: [
              {
                id: "task-1",
                title: "Verified vendor coverage",
                meta: "12 suppliers",
                status: "completed",
              },
              {
                id: "task-2",
                title: "Build reorder task list",
                meta: "7 SKUs",
                status: "running",
                step: 2,
              },
              {
                id: "task-3",
                title: "Publish inventory snapshot",
                meta: "blocked on approval",
                status: "failed",
              },
            ],
          },
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
