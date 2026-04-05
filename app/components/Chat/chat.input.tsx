"use client";
import { useChat } from "./chat.context";

export const ChatInput = () => {
  const { state, dispatch, status } = useChat();
  const { input } = state;
  const isSending = status === "submitted" || status === "streaming";

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 min-w-0 h-11 rounded-xl px-4 outline-none"
          value={input}
          onChange={(e) =>
            dispatch({ type: "setInput", data: { input: e.target.value } })
          }
          placeholder="Type a message"
          disabled={isSending}
        />
      </div>
    </div>
  );
};
