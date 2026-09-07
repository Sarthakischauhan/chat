import type { Decorator } from "@storybook/react";
import type { ReactNode } from "react";
import {
  ChatComposer,
  ChatContextProvider,
  ThemeProvider,
  WidgetProvider,
  useTheme,
  type ChatAdapter,
  type ChatTheme,
} from "@sarchauhan/chat";
import { noRegistryUrl } from "../mocks/adapter";

const storyAdapter: ChatAdapter = {
  sendMessage: async function* () {},
};

const ChatStorySurface = ({
  children,
  showComposer,
}: {
  children: ReactNode;
  showComposer: boolean;
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className="chat-root storybook-chat-surface"
      data-theme={resolvedTheme}
    >
      <div className="chat-messages">
        <div className="chat-messages-inner storybook-story-content">{children}</div>
      </div>
      {showComposer ? (
        <div className="chat-composer">
          <ChatComposer />
        </div>
      ) : null}
    </div>
  );
};

export const withChatRoot: Decorator = (Story, context) => {
  const theme = (context.globals.theme ?? "light") as ChatTheme;
  const surface = context.globals.surface ?? "regular";
  const hasChatSurface = context.parameters.chatSurface !== false;

  return (
    <div className="storybook-stage" data-surface={surface} data-theme={theme}>
      <ThemeProvider theme={theme}>
        {hasChatSurface ? (
          <ChatContextProvider adapter={storyAdapter} registryUrl={noRegistryUrl}>
            <WidgetProvider respondToWidget={async () => undefined}>
              <ChatStorySurface showComposer={context.parameters.hideComposer !== true}>
                <Story />
              </ChatStorySurface>
            </WidgetProvider>
          </ChatContextProvider>
        ) : (
          <Story />
        )}
      </ThemeProvider>
    </div>
  );
};
