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
  toolChipState,
  type ToolChipIconKind,
} from "../../lib/message/tool-chip";
import { ToolChip } from "./tool.chip";

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

  return (
    <ToolChip
      label={toolChipLabel(part)}
      detail={toolChipDetail(part)}
      state={toolChipState(part)}
      icon={<Icon size={14} strokeWidth={1.75} />}
    />
  );
};

/** @deprecated Use ToolChipRow. Kept as a compatible name for existing imports. */
export const ToolBlock = ToolChipRow;
