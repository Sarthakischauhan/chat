"use client";
import { useChat } from "./chat.context";
import { Textarea } from "@/components/ui/textarea";

export const ChatInput = () => {
  const { state, dispatch, status, submitInput} = useChat();
  const { input } = state;
  const isSending = status === "submitted" || status === "streaming";

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <Textarea
          className="resize-none flex-1 min-w-0 h-11 rounded-xl px-4 outline-none"
          value={input}
          onChange={(e) =>
            dispatch({ type: "setInput", data: { input: e.target.value } })
          }
          placeholder="Type a message"
          disabled={isSending}
          onKeyDown={(e) => {
            if (e.key !== "Enter" || e.shiftKey) return;
            if (e.nativeEvent.isComposing) return; // IME safety
            e.preventDefault();
            if (!isSending && input.trim()) {
              void submitInput();
            }
          }}
        />
      </div>
    </div>  );
};
