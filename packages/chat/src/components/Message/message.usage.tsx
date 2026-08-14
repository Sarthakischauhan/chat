import type { AgentDataPart } from "@sarchauhan/protocol";

type Usage = {
  input_tokens: number;
  output_tokens: number;
  reasoning_tokens: number;
  total_tokens: number;
};

type Context = {
  current_tokens: number;
  context_window: number;
};

const formatTokens = (value: number) => value.toLocaleString("en-US");

export const MessageUsage = ({ parts }: { parts: AgentDataPart[] }) => {
  const usage = parts.find((part) => part.name === "usage")?.data as Usage | undefined;
  const context = parts.find((part) => part.name === "context")?.data as Context | undefined;

  if (!usage && !context) return null;

  return (
    <p className="chat-message-usage" aria-label="Context and token usage">
      {context ? (
        <>
          Context {formatTokens(context.current_tokens)} / {formatTokens(context.context_window)} ({Math.round((context.current_tokens / context.context_window) * 100)}%)
        </>
      ) : null}
      {usage ? (
        <>
          {context ? " · " : null}
          Tokens in {formatTokens(usage.input_tokens)} · out {formatTokens(usage.output_tokens)} · reasoning {formatTokens(usage.reasoning_tokens)} · total {formatTokens(usage.total_tokens)}
        </>
      ) : null}
    </p>
  );
};
