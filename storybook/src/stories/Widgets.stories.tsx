import { useState } from "react";
import {
  BaseWidget,
  MessageContent,
  Question,
  WidgetProvider,
} from "@sarchauhan/chat";
import type { Meta, StoryObj } from "@storybook/react";
import { storybookWidgets } from "../mocks/widgets";

type WidgetStoryArgs = {
  kind: "question" | "counter" | "missing";
  interactive: boolean;
  label: string;
  title: string;
  status: string;
  meta: string;
};

const meta: Meta<WidgetStoryArgs> = {
  title: "Widgets/Registry",
  tags: ["autodocs"],
  args: {
    kind: "question",
    interactive: true,
    label: "Widget",
    title: "Base card",
    status: "Active",
    meta: "meta information goes here",
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["question", "counter", "missing"],
      description: "Registered widget fixture to render in an assistant message.",
    },
    interactive: {
      control: "boolean",
      description: "Whether the agent part accepts a response from the user.",
    },
    label: { control: "text" },
    title: { control: "text" },
    status: { control: "text" },
    meta: { control: "text" },
  },
};

export default meta;

export const Base: StoryObj<WidgetStoryArgs> = {
  name: "Base widget",
  render: ({ label, title, status, meta }) => (
    <BaseWidget label={label} title={title} status={status} meta={meta}>
      <p style={{ margin: 0 }}>
        A structural primitive for widget authors: label, title, status, metadata and arbitrary
        content remain inside the surrounding chat conversation.
      </p>
    </BaseWidget>
  ),
};

export const QuestionCard: StoryObj<WidgetStoryArgs> = {
  name: "Question",
  render: () => (
    <Question
      prompt="Which language for the new service?"
      options={["TypeScript", "Go", "Rust"]}
    />
  ),
};

const WidgetConversation = ({ kind, interactive }: Pick<WidgetStoryArgs, "kind" | "interactive">) => {
  const [lastResponse, setLastResponse] = useState<string>();
  const name = kind === "missing" ? "not_registered" : kind;

  return (
    <WidgetProvider
      widgets={storybookWidgets}
      respondToWidget={async (response) => {
        setLastResponse(
          typeof response.value === "string" ? response.value : JSON.stringify(response.value),
        );
      }}
    >
      <MessageContent
        parts={[
          { type: "text", text: "I need one detail before I can continue." },
          {
            type: "widget",
            name,
            id: `storybook-${name}`,
            props:
              kind === "counter"
                ? {}
                : {
                    prompt: "Which language for the new service?",
                    options: ["TypeScript", "Go", "Rust"],
                  },
            interactive,
          },
        ]}
      />
      {lastResponse ? (
        <p className="chat-message-usage">Last response: {lastResponse}</p>
      ) : null}
    </WidgetProvider>
  );
};

export const RegisteredWidget: StoryObj<WidgetStoryArgs> = {
  render: ({ kind, interactive }) => (
    <WidgetConversation kind={kind} interactive={interactive} />
  ),
};
