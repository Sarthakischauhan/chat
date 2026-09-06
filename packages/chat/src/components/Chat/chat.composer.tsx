"use client";

import { ChatTooltip } from "./chat.tooltip";
import { ChatInput } from "./chat.input";
import { ChatReferences } from "./chat.references";
import { ChatSend } from "./chat.send";
import { ChatSelect } from "./chat.select";
import { useComposer } from "./context";

export const ChatComposer = ({ showModelSelector = true }: { showModelSelector?: boolean }) => {
  const { addReference } = useComposer();

  return (
    <div className="chat-composer-shell">
      <ChatReferences />
      <ChatInput />
      <div className="chat-composer-row">
        {showModelSelector ? <ChatSelect /> : null}
        <ChatSend />
      </div>
      <ChatTooltip onAddReference={addReference} />
    </div>
  );
};
