import type { AgentToolPart } from "@sarchauhan/protocol";
import { isToolFailed, isToolPending, toolDetail } from "./tool-state";

export type ToolChipIconKind =
  | "think"
  | "write"
  | "command"
  | "read"
  | "search"
  | "image"
  | "delete"
  | "default";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const readFiniteNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;

const humanizeToolName = (name: string) =>
  name
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .trim();

const basename = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed.includes("/") || /\s/.test(trimmed)) {
    return trimmed;
  }

  return trimmed.split("/").filter(Boolean).at(-1) ?? trimmed;
};

const truncate = (value: string, max = 42) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

const readLineCount = (part: AgentToolPart) => {
  const source = isRecord(part.output) ? part.output : isRecord(part.input) ? part.input : null;
  if (!source) {
    return undefined;
  }

  return (
    readFiniteNumber(source.lines) ??
    readFiniteNumber(source.lineCount) ??
    readFiniteNumber(source.written) ??
    readFiniteNumber(source.additions)
  );
};

export const toolChipIconKind = (part: AgentToolPart): ToolChipIconKind => {
  const name = `${part.toolName} ${part.title ?? ""}`.toLowerCase();

  if (/(think|reason|plan)/.test(name)) return "think";
  if (/(delet|rm |remove|unlink)/.test(name)) return "delete";
  if (/(image|png|jpg|svg|screenshot)/.test(name)) return "image";
  if (/(search|web|browse|fetch|http)/.test(name)) return "search";
  if (/(bash|shell|command|terminal|exec|run_|npm|bun)/.test(name)) return "command";
  if (/(write|edit|create|update|patch|apply)/.test(name)) return "write";
  if (/(read|list|file|open|cat )/.test(name)) return "read";
  return "default";
};

export const toolChipLabel = (part: AgentToolPart) => {
  const title = part.title?.trim();
  const lines = readLineCount(part);
  const kind = toolChipIconKind(part);

  if (kind === "write" && lines) {
    return `Write ${lines} ${lines === 1 ? "line" : "lines"}`;
  }

  if (title && title.length <= 48 && !title.includes("{")) {
    return title;
  }

  return humanizeToolName(part.toolName);
};

export const toolChipDetail = (part: AgentToolPart) => {
  const detail = toolDetail(part);
  if (detail) {
    return truncate(basename(detail));
  }

  if (isToolFailed(part.state) && part.errorText?.trim()) {
    return truncate(part.errorText.trim().split("\n")[0] ?? part.errorText);
  }

  return null;
};

export const toolChipMotionClass = (part: AgentToolPart) => {
  if (isToolPending(part.state)) {
    return "is-pending";
  }

  if (isToolFailed(part.state)) {
    return "is-failed";
  }

  return "is-complete";
};
