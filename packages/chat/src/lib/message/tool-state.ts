import type { AgentToolPart, AgentToolState } from "@sarchauhan/protocol";

const TOOL_DETAIL_KEYS = ["path", "file", "filename", "query", "command", "url"] as const;

const PENDING_TOOL_STATES = new Set<AgentToolState>([
  "input-streaming",
  "input-available",
  "approval-requested",
]);

const FAILED_TOOL_STATES = new Set<AgentToolState>(["output-error", "output-denied"]);

export const isToolPending = (state: AgentToolState) => PENDING_TOOL_STATES.has(state);

export const isToolFailed = (state: AgentToolState) => FAILED_TOOL_STATES.has(state);

export const toolChromeClass = (state: AgentToolState) => {
  if (isToolPending(state)) {
    return "agent-tool-pending";
  }

  if (isToolFailed(state)) {
    return "agent-tool-error";
  }

  return "agent-tool-complete";
};

export const toolStateLabel = (state: AgentToolState) => {
  switch (state) {
    case "input-streaming":
      return "Preparing";
    case "input-available":
      return "Ready";
    case "approval-requested":
      return "Needs approval";
    case "approval-responded":
      return "Approval sent";
    case "output-available":
      return "Done";
    case "output-error":
      return "Error";
    case "output-denied":
      return "Denied";
    default:
      return state;
  }
};

export const toolDetail = (part: AgentToolPart) => {
  const source = part.output ?? part.input;

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return null;
  }

  const record = source as Record<string, unknown>;
  const value = TOOL_DETAIL_KEYS.map((key) => record[key]).find(
    (entry): entry is string => typeof entry === "string" && !!entry.trim(),
  );

  return value ?? null;
};
