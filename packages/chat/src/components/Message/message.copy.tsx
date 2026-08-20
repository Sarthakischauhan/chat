"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const MessageCopy = ({ text, disabled = false }: { text: string; disabled?: boolean }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyMessage = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <button
      type="button"
      className="chat-feedback-button"
      title={isCopied ? "Copied" : "Copy response"}
      aria-label={isCopied ? "Copied" : "Copy response"}
      onClick={() => void copyMessage()}
      disabled={disabled}
    >
      {isCopied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
};
