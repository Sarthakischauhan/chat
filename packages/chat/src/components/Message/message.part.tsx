"use client";

import type { AgentPart } from "@sarchauhan/protocol";
import { resolvePartKind } from "../../lib/message/part-kind";
import { asWidgetFromData, asWidgetFromTool } from "../../lib/message/widget-part";
import { useWidgets } from "../Widget/widget.context";
import { WidgetRenderer } from "../Widget/widget.renderer";
import { AgentEventBlock, UnknownPartBlock } from "./message.part.data";
import { ReasoningBlock } from "./message.part.reasoning";
import { FileBlock, SourceDocumentBlock, SourceUrlBlock } from "./message.part.source";
import { TextWithLegacyThinking } from "./message.part.text";
import { ToolBlock } from "./message.part.tool";

export const PartView = ({
  part,
  index,
  isUser,
}: {
  part: AgentPart;
  index: number;
  isUser: boolean;
}) => {
  const { widgets } = useWidgets();
  const kind = resolvePartKind(part, {
    isUser,
    hasWidget: (name) => Boolean(widgets[name]),
  });

  switch (kind) {
    case "widget":
      return part.type === "widget" ? (
        <WidgetRenderer key={`widget-${part.id || index}`} part={part} />
      ) : null;
    case "tool-widget": {
      if (part.type !== "tool") {
        return null;
      }
      const widgetPart = asWidgetFromTool(part);
      return widgetPart ? (
        <WidgetRenderer key={`tool-widget-${part.toolCallId || index}`} part={widgetPart} />
      ) : (
        <ToolBlock key={`tool-${part.toolCallId || index}`} part={part} />
      );
    }
    case "data-widget":
      return part.type === "data" ? (
        <WidgetRenderer
          key={`data-widget-${part.name}-${part.id || index}`}
          part={asWidgetFromData(part)}
        />
      ) : null;
    case "text":
      return part.type === "text" ? (
        <TextWithLegacyThinking key={`text-${index}`} text={part.text} isUser={isUser} />
      ) : null;
    case "reasoning":
      return part.type === "reasoning" ? (
        <ReasoningBlock key={`reasoning-${index}`} part={part} />
      ) : null;
    case "tool":
      return part.type === "tool" ? (
        <ToolBlock key={`tool-${part.toolCallId || index}`} part={part} />
      ) : null;
    case "source-url":
      return part.type === "source-url" ? (
        <SourceUrlBlock key={`source-url-${part.sourceId || index}`} part={part} />
      ) : null;
    case "source-document":
      return part.type === "source-document" ? (
        <SourceDocumentBlock key={`source-doc-${part.sourceId || index}`} part={part} />
      ) : null;
    case "file":
      return part.type === "file" ? (
        <FileBlock key={`file-${index}`} part={part} />
      ) : null;
    case "data":
      return part.type === "data" ? (
        <AgentEventBlock key={`data-${part.name}-${part.id || index}`} part={part} />
      ) : null;
    case "unknown":
      return part.type === "unknown" ? (
        <UnknownPartBlock key={`unknown-${index}`} part={part} />
      ) : null;
    default:
      return null;
  }
};
