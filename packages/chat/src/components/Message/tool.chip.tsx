import type { ReactNode } from "react";
import type { ToolChipState } from "../../lib/message/tool-chip";
import { cn } from "../../lib/utils";

export type { ToolChipState };

export type ToolChipProps = {
  label: string;
  detail?: string | null;
  icon?: ReactNode;
  state?: ToolChipState;
  className?: string;
};

export function ToolChip({
  label,
  detail,
  icon,
  state = "complete",
  className,
}: ToolChipProps) {
  const pending = state === "pending" || state === "running";

  return (
    <div
      className={cn(
        "chat-tool-row",
        pending && "is-pending",
        state === "failed" && "is-failed",
        state === "complete" && "is-complete",
        className,
      )}
    >
      <span className="chat-tool-icon" aria-hidden="true">
        {icon ?? (pending ? <span className="chat-tool-spinner" /> : null)}
      </span>
      <span className="chat-tool-label">{label}</span>
      {detail ? <span className="chat-tool-pill">{detail}</span> : null}
    </div>
  );
}

/** Presentational alias for `ToolChip`. */
export const BaseTool = ToolChip;
