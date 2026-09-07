import type { AgentDataPart, AgentToolPart } from "@sarchauhan/protocol";

export type DiffChip = {
  file: string;
  additions?: number;
  deletions?: number;
};

const DIFF_DATA_NAMES = new Set(["diff", "diffs", "edits", "file-diffs", "file_diffs"]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const readFiniteNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const readFileName = (record: Record<string, unknown>) => {
  const value = record.file ?? record.path ?? record.filename ?? record.name;
  return typeof value === "string" && value.trim() ? value.trim() : null;
};

const readChip = (value: unknown): DiffChip | null => {
  if (!isRecord(value)) {
    return null;
  }

  const file = readFileName(value);
  const additions =
    readFiniteNumber(value.additions) ??
    readFiniteNumber(value.added) ??
    readFiniteNumber(value.plus);
  const deletions =
    readFiniteNumber(value.deletions) ??
    readFiniteNumber(value.removed) ??
    readFiniteNumber(value.deleted) ??
    readFiniteNumber(value.minus);

  if (!file || (additions === undefined && deletions === undefined)) {
    return null;
  }

  return { file, additions, deletions };
};

const readChipList = (value: unknown): DiffChip[] => {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => {
      const chip = readChip(entry);
      return chip ? [chip] : [];
    });
  }

  if (!isRecord(value)) {
    return [];
  }

  const nested =
    value.diffs ?? value.files ?? value.edits ?? value.changes ?? value.items;
  if (Array.isArray(nested)) {
    return readChipList(nested);
  }

  const single = readChip(value);
  return single ? [single] : [];
};

export const isDiffDataPart = (part: { type: string; name?: string }) =>
  part.type === "data" && typeof part.name === "string" && DIFF_DATA_NAMES.has(part.name);

export const readDiffsFromData = (part: AgentDataPart) => readChipList(part.data);

export const readDiffsFromTool = (part: AgentToolPart) => [
  ...readChipList(part.output),
  ...readChipList(part.input),
];

export const uniqueDiffs = (chips: DiffChip[]) => {
  const seen = new Set<string>();

  return chips.filter((chip) => {
    const key = `${chip.file}:${chip.additions ?? ""}:${chip.deletions ?? ""}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const truncateDiffs = (chips: DiffChip[], limit = 4) => ({
  visible: chips.slice(0, limit),
  hidden: Math.max(0, chips.length - limit),
});
