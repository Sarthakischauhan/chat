import type { AgentDataPart } from "@sarchauhan/protocol";

type TokenMetric = {
  label: string;
  value: number;
};

type ContextMetrics = {
  currentTokens: number;
  contextWindow: number;
};

export type UsageSummary = {
  context: ContextMetrics | null;
  tokens: TokenMetric[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const readFiniteNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const formatTokens = (value: number) => new Intl.NumberFormat("en-US").format(value);

const readContextMetrics = (data: unknown): ContextMetrics | null => {
  if (!isRecord(data)) {
    return null;
  }

  const currentTokens = readFiniteNumber(data.current_tokens);
  const contextWindow = readFiniteNumber(data.context_window);

  return currentTokens !== undefined && contextWindow !== undefined
    ? { currentTokens, contextWindow }
    : null;
};

const readTokenMetrics = (data: unknown): TokenMetric[] => {
  if (!isRecord(data)) {
    return [];
  }

  return (
    [
      ["in", data.input_tokens],
      ["out", data.output_tokens],
      ["reasoning", data.reasoning_tokens],
      ["total", data.total_tokens],
    ] as const
  ).flatMap(([label, value]) => {
    const count = readFiniteNumber(value);
    return count === undefined ? [] : [{ label, value: count }];
  });
};

export const readUsageSummary = (parts: AgentDataPart[]): UsageSummary => ({
  context: readContextMetrics(parts.find((part) => part.name === "context")?.data),
  tokens: readTokenMetrics(parts.find((part) => part.name === "usage")?.data),
});

export const formatUsageLine = (summary: UsageSummary) => {
  const context = summary.context
    ? `Context ${formatTokens(summary.context.currentTokens)} / ${formatTokens(summary.context.contextWindow)} (${Math.round((summary.context.currentTokens / summary.context.contextWindow) * 100)}%)`
    : "";
  const tokens = summary.tokens.length
    ? `Tokens ${summary.tokens.map((metric) => `${metric.label} ${formatTokens(metric.value)}`).join(" · ")}`
    : "";

  return [context, tokens].filter(Boolean).join(" · ");
};
