import {MessageContent} from "../Message/message.content";

export const MessageItem = ({ message }) => {
  const isUser = message.role === "user";


  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        {/* USER: Background is just a shade darker than white (zinc-100) */}
        <div className="max-w-[70%] rounded-3xl bg-zinc-100 px-5 py-2.5 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
          <MessageContent parts={message.parts} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start gap-4 text-zinc-900 dark:text-zinc-100">
      
      <div className="flex-1 overflow-hidden pt-1">
        <MessageContent parts={message.parts} isUser={false} />
      </div>
      
    </div>
  );
}