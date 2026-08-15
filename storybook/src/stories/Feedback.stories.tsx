import { MessageFeedback } from "@sarchauhan/chat";
import type { Meta, StoryObj } from "@storybook/react";

type FeedbackStoryArgs = {
  canRegenerate: boolean;
  disabled: boolean;
  responseText: string;
  onRegenerate: () => void;
};

const meta: Meta<FeedbackStoryArgs> = {
  title: "Messages/Feedback",
  component: MessageFeedback,
  tags: ["autodocs"],
  parameters: { hideComposer: true },
  args: {
    responseText: "The chat package turns agent output into message parts.",
    canRegenerate: true,
    disabled: false,
    onRegenerate: () => undefined,
  },
  argTypes: {
    responseText: {
      control: "text",
      description: "Visible assistant response used by the copy action.",
    },
    canRegenerate: {
      control: "boolean",
      description: "Whether there is a preceding user message to regenerate from.",
    },
    disabled: {
      control: "boolean",
      description: "Matches the disabled state while a new response is streaming.",
    },
    onRegenerate: { control: false },
  },
};

export default meta;

export const Playground: StoryObj<FeedbackStoryArgs> = {
  render: (args) => <MessageFeedback {...args} />,
};
