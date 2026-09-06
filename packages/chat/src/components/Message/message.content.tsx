"use client";

import { normalizeAgentParts } from "@sarchauhan/protocol";
import { cn } from "../../lib/utils";
import { PartView } from "./message.part";

type MessageContentProps = {
  parts: Array<{ type: string; [key: string]: unknown }>;
  isUser?: boolean;
};

export const MessageContent = ({ parts, isUser = false }: MessageContentProps) => {
  const agentParts = normalizeAgentParts(parts);

  return (
    <div
      className={cn(
        "chat-message-content break-words",
        isUser ? "md-content-user" : "md-content-assistant",
      )}
    >
      {agentParts.map((part, index) => (
        <PartView key={`${part.type}-${index}`} part={part} index={index} isUser={isUser} />
      ))}
    </div>
  );
};
