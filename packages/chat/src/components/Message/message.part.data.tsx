import type { AgentDataPart, AgentUnknownPart } from "@sarchauhan/protocol";
import { formatJson } from "../../lib/message/format-json";

export const AgentEventBlock = ({ part }: { part: AgentDataPart }) => (
  <details className="agent-tool agent-event">
    <summary>
      <span className="agent-event-marker" aria-hidden="true" />
      <span className="agent-tool-name">data.{part.name}</span>
    </summary>
    <div className="agent-tool-body">
      <pre className="agent-tool-code">{formatJson(part.data)}</pre>
    </div>
  </details>
);

export const UnknownPartBlock = ({ part }: { part: AgentUnknownPart }) => (
  <details className="agent-tool agent-event">
    <summary>
      <span className="agent-event-marker" aria-hidden="true" />
      <span className="agent-tool-name">{part.rawType}</span>
    </summary>
    <div className="agent-tool-body">
      <pre className="agent-tool-code">{formatJson(part.raw)}</pre>
    </div>
  </details>
);
