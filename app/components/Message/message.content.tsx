import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { splitThinkingSegments } from "@/lib/message/segment";

type TextPart = {
  type: "text";
  text: string;
};

type MessageContentProps = {
  parts: Array<TextPart | { type: string; [key: string]: unknown }>;
  isUser?: boolean;
};

export const MessageContent = ({ parts, isUser = false }: MessageContentProps) => {
  const textContent = parts
    .filter((part): part is TextPart => part.type === "text")
    .map((part) => part.text)
    .join("\n");

  const segments = splitThinkingSegments(textContent);

  return (
    <div className={`md-content ${isUser ? "md-content-user" : "md-content-assistant"}`}>
      {segments.map((segment, index) => {
        if (!segment.content.trim() && segment.type !== "thinking") {
          return null;
        }

        if (segment.type === "thinking" && !isUser) {
          const isComplete = segment.isComplete ?? true;

          return (
            <details
              key={`thinking-${index}`}
              className={`md-thinking ${isComplete ? "md-thinking-complete" : "md-thinking-pending"}`}
              open={!isComplete}
            >
              <summary>
                <span className="md-thinking-label">{isComplete ? "Thought" : "Thinking"}</span>
                <span className={`md-thinking-indicator ${isComplete ? "" : "md-thinking-indicator-pending"}`} />
              </summary>
              {!!segment.content.trim() && (
                <div className="md-thinking-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                    components={{
                      a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" />,
                    }}
                  >
                    {segment.content}
                  </ReactMarkdown>
                </div>
              )}
            </details>
          );
        }

        return (
          <ReactMarkdown
            key={`md-${index}`}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
            components={{
              a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" />,
            }}
          >
            {segment.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};
