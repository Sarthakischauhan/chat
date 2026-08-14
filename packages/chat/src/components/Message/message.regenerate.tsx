"use client";

import { RotateCcw } from "lucide-react";

type MessageRegenerateProps = {
  onRegenerate: () => void;
  disabled?: boolean;
};

export const MessageRegenerate = ({ onRegenerate, disabled = false }: MessageRegenerateProps) => (
  <button
    type="button"
    className="chat-feedback-button"
    title="Regenerate response"
    aria-label="Regenerate response"
    disabled={disabled}
    onClick={onRegenerate}
  >
    <RotateCcw size={17} />
  </button>
);
