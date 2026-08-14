"use client";

import { Chat } from "@sarchauhan/chat";
import { createSymphonyAdapter } from "@/lib/symphony/adapter";
import { exampleWidgets } from "@/components/chat-widgets";

export default function Page() {
  return (
    <main className="chat-app-shell">
      <Chat
        adapter={createSymphonyAdapter()}
        widgets={exampleWidgets}
        defaultTheme="system"
        className="chat-app-frame"
      />
    </main>
  );
}
