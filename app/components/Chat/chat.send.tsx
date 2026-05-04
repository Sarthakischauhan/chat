import { useChat } from "./chat.context";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChatSend = () => {
  const { state, submitInput } = useChat();
  const { sendDisabled } = state;

  return (
    <Button
      className="relative h-10 w-10 shrink-0 rounded-full inline-flex items-center justify-center"
      type="button"
      onClick={submitInput}
      disabled={sendDisabled}
      aria-label="Send message"
    >
      <Send size={18} />
    </Button>
  );
};
