"use client";

import { ChatInput } from "./chat.input";
import { ChatReferences } from "./chat.references";
import { ChatSend } from "./chat.send";
import { ChatSelect } from "./chat.select";

export const ChatComposer = ({ showModelSelector = true }: { showModelSelector?: boolean }) => {
  return (
    <div className="chat-composer-shell">
      <ChatReferences />
      <ChatInput />
      <div className="chat-composer-row">
        {showModelSelector ? <ChatSelect /> : null}
        <ChatSend />
      </div>
    </div>
  );
};
