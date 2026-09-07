import {
  MessageContent,
  Question,
  ThinkingBlock,
  ToolChip,
  WidgetProvider,
} from "@sarchauhan/chat";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Primitives",
  parameters: {
    hideComposer: true,
  },
} satisfies Meta;

export default meta;

export const Tool: StoryObj = {
  name: "Tool",
  render: () => (
    <div className="chat-tool-list">
      <ToolChip label="Thinking" detail="Planning the chip layout…" state="complete" />
      <ToolChip label="Write 204 lines" detail="ChurnSchedule.tsx" state="complete" />
      <ToolChip label="Rebuild and verify" detail="npm run build:chat" state="running" />
    </div>
  ),
};

export const GroupedToolsLive: StoryObj = {
  name: "Grouped tools — live",
  render: () => (
    <MessageContent
      parts={[
        {
          type: "tool",
          toolName: "think",
          toolCallId: "primitive-tool-think",
          state: "output-available",
          title: "Thinking",
          input: { query: "Planning the chip layout…" },
        },
        {
          type: "tool",
          toolName: "write_file",
          toolCallId: "primitive-tool-write",
          state: "output-available",
          title: "Write file",
          input: { path: "ChurnSchedule.tsx" },
          output: { path: "ChurnSchedule.tsx", lines: 204, additions: 74, deletions: 41 },
        },
        {
          type: "tool",
          toolName: "run_command",
          toolCallId: "primitive-tool-run",
          state: "input-streaming",
          title: "Rebuild and verify",
          input: { command: "npm run build:chat" },
        },
        {
          type: "data",
          name: "diffs",
          data: {
            files: [
              { file: "flavors.css", additions: 13 },
              { file: "ChurnSchedule.tsx", additions: 74, deletions: 41 },
              { file: "menu.ts", additions: 8, deletions: 2 },
            ],
          },
        },
      ]}
    />
  ),
};

export const GroupedToolsComplete: StoryObj = {
  name: "Grouped tools — complete",
  render: () => (
    <MessageContent
      parts={[
        {
          type: "tool",
          toolName: "think",
          toolCallId: "primitive-done-think",
          state: "output-available",
          title: "Thinking",
          input: { query: "Planning the chip layout…" },
        },
        {
          type: "tool",
          toolName: "write_file",
          toolCallId: "primitive-done-write",
          state: "output-available",
          title: "Write file",
          input: { path: "ChurnSchedule.tsx" },
          output: { path: "ChurnSchedule.tsx", lines: 204, additions: 74, deletions: 41 },
        },
        {
          type: "tool",
          toolName: "run_command",
          toolCallId: "primitive-done-run",
          state: "output-available",
          title: "Rebuild and verify",
          input: { command: "npm run build:chat" },
          output: { command: "npm run build:chat" },
        },
        {
          type: "tool",
          toolName: "read_image",
          toolCallId: "primitive-done-image",
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
            ],
          },
        },
      ]}
    />
  ),
};

export const Thinking: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <ThinkingBlock isComplete={false}>
        <div className="md-thinking-body">
          Parsing the incoming stream and mapping parts…
        </div>
      </ThinkingBlock>
      <ThinkingBlock isComplete elapsedMs={4_000}>
        <div className="md-thinking-body">
          The response trace stays available without a card around it.
        </div>
      </ThinkingBlock>
    </div>
  ),
};

export const Code: StoryObj = {
  render: () => (
    <MessageContent
      parts={[
        {
          type: "text",
          text: `The same reading column hosts fenced code without a framed card.

\`\`\`ts
const parts = normalizeAgentParts(raw);
return <MessageContent parts={parts} />;
\`\`\``,
        },
      ]}
    />
  ),
};

export const QuestionStory: StoryObj = {
  name: "Question",
  render: () => (
    <WidgetProvider respondToWidget={async () => undefined}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        <Question
          prompt="Which language for the new service?"
          options={["TypeScript", "Go", "Rust"]}
        />
        <MessageContent
          parts={[
            { type: "text", text: "I need one detail before I can continue." },
            {
              type: "widget",
              name: "question",
              id: "primitive-question",
              props: {
                prompt: "Ship the crisp chrome pass?",
                options: ["Yes, this week", "Hold for review", "Split the PR"],
              },
              interactive: true,
            },
          ]}
        />
      </div>
    </WidgetProvider>
  ),
};
