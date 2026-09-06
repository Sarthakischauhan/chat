import type { AgentDataPart } from "@sarchauhan/protocol";
import { formatUsageLine, readUsageSummary } from "../../lib/message/usage";

export const MessageUsage = ({ parts }: { parts: AgentDataPart[] }) => {
  const summary = readUsageSummary(parts);
  const line = formatUsageLine(summary);

  if (!line) {
    return null;
  }

  return (
    <p className="chat-message-usage" aria-label="Context and token usage">
      {line}
    </p>
  );
};
