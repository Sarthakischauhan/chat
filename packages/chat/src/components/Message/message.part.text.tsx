import { splitThinkingSegments } from "../../lib/message/segment";
import { parseUserReferenceMessage } from "../../lib/message/user";
import { MarkdownContent } from "./message.markdown";
import { ThinkingBlock } from "./message.thinking";

export const TextWithLegacyThinking = ({ text, isUser }: { text: string; isUser: boolean }) => {
  const userReferenceMessage = isUser ? parseUserReferenceMessage(text) : null;
  const content = userReferenceMessage?.message ?? text;
  const segments = splitThinkingSegments(content);

  return (
    <>
      {userReferenceMessage && (
        <div className="chat-user-reference">
          {userReferenceMessage.references.map((reference, index) => (
            <div
              key={`${index}-${reference.slice(0, 16)}`}
              className="chat-user-reference-item"
            >
              <div className="chat-reference-label">
                Reference {index + 1}
              </div>
              <div className="chat-reference-text">{reference}</div>
            </div>
          ))}
        </div>
      )}
      {segments.map((segment, index) => {
        if (!segment.content.trim() && segment.type !== "thinking") {
          return null;
        }

        if (segment.type === "thinking" && !isUser) {
          const isComplete = segment.isComplete ?? true;

          return (
            <ThinkingBlock key={`thinking-${index}`} isComplete={isComplete}>
              {!!segment.content.trim() && (
                <div className="md-thinking-body">
                  <MarkdownContent>{segment.content}</MarkdownContent>
                </div>
              )}
            </ThinkingBlock>
          );
        }

        return <MarkdownContent key={`md-${index}`}>{segment.content}</MarkdownContent>;
      })}
    </>
  );
};
