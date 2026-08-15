import { useState } from "react";
import {
  BaseWidget,
  defineWidget,
  type ChatWidgetInput,
  type WidgetControls,
} from "@sarchauhan/chat";

export const PollWidget = ({
  options = [],
  question,
  widget,
}: {
  options?: string[];
  question?: string;
  widget: WidgetControls;
}) => {
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <BaseWidget
      label="Question"
      title={question ?? "Choose an option"}
      status={widget.disabled || answer ? "Answered" : "Answer"}
    >
      <div className="chat-widget-options">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="chat-widget-option"
            data-selected={answer === option}
            disabled={widget.disabled || answer !== null}
            onClick={() => {
              setAnswer(option);
              void widget.respond(option, option);
            }}
          >
            <span className="chat-widget-option-text">{option}</span>
            <span className="chat-widget-option-check" aria-hidden="true">
              {answer === option ? "✓" : ""}
            </span>
          </button>
        ))}
      </div>
    </BaseWidget>
  );
};

const CounterWidget = ({ widget }: { widget: WidgetControls }) => {
  const [count, setCount] = useState(0);

  return (
    <BaseWidget
      label="Counter"
      title="Live counter"
      status={widget.disabled ? "Sent" : "Interactive"}
    >
      <div className="chat-widget-options">
        <button
          type="button"
          className="chat-widget-option"
          disabled={widget.disabled}
          onClick={() => {
            const next = count + 1;
            setCount(next);
            void widget.respond(next, `Count ${next}`);
          }}
        >
          <span className="chat-widget-option-text">Increment</span>
          <span className="chat-widget-option-check" aria-label={`${count} clicks`}>
            {count}
          </span>
        </button>
      </div>
    </BaseWidget>
  );
};

export const storybookWidgets: ChatWidgetInput = [
  defineWidget<{ options?: string[]; question?: string }>("poll", PollWidget, {
    label: "Question",
    title: "Poll",
  }),
  defineWidget("counter", CounterWidget, {
    label: "Counter",
    title: "Live counter",
  }),
];
