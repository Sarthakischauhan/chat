import ReactMarkdown from 'react-markdown';

export const MessageContent = ({ parts, isUser = false} : {parts: any, isUser?: boolean}) => {
  // Extract and combine all text parts into a single string for the Markdown parser
  const textContent = parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("\n");

  return (
    // The 'prose' class handles the markdown styling automatically.
    // We adjust the prose colors based on whether it's the user (light text) or assistant (dark text).
    <div className={`prose prose-sm max-w-none break-words ${
      isUser 
        ? "prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-a:text-blue-200" 
        : "dark:prose-invert"
    }`}>
      <ReactMarkdown>
        {textContent}
      </ReactMarkdown>
    </div>
  );
}