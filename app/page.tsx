'use client';

import { ChatContextProvider } from './components/Chat/chat.context';
import { Chat } from './components/Chat/chat';
import { Message } from './components/Message/message';

export default function Page() {
  return (
    <ChatContextProvider>
      <main className="min-h-screen">
        <div className="px-6 py-6 pb-44">
          <div className="mx-auto w-full max-w-3xl space-y-4">
            <Message />
          </div>
        </div>
        <div className="fixed inset-x-0 bottom-0 px-6 py-4 bg-white">
          <div className="mx-auto w-full max-w-3xl">
            <Chat />
          </div>
        </div>
      </main>
    </ChatContextProvider>
  );
}
