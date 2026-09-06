import type { AgentPart } from "@sarchauhan/protocol";

const HIDDEN_DATA_NAMES = new Set(["usage", "context", "context-warning"]);

export type PartRenderKind =
  | "widget"
  | "tool-widget"
  | "data-widget"
  | "text"
  | "reasoning"
  | "tool"
  | "source-url"
  | "source-document"
  | "file"
  | "data"
  | "unknown"
  | "hidden";

export const isHiddenDataPartName = (name: string) => HIDDEN_DATA_NAMES.has(name);

export const resolvePartKind = (
  part: AgentPart,
  {
    isUser,
    hasWidget,
  }: {
    isUser: boolean;
    hasWidget: (name: string) => boolean;
  },
): PartRenderKind => {
  if (part.type === "widget") {
    return isUser ? "hidden" : "widget";
  }

  if (part.type === "tool" && !isUser && hasWidget(part.toolName)) {
    return "tool-widget";
  }

  if (part.type === "data" && !isUser && hasWidget(part.name)) {
    return "data-widget";
  }

  if (part.type === "data" && isHiddenDataPartName(part.name)) {
    return "hidden";
  }

  if (isUser && (part.type === "reasoning" || part.type === "tool")) {
    return "hidden";
  }

  switch (part.type) {
    case "text":
    case "reasoning":
    case "tool":
    case "source-url":
    case "source-document":
    case "file":
    case "data":
    case "unknown":
      return part.type;
    default:
      return "hidden";
  }
};
