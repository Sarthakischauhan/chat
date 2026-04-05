'use client';

import { ChatContextProvider } from './components/Chat/chat.context';
import { Chat } from './components/Chat/chat';
import { Message } from './components/Message/message';

export default function Page() {
  return (
    <ChatContextProvider>
      <main className="min-h-screen flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-6 h-[80vh]">
          <div className="mx-auto w-full max-w-3xl space-y-4">
            <Message />
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="mx-auto w-full max-w-3xl">
            <Chat />
          </div>
        </div>
      </main>
    </ChatContextProvider>
  );
}
