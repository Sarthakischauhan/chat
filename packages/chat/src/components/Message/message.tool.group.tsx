"use client";

import type { AgentToolPart } from "@sarchauhan/protocol";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { DiffChip } from "../../lib/message/diff-summary";
import { isToolPending } from "../../lib/message/tool-state";
import { DiffChips } from "./message.part.diff";
import { ToolChipRow } from "./message.part.tool";

const groupLabel = (count: number) =>
  count === 1 ? "1 tool call" : `${count} tool calls`;

export const ToolChipGroup = ({
  tools,
  diffs = [],
}: {
  tools: AgentToolPart[];
  diffs?: DiffChip[];
}) => {
  const anyPending = tools.some((tool) => isToolPending(tool.state));
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (anyPending) {
      setOpen(true);
    }
  }, [anyPending]);

  if (!tools.length) {
    return null;
  }

  return (
    <div className={`chat-tool-group${anyPending ? " is-pending" : ""}`}>
      <details
        className="chat-tool-group-details"
        open={open}
        onToggle={(event) => setOpen(event.currentTarget.open)}
      >
        <summary className="chat-tool-group-summary">
          <ChevronDown className="chat-tool-group-chevron" aria-hidden="true" />
          <span>{groupLabel(tools.length)}</span>
        </summary>
        <div className="chat-tool-list">
          {tools.map((tool) => (
            <ToolChipRow key={tool.toolCallId || `${tool.toolName}-${tool.state}`} part={tool} />
          ))}
        </div>
      </details>
      <DiffChips diffs={diffs} />
    </div>
  );
};
