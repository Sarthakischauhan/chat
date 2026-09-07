import type { AgentDataPart } from "@sarchauhan/protocol";

export type TaskRowStatus = "running" | "completed" | "failed";

export type TaskRow = {
  id: string;
  title: string;
  meta?: string;
  status: TaskRowStatus;
  step?: number;
};

const TASK_DATA_NAMES = new Set(["task", "tasks", "agent.task", "agent.progress"]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const readString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const readFiniteNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const readStatus = (value: unknown): TaskRowStatus => {
  if (value === "completed" || value === "done" || value === "complete") {
    return "completed";
  }

  if (value === "failed" || value === "error" || value === "denied") {
    return "failed";
  }

  return "running";
};

export const isTaskDataPart = (part: { type: string; name?: string }) =>
  part.type === "data" && typeof part.name === "string" && TASK_DATA_NAMES.has(part.name);

const readTask = (value: unknown, fallbackId: string): TaskRow | null => {
  if (!isRecord(value)) {
    return null;
  }

  const title =
    readString(value.title) ??
    readString(value.label) ??
    readString(value.name);
  if (!title) {
    return null;
  }

  const step = readFiniteNumber(value.step);
  const total = readFiniteNumber(value.total);
  const meta =
    readString(value.meta) ??
    (step !== undefined && total !== undefined ? `Step ${step} of ${total}` : undefined);

  return {
    id: readString(value.id) ?? fallbackId,
    title,
    meta,
    status: readStatus(value.status),
    step,
  };
};

export const readTaskRows = (part: AgentDataPart): TaskRow[] => {
  if (!isRecord(part.data)) {
    return [];
  }

  const items = part.data.items ?? part.data.tasks;
  if (Array.isArray(items)) {
    return items.flatMap((item, index) => {
      const row = readTask(item, `${part.name}-${part.id ?? index}`);
      return row ? [row] : [];
    });
  }

  const single = readTask(part.data, `${part.name}-${part.id ?? "task"}`);
  return single ? [single] : [];
};
