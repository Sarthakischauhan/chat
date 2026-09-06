import type { AgentReasoningPart } from "@sarchauhan/protocol";
import { MarkdownContent } from "./message.markdown";
import { ThinkingBlock } from "./message.thinking";

export const ReasoningBlock = ({ part }: { part: AgentReasoningPart }) => (
  <ThinkingBlock isComplete={part.state !== "streaming"}>
    {!!part.text.trim() && (
      <div className="md-thinking-body">
        <MarkdownContent>{part.text}</MarkdownContent>
      </div>
    )}
  </ThinkingBlock>
);
