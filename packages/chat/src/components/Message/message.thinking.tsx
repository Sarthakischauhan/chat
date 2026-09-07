"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { formatElapsedWords, useElapsedTime } from "../../lib/message/elapsed";
import { cn } from "../../lib/utils";

export type ThinkingBlockProps = {
  isComplete: boolean;
  elapsedMs?: number;
  children?: ReactNode;
};

export const ThinkingBlock = ({ isComplete, elapsedMs, children }: ThinkingBlockProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const measuredElapsed = useElapsedTime(!isComplete);
  const elapsed = elapsedMs ?? measuredElapsed;

  useEffect(() => {
    if (!isComplete) {
      setIsOpen(true);
    }
  }, [isComplete]);

  return (
    <details
      className={cn(
        "md-thinking",
        isComplete ? "md-thinking-complete" : "md-thinking-pending",
      )}
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary>
        <Sparkles className="md-thinking-sparkle" aria-hidden="true" />
        <span className="md-thinking-label">
          {isComplete ? `Thought for ${formatElapsedWords(elapsed)}` : "Thinking"}
        </span>
        {isComplete && <ChevronDown className="md-thinking-chevron" aria-hidden="true" />}
      </summary>
      {children}
    </details>
  );
};
