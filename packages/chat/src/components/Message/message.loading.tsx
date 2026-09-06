"use client";

import { formatElapsed, useElapsedTime } from "../../lib/message/elapsed";

export { formatElapsed, formatElapsedWords, useElapsedTime } from "../../lib/message/elapsed";

type LoadingStateProps = {
  label?: string;
  compact?: boolean;
};

export const LoadingState = ({ label = "Working", compact = false }: LoadingStateProps) => {
  const elapsed = useElapsedTime(true);

  return (
    <div className={`chat-loading${compact ? " chat-loading-inline" : ""}`} role="status" aria-live="polite">
      <span className="chat-loading-mark" aria-hidden="true">
        <span className="agent-tool-spinner" />
      </span>
      <span className="chat-loading-label">{label}</span>
      <span className="chat-loading-timer" role="timer">
        {formatElapsed(elapsed, true)}
      </span>
      <span className="chat-visually-hidden">Loading conversation</span>
    </div>
  );
};
