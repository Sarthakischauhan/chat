import type { AgentToolPart } from "@sarchauhan/protocol";
import { ChevronDown } from "lucide-react";
import { formatJson } from "../../lib/message/format-json";
import { isToolPending, toolChromeClass, toolDetail, toolStateLabel } from "../../lib/message/tool-state";

const ToolCompleteIcon = () => (
  <svg viewBox="0 0 12 12" width="10" height="10" fill="none" aria-hidden="true">
    <path
      d="M2.5 6.5 5 9l4.5-6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ToolBlock = ({ part }: { part: AgentToolPart }) => {
  const pending = isToolPending(part.state);
  const detail = toolDetail(part);

  return (
    <details className={`agent-tool ${toolChromeClass(part.state)}`} open={pending}>
      <summary>
        <ChevronDown className="agent-tool-chevron" aria-hidden="true" />
        <span className="agent-tool-dot" aria-hidden="true">
          {pending ? <span className="agent-tool-spinner" /> : <ToolCompleteIcon />}
        </span>
        <span className="agent-tool-name">{part.title ?? part.toolName}</span>
        {detail ? <span className="agent-tool-chip">{detail}</span> : null}
        <span className="agent-tool-state">{toolStateLabel(part.state)}</span>
      </summary>
      <div className="agent-tool-body">
        {part.input !== undefined && (
          <div className="agent-tool-section">
            <div className="agent-tool-section-label">Input</div>
            <pre className="agent-tool-code">{formatJson(part.input)}</pre>
          </div>
        )}
        {part.output !== undefined && (
          <div className="agent-tool-section">
            <div className="agent-tool-section-label">Output</div>
            <pre className="agent-tool-code">{formatJson(part.output)}</pre>
          </div>
        )}
        {part.errorText && (
          <div className="agent-tool-section">
            <div className="agent-tool-section-label">Error</div>
            <pre className="agent-tool-code agent-tool-error">{part.errorText}</pre>
          </div>
        )}
      </div>
    </details>
  );
};
