"use client";

import { normalizeAgentParts } from "@sarchauhan/protocol";
import { segmentMessageParts } from "../../lib/message/content-segments";
import { cn } from "../../lib/utils";
import { useWidgets } from "../Widget/widget.context";
import { DiffChips } from "./message.part.diff";
import { PartView } from "./message.part";
import { TaskRows } from "./message.part.task";
import { ToolChipGroup } from "./message.tool.group";

type MessageContentProps = {
  parts: Array<{ type: string; [key: string]: unknown }>;
  isUser?: boolean;
};

export const MessageContent = ({ parts, isUser = false }: MessageContentProps) => {
  const { widgets } = useWidgets();
  const agentParts = normalizeAgentParts(parts);
  const segments = segmentMessageParts(agentParts, {
    isUser,
    hasWidget: (name) => Boolean(widgets[name]),
  });

  return (
    <div
      className={cn(
        "chat-message-content break-words",
        isUser ? "md-content-user" : "md-content-assistant",
      )}
    >
      {segments.map((segment, index) => {
        if (segment.type === "tools") {
          return (
            <ToolChipGroup
              key={`tools-${segment.tools[0]?.toolCallId ?? index}`}
              tools={segment.tools}
              diffs={segment.diffs}
            />
          );
        }

        if (segment.type === "diffs") {
          return <DiffChips key={`diffs-${index}`} diffs={segment.diffs} />;
        }

        if (segment.type === "tasks") {
          return <TaskRows key={`tasks-${index}`} tasks={segment.tasks} />;
        }

        return (
          <PartView
            key={`${segment.part.type}-${segment.index}`}
            part={segment.part}
            index={segment.index}
            isUser={isUser}
          />
        );
      })}
    </div>
  );
};
