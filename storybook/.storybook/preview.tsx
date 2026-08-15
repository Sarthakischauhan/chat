import type { Preview } from "@storybook/react";
import "@sarchauhan/chat/styles.css";
import "./preview.css";
import { withChatRoot } from "../src/decorators/chat-root";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme for the chat components",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
    surface: {
      description: "Preview width for the chat surface",
      defaultValue: "regular",
      toolbar: {
        icon: "component",
        items: [
          { value: "compact", title: "Compact" },
          { value: "regular", title: "Regular" },
          { value: "wide", title: "Wide" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withChatRoot],
  parameters: {
    layout: "fullscreen",
  },
};

export default preview;
