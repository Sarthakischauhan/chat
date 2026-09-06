"use client";

import type { CSSProperties } from "react";
import type { ChatAdapter } from "../types";
import { ThemeProvider, type ChatTheme } from "../theme/theme.context";
import { ChatContextProvider } from "./Chat/chat.context";
import { ChatShell } from "./Chat/chat.shell";
import { ProviderId } from "./Chat/context";
import type { ChatWidgetInput } from "./Widget/widget.context";

type ChatProps = {
  adapter: ChatAdapter;
  className?: string;
  defaultThreadId?: string;
  defaultProvider?: ProviderId;
  registryUrl?: string;
  style?: CSSProperties;
  /** Widget map or defineWidget(...) array. */
  widgets?: ChatWidgetInput;
  /** Controlled theme. Omit to manage theme internally. */
  theme?: ChatTheme;
  defaultTheme?: ChatTheme;
  onThemeChange?: (theme: ChatTheme) => void;
  showThemeToggle?: boolean;
  showModelSelector?: boolean;
};

export function Chat({
  adapter,
  className,
  defaultThreadId,
  defaultProvider,
  registryUrl,
  style,
  widgets,
  theme,
  defaultTheme = "system",
  onThemeChange,
  showThemeToggle = true,
  showModelSelector = true,
}: ChatProps) {
  return (
    <ThemeProvider
      theme={theme}
      defaultTheme={defaultTheme}
      onThemeChange={onThemeChange}
    >
      <ChatContextProvider
        adapter={adapter}
        defaultThreadId={defaultThreadId}
        defaultProvider={defaultProvider}
        registryUrl={registryUrl}
      >
        <ChatShell
          className={className}
          style={style}
          widgets={widgets}
          showThemeToggle={showThemeToggle}
          showModelSelector={showModelSelector}
        />
      </ChatContextProvider>
    </ThemeProvider>
  );
}
