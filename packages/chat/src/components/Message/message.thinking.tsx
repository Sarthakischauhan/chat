"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

const useElapsedTime = (active: boolean) => {
  const startedAtRef = useRef(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    startedAtRef.current = Date.now();
    const timer = window.setInterval(() => {
      setElapsed(Date.now() - startedAtRef.current);
    }, 100);
    return () => window.clearInterval(timer);
  }, [active]);

  return elapsed;
};

export const formatElapsed = (milliseconds: number) => {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder > 0 ? `${minutes}m ${remainder}s` : `${minutes}m`;
};

const LoadingDots = ({ active }: { active: boolean }) => (
  <span className={cn("md-thinking-dots", !active && "is-done")} aria-hidden="true">
    <span />
    <span />
    <span />
  </span>
);

type ThinkingBlockProps = {
  isComplete: boolean;
  children?: ReactNode;
};

export const ThinkingBlock = ({ isComplete, children }: ThinkingBlockProps) => {
  const elapsed = useElapsedTime(!isComplete);
  const [isOpen, setIsOpen] = useState(true);

  // Keep a completed thought visible. The former controlled `open={!isComplete}`
  // closed the details element as soon as the final reasoning event arrived.
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
        <LoadingDots active={!isComplete} />
        <span className="md-thinking-label">{isComplete ? "Thought" : "Thinking"}</span>
        {!isComplete ? (
          <span className="md-thinking-timer" role="timer">
            {formatElapsed(elapsed)}
          </span>
        ) : (
          <ChevronDown className="md-thinking-chevron" aria-hidden="true" />
        )}
      </summary>
      {children}
    </details>
  );
};
