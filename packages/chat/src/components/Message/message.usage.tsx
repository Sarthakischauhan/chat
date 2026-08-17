import type { AgentDataPart } from "@sarchauhan/protocol";

type Usage = {
  input_tokens?: number;
  output_tokens?: number;
  reasoning_tokens?: number;
  total_tokens?: number;
};

type Context = {
  current_tokens?: number;
  context_window?: number;
};

const formatTokens = (value: number) => value.toLocaleString("en-US");
const isTokenCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const MessageUsage = ({ parts }: { parts: AgentDataPart[] }) => {
  const usage = parts.find((part) => part.name === "usage")?.data as Usage | undefined;
  const context = parts.find((part) => part.name === "context")?.data as Context | undefined;
  const hasContext = isTokenCount(context?.current_tokens) && isTokenCount(context?.context_window);
  const tokenMetrics = usage
    ? [
        ["in", usage.input_tokens],
        ["out", usage.output_tokens],
        ["reasoning", usage.reasoning_tokens],
        ["total", usage.total_tokens],
      ].filter((metric): metric is [string, number] => isTokenCount(metric[1]))
    : [];

  if (!hasContext && tokenMetrics.length === 0) return null;

  return (
    <p className="chat-message-usage" aria-label="Context and token usage">
      {hasContext ? (
        <>
          Context {formatTokens(context.current_tokens)} / {formatTokens(context.context_window)} ({Math.round((context.current_tokens / context.context_window) * 100)}%)
        </>
      ) : null}
      {tokenMetrics.length > 0 ? (
        <>
          {hasContext ? " · " : null}
          Tokens {tokenMetrics.map(([label, value]) => `${label} ${formatTokens(value)}`).join(" · ")}
        </>
      ) : null}
    </p>
  );
};
