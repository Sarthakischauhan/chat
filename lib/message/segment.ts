
export const THINKING_TAG_PATTERN = /<thinking>([\s\S]*?)<\/thinking>/gi;

export type ContentSegment = {
  type: "markdown" | "thinking";
  content: string;
};

export const splitThinkingSegments = (content: string): ContentSegment[] => {
  const segments: ContentSegment[] = [];
  let currentIndex = 0;

  for (const match of content.matchAll(THINKING_TAG_PATTERN)) {
    const fullMatch = match[0];
    const thinkingContent = match[1] ?? "";
    const startIndex = match.index ?? 0;

    if (startIndex > currentIndex) {
      segments.push({
        type: "markdown",
        content: content.slice(currentIndex, startIndex),
      });
    }

    segments.push({ type: "thinking", content: thinkingContent.trim() });
    currentIndex = startIndex + fullMatch.length;
  }

  if (currentIndex < content.length) {
    segments.push({
      type: "markdown",
      content: content.slice(currentIndex),
    });
  }

  if (!segments.length) {
    return [{ type: "markdown", content }];
  }

  return segments;
};