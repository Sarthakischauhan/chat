import type { AgentDataPart, AgentPart, AgentToolPart } from "@sarchauhan/protocol";
import { isDiffDataPart, readDiffsFromData, readDiffsFromTool, uniqueDiffs, type DiffChip } from "./diff-summary";
import { resolvePartKind, type PartRenderKind } from "./part-kind";
import { isTaskDataPart, readTaskRows, type TaskRow } from "./task-row";

export type ContentSegment =
  | { type: "tools"; tools: AgentToolPart[]; diffs: DiffChip[] }
  | { type: "diffs"; diffs: DiffChip[] }
  | { type: "tasks"; tasks: TaskRow[] }
  | { type: "part"; part: AgentPart; index: number; kind: PartRenderKind };

export const segmentMessageParts = (
  parts: AgentPart[],
  options: {
    isUser: boolean;
    hasWidget: (name: string) => boolean;
  },
): ContentSegment[] => {
  const kindOf = (part: AgentPart) => resolvePartKind(part, options);
  const segments: ContentSegment[] = [];
  let index = 0;

  while (index < parts.length) {
    const part = parts[index];
    const kind = kindOf(part);

    if (kind === "tool" && part.type === "tool") {
      const tools: AgentToolPart[] = [];

      while (index < parts.length && kindOf(parts[index]) === "tool" && parts[index].type === "tool") {
        tools.push(parts[index]);
        index += 1;
      }

      const diffs = uniqueDiffs(tools.flatMap(readDiffsFromTool));

      while (index < parts.length && parts[index].type === "data" && isDiffDataPart(parts[index])) {
        diffs.push(...readDiffsFromData(parts[index] as AgentDataPart));
        index += 1;
      }

      segments.push({ type: "tools", tools, diffs: uniqueDiffs(diffs) });
      continue;
    }

    if (kind === "data" && part.type === "data" && isTaskDataPart(part)) {
      const tasks = readTaskRows(part);
      if (tasks.length) {
        segments.push({ type: "tasks", tasks });
        index += 1;
        continue;
      }
    }

    if (kind === "data" && part.type === "data" && isDiffDataPart(part)) {
      const diffs = uniqueDiffs(readDiffsFromData(part));
      if (diffs.length) {
        segments.push({ type: "diffs", diffs });
        index += 1;
        continue;
      }
    }

    segments.push({ type: "part", part, index, kind });
    index += 1;
  }

  return segments;
};
