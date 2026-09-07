"use client";

import type { AgentToolPart } from "@sarchauhan/protocol";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { DiffChip } from "../../lib/message/diff-summary";
import { shouldExpandToolGroup } from "../../lib/message/tool-chip";
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
  const live = shouldExpandToolGroup(tools);
  const [open, setOpen] = useState(live);

  useEffect(() => {
    setOpen(live);
  }, [live]);

  if (!tools.length) {
    return null;
  }

  if (tools.length === 1) {
    return (
      <div className={`chat-tool-group${live ? " is-pending" : ""}`}>
        <div className="chat-tool-list">
          <ToolChipRow part={tools[0]} />
        </div>
        <DiffChips diffs={diffs} />
      </div>
    );
  }

  return (
    <div className={`chat-tool-group${live ? " is-pending" : ""}`}>
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
