"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { MessageCopy } from "./message.copy";
import { MessageRegenerate } from "./message.regenerate";

type MessageFeedbackProps = {
  responseText: string;
  onRegenerate: () => void;
  canRegenerate: boolean;
  disabled?: boolean;
};

export const MessageFeedback = ({
  responseText,
  onRegenerate,
  canRegenerate,
  disabled = false,
}: MessageFeedbackProps) => {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  // An assistant placeholder is created before streaming starts. Actions on it
  // are misleading (and copy an empty string), so wait for visible text.
  if (!responseText.trim()) {
    return null;
  }

  return (
    <div className="chat-message-feedback" aria-label="Message actions">
      <MessageCopy text={responseText} disabled={disabled} />
      <MessageRegenerate
        onRegenerate={onRegenerate}
        disabled={!canRegenerate || disabled}
      />
      <button
        type="button"
        className={`chat-feedback-button${feedback === "up" ? " is-selected" : ""}`}
        title="Good response"
        aria-label="Good response"
        aria-pressed={feedback === "up"}
        onClick={() => setFeedback(feedback === "up" ? null : "up")}
        disabled={disabled}
      >
        <ThumbsUp size={18} />
      </button>
      <button
        type="button"
        className={`chat-feedback-button${feedback === "down" ? " is-selected" : ""}`}
        title="Poor response"
        aria-label="Poor response"
        aria-pressed={feedback === "down"}
        onClick={() => setFeedback(feedback === "down" ? null : "down")}
        disabled={disabled}
      >
        <ThumbsDown size={18} />
      </button>
    </div>
  );
};
