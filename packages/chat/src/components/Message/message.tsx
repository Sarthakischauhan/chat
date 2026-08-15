"use client";

import { useMessages, useThread } from "../Chat/context";
import { MessageItem } from "../Message/message.item";

const WaitingForResponse = () => (
  <div className="chat-response-status" role="status" aria-live="polite">
    Waiting for response
  </div>
);

export const Message = () => {
  const { messages, isSending } = useMessages();
  const { isLoadingThread } = useThread();

  if (isLoadingThread) {
    return (
      <div className="chat-messages-inner">
        <div className="chat-loading">Loading conversation…</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="chat-messages-inner">
        <div className="chat-empty">
          <div>
            <p className="chat-empty-title">How can I help?</p>
            <p className="chat-empty-copy">
              Ask a question, attach context, or let the agent gather tools before it answers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages-inner">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isSending && messages.at(-1)?.role === "user" ? <WaitingForResponse /> : null}
    </div>
  );
};
