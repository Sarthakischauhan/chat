import { useState } from "react";
import {
  BaseWidget,
  defineWidget,
  questionWidget,
  type ChatWidgetInput,
  type WidgetControls,
} from "@sarchauhan/chat";

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
  questionWidget,
  defineWidget("counter", CounterWidget, {
    label: "Counter",
    title: "Live counter",
  }),
];
