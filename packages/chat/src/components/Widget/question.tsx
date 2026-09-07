"use client";

import { useState } from "react";
import { defineWidget, type WidgetComponentProps } from "./widget.registry";

export type QuestionOption = string | { label: string; value: string };

export type QuestionProps = {
  prompt?: string;
  question?: string;
  options?: QuestionOption[];
  selected?: string | null;
  disabled?: boolean;
  onSelect?: (value: string, label: string) => void | Promise<void>;
};

export type QuestionWidgetProps = {
  prompt?: string;
  question?: string;
  options?: QuestionOption[];
};

export const normalizeQuestionOptions = (options: QuestionProps["options"] = []) =>
  options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );

export function Question({
  prompt,
  question,
  options: rawOptions = [],
  selected: selectedProp,
  disabled = false,
  onSelect,
}: QuestionProps) {
  const [selected, setSelected] = useState<string | null>(selectedProp ?? null);
  const heading = (prompt ?? question)?.trim();
  const options = normalizeQuestionOptions(rawOptions);
  const selectedLabel = options.find((option) => option.value === selected)?.label ?? selected;

  return (
    <div className="chat-question">
      {heading ? <div className="chat-question-prompt">{heading}</div> : null}
      <div className="chat-widget-options">
        {options.map((option) => {
          const isActive = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className="chat-widget-option"
              data-selected={isActive ? "true" : undefined}
              disabled={disabled}
              onClick={async () => {
                setSelected(option.value);
                await onSelect?.(option.value, option.label);
              }}
            >
              <span className="chat-widget-option-text">{option.label}</span>
            </button>
          );
        })}
      </div>
      {selectedLabel ? <div className="chat-widget-inline-meta">Selected: {selectedLabel}</div> : null}
    </div>
  );
}

function QuestionWidget({
  prompt,
  question,
  options,
  widget,
}: WidgetComponentProps<QuestionWidgetProps>) {
  return (
    <Question
      prompt={prompt}
      question={question}
      options={options}
      disabled={!widget.interactive || widget.disabled}
      onSelect={async (value, label) => {
        await widget.respond(value, label, value);
      }}
    />
  );
}

export const questionWidget = defineWidget<QuestionWidgetProps>("question", QuestionWidget, {
  label: "Question",
  title: (props) =>
    typeof props.prompt === "string"
      ? props.prompt
      : typeof props.question === "string"
        ? props.question
        : "Choose an option",
  status: (_props, widget) =>
    widget.interactive && !widget.disabled ? "Awaiting input" : "Locked",
  shell: false,
});
