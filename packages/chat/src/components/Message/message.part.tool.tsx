import type { AgentToolPart } from "@sarchauhan/protocol";
import {
  FileText,
  Image as ImageIcon,
  Pencil,
  Search,
  Sparkles,
  Terminal,
  Trash2,
  Wrench,
} from "lucide-react";
import {
  toolChipDetail,
  toolChipIconKind,
  toolChipLabel,
  toolChipMotionClass,
  type ToolChipIconKind,
} from "../../lib/message/tool-chip";
import { isToolPending } from "../../lib/message/tool-state";

const ICONS: Record<ToolChipIconKind, typeof Wrench> = {
  think: Sparkles,
  write: Pencil,
  command: Terminal,
  read: FileText,
  search: Search,
  image: ImageIcon,
  delete: Trash2,
  default: Wrench,
};

export const ToolChipRow = ({ part }: { part: AgentToolPart }) => {
  const Icon = ICONS[toolChipIconKind(part)];
  const detail = toolChipDetail(part);
  const pending = isToolPending(part.state);

  return (
    <div className={`chat-tool-row ${toolChipMotionClass(part)}`}>
      <span className="chat-tool-icon" aria-hidden="true">
        {pending ? <span className="chat-tool-spinner" /> : <Icon size={14} strokeWidth={1.75} />}
      </span>
      <span className="chat-tool-label">{toolChipLabel(part)}</span>
      {detail ? <span className="chat-tool-pill">{detail}</span> : null}
    </div>
  );
};

/** @deprecated Use ToolChipRow. Kept as a compatible name for existing imports. */
export const ToolBlock = ToolChipRow;
