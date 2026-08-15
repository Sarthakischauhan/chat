import { MessageContent, type AgentPart } from "@sarchauhan/chat";
import type { Meta, StoryObj } from "@storybook/react";
import { richAssistantParts, userReferenceText } from "../mocks/parts";

type MessageStoryArgs = {
  isUser: boolean;
  streamState: "streaming" | "complete";
  parts: AgentPart[];
};

const meta: Meta<MessageStoryArgs> = {
  title: "Messages/Content",
  component: MessageContent,
  tags: ["autodocs"],
  parameters: { hideComposer: true },
  args: {
    isUser: false,
    streamState: "complete",
    parts: richAssistantParts,
  },
  argTypes: {
    parts: {
      control: false,
      description: "Message parts are fixture data; use the named stories to inspect supported part shapes.",
    },
    isUser: {
      control: "boolean",
      description: "Renders content with user-message parsing and styling.",
    },
    streamState: {
      control: "inline-radio",
      options: ["streaming", "complete"],
      description: "Changes the reasoning and text completion state in the streaming fixture.",
    },
  },
};

export default meta;

export const AllParts: StoryObj<MessageStoryArgs> = {
  name: "Tool chips and sources",
  args: {
    parts: richAssistantParts,
  },
  render: ({ parts, isUser }) => <MessageContent parts={parts} isUser={isUser} />,
};

export const AssistantReply: StoryObj<MessageStoryArgs> = {
  args: {
    parts: [
      {
        type: "reasoning",
        state: "done",
        text: "The user asked for a one-line summary, so keep it tight.",
      },
      {
        type: "text",
        text: "The chat package turns agent output into themeable message parts.",
      },
    ],
  },
  render: ({ parts, isUser }) => <MessageContent parts={parts} isUser={isUser} />,
};

export const UserWithReferences: StoryObj<MessageStoryArgs> = {
  args: {
    isUser: true,
    parts: [{ type: "text", text: userReferenceText }],
  },
  render: ({ parts, isUser }) => <MessageContent parts={parts} isUser={isUser} />,
};

export const Streaming: StoryObj<MessageStoryArgs> = {
  args: {
    streamState: "streaming",
    parts: [],
  },
  render: ({ streamState }) => {
    const isComplete = streamState === "complete";

    return (
      <MessageContent
        parts={[
          {
            type: "reasoning",
            state: isComplete ? "done" : "streaming",
            text: "Parsing the incoming stream and mapping parts…",
          },
          {
            type: "text",
            state: isComplete ? "done" : "streaming",
            text: "A streaming assistant renders each state without changing the surrounding conversation layout.",
          },
        ]}
      />
    );
  },
};
