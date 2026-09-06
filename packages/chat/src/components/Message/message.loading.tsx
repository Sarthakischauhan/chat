"use client";

import { formatElapsed, useElapsedTime } from "../../lib/message/elapsed";

export { formatElapsed, formatElapsedWords, useElapsedTime } from "../../lib/message/elapsed";

const PixelGrid = () => (
  <span className="chat-pixel-grid" aria-hidden="true">
    {Array.from({ length: 9 }, (_, index) => (
      <span key={index} />
    ))}
  </span>
);

type LoadingStateProps = {
  label?: string;
  compact?: boolean;
};

export const LoadingState = ({ label = "Churning", compact = false }: LoadingStateProps) => {
  const elapsed = useElapsedTime(true);

  return (
    <div className={`chat-loading${compact ? " chat-loading-inline" : ""}`} role="status" aria-live="polite">
      <PixelGrid />
      <span className="chat-loading-label">{label}</span>
      <span className="chat-loading-timer" role="timer">
        {formatElapsed(elapsed, true)}
      </span>
      <span className="chat-visually-hidden">Loading conversation</span>
    </div>
  );
};
