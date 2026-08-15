import React from "react";
import { Text } from "ink";
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

export function MessageUsage({ part }: { part: AgentDataPart }) {
  if (part.name === "usage") {
    const usage = part.data as Usage;
    return (
      <Text dimColor>
        tokens in {formatTokens(usage.input_tokens)} · out {formatTokens(usage.output_tokens)} · reasoning {formatTokens(usage.reasoning_tokens)} · total {formatTokens(usage.total_tokens)}
      </Text>
    );
  }

  if (part.name === "context" || part.name === "context-warning") {
    const context = part.data as Context;
    return (
      <Text dimColor>
        {part.name === "context-warning" ? <Text color="yellow">⚠ </Text> : null}
        context {formatTokens(context.current_tokens)}/{formatTokens(context.context_window)} ({Math.round((context.current_tokens / context.context_window) * 100)}%)
      </Text>
    );
  }

  return null;
}
