"use client";

import { PenSquare } from "lucide-react";
import type { CSSProperties } from "react";
import { useCallback, useMemo, useRef } from "react";
import { useStickToBottom } from "../../lib/chat/stick-to-bottom";
import { widgetResponseText } from "../../lib/chat/widget-response";
import { ThemeToggle } from "../../theme/theme.toggle";
import { useTheme } from "../../theme/theme.context";
import {
  createWidgetRegistry,
  WidgetProvider,
  type ChatWidgetInput,
  type WidgetResponse,
} from "../Widget/widget.context";
import { Message } from "../Message/message";
import { ChatComposer } from "./chat.composer";
import { useMessages, useThread } from "./context";

export type ChatShellProps = {
  className?: string;
  style?: CSSProperties;
  widgets?: ChatWidgetInput;
  showThemeToggle?: boolean;
  showModelSelector?: boolean;
};

export function ChatShell({
  className,
  style,
  widgets,
  showThemeToggle = true,
  showModelSelector = true,
}: ChatShellProps) {
  const { sendMessage, isSending, messages, status } = useMessages();
  const { createThread } = useThread();
  const { resolvedTheme } = useTheme();
  const registry = useMemo(() => createWidgetRegistry(widgets), [widgets]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useStickToBottom(messagesRef, { contentKey: messages, status });

  const respondToWidget = useCallback(
    async (response: WidgetResponse) => {
      const text = widgetResponseText(response);
      if (!text.trim()) {
        return;
      }

      await sendMessage({ text });
    },
    [sendMessage],
  );

  return (
    <WidgetProvider
      widgets={registry}
      respondToWidget={respondToWidget}
      disabled={isSending}
    >
      <div
        className={["chat-root", className].filter(Boolean).join(" ")}
        style={style}
        data-theme={resolvedTheme}
      >
        <div className="chat-toolbar">
          <button
            type="button"
            className="chat-theme-toggle"
            onClick={() => void createThread()}
            aria-label="Start a new chat"
            title="New chat"
            disabled={isSending}
          >
            <PenSquare size={16} strokeWidth={1.75} />
          </button>
          {showThemeToggle && <ThemeToggle />}
        </div>
        <div className="chat-messages" ref={messagesRef}>
          <Message />
        </div>
        <div className="chat-composer">
          <ChatComposer showModelSelector={showModelSelector} />
        </div>
      </div>
    </WidgetProvider>
  );
}
