'use client';

import { ChatContextProvider } from './components/Chat/chat.context';
import { ChatShell } from './components/Chat/chat.shell';
import { Chat } from './components/Chat/chat';
import { Message } from './components/Message/message';

export default function Page() {
  return (
    <ChatContextProvider>
      <ChatShell composer={<Chat />}>
        <Message />
      </ChatShell>
    </ChatContextProvider>
  );
}
