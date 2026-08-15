import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const chatSrc = path.resolve(storybookDir, "../../packages/chat/src");

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: {
          "@sarchauhan/chat/styles.css": path.join(chatSrc, "styles.css"),
          "@sarchauhan/chat": path.join(chatSrc, "index.ts"),
        },
      },
    });
  },
};

export default config;
