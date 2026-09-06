"use client";

import { normalizeAgentParts, type AgentDataPart } from "@sarchauhan/protocol";
import { findRegenerateTarget } from "../../lib/message/regenerate-target";
import { getMessageTextContent, getUserDisplayText } from "../../lib/message/user";
import type { ChatMessage } from "../../types";
import { useMessages } from "../Chat/context";
import { MessageContent } from "./message.content";
import { MessageFeedback } from "./message.feedback";
import { MessageUsage } from "./message.usage";

export const AssistantMessageItem = ({ message }: { message: ChatMessage }) => {
  const { editAndResendMessage, isSending, messages } = useMessages();
  const assistantText = getMessageTextContent(message).trim();
  const dataParts = normalizeAgentParts(message.parts).filter(
    (part): part is AgentDataPart => part.type === "data",
  );
  const regenerateTarget = findRegenerateTarget(messages);

  return (
    <div className="chat-message chat-message-assistant">
      <div className="chat-message-assistant-inner">
        <MessageContent parts={message.parts} isUser={false} />
        <MessageUsage parts={dataParts} />
        <MessageFeedback
          responseText={assistantText}
          canRegenerate={!!regenerateTarget}
          disabled={isSending}
          onRegenerate={() => {
            if (regenerateTarget) {
              void editAndResendMessage(
                regenerateTarget.id,
                getUserDisplayText(regenerateTarget),
              );
            }
          }}
        />
      </div>
    </div>
  );
};
