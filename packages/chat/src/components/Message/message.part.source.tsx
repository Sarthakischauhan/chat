import type {
  AgentFilePart,
  AgentSourceDocumentPart,
  AgentSourceUrlPart,
} from "@sarchauhan/protocol";

export const SourceUrlBlock = ({ part }: { part: AgentSourceUrlPart }) => (
  <a className="agent-source" href={part.url} target="_blank" rel="noreferrer">
    <span className="agent-source-label">Source</span>
    <span className="agent-source-title">{part.title || part.url}</span>
  </a>
);

export const SourceDocumentBlock = ({ part }: { part: AgentSourceDocumentPart }) => (
  <div className="agent-source agent-source-document">
    <span className="agent-source-label">Document</span>
    <span className="agent-source-title">{part.title}</span>
    {part.filename && <span className="agent-source-meta">{part.filename}</span>}
  </div>
);

export const FileBlock = ({ part }: { part: AgentFilePart }) => {
  const isImage = part.mediaType.startsWith("image/");

  if (isImage) {
    return (
      <figure className="agent-file agent-file-image">
        <img src={part.url} alt={part.filename || "Generated file"} />
        {part.filename && <figcaption>{part.filename}</figcaption>}
      </figure>
    );
  }

  return (
    <a className="agent-file" href={part.url} target="_blank" rel="noreferrer">
      <span className="agent-source-label">File</span>
      <span className="agent-source-title">{part.filename || part.mediaType}</span>
    </a>
  );
};
