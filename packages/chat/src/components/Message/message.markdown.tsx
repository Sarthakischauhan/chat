import { Children, isValidElement, type ComponentPropsWithoutRef } from "react";
import { CodeMarkdown, type CodeTheme, type SupportedLanguage } from "@sarchauhan/code-markdown";
import ReactMarkdown from "react-markdown";
import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";

import { cn } from "../../lib/utils";
import { useTheme } from "../../theme/theme.context";

const markdownPlugins: { remark: PluggableList; rehype: PluggableList } = {
  remark: [remarkGfm],
  rehype: [],
};

const getCodeLanguage = (className?: string): SupportedLanguage => {
  const match = className?.match(/language-([\w-]+)/);
  return (match?.[1]?.toLowerCase() ?? "typescript") as SupportedLanguage;
};

const getTextContent = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(getTextContent).join("");
  }

  return "";
};

const chatCodeThemes: Record<"light" | "dark", CodeTheme> = {
  light: {
    name: "chat-light",
    shikiTheme: "github-light",
    colors: {
      background: "#ffffff",
      foreground: "#0d0d0d",
      comment: "#6e6e80",
      keyword: "#9b174c",
      string: "#166534",
      function: "#1d4ed8",
      variable: "#0d0d0d",
      number: "#7c3aed",
      operator: "#9b174c",
      punctuation: "#6e6e80",
      type: "#0369a1",
      tag: "#166534",
      attribute: "#1d4ed8",
      constant: "#b45309",
      surface: "#f7f7f8",
      overlay: "#d8d8df",
      subtext: "#6e6e80",
    },
  },
  dark: {
    name: "chat-dark",
    shikiTheme: "github-dark",
    colors: {
      background: "#212121",
      foreground: "#ececec",
      comment: "#8f8f8f",
      keyword: "#ff7b72",
      string: "#a5d6a7",
      function: "#79c0ff",
      variable: "#ececec",
      number: "#d2a8ff",
      operator: "#ff7b72",
      punctuation: "#b4b4b4",
      type: "#79c0ff",
      tag: "#7ee787",
      attribute: "#79c0ff",
      constant: "#ffa657",
      surface: "#2f2f2f",
      overlay: "#454545",
      subtext: "#b4b4b4",
    },
  },
};

const MarkdownCodeBlock = ({
  code,
  language,
}: {
  code: string;
  language: SupportedLanguage;
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <CodeMarkdown
      className="chat-code-markdown"
      language={language}
      theme={chatCodeThemes[resolvedTheme]}
      showCopyButton
      showLineNumbers
      showLanguage
    >
      {code}
    </CodeMarkdown>
  );
};

const markdownComponents = {
  a: ({ className, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      className={cn(
        "font-medium text-primary underline underline-offset-2 decoration-primary/30 decoration-1 hover:decoration-primary/70",
        className,
      )}
      target="_blank"
      rel="noreferrer noopener"
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className={cn("my-0 text-[15px] leading-8 text-inherit", className)} {...props} />
  ),
  h1: ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1 className={cn("mt-8 mb-3 text-2xl font-semibold tracking-tight", className)} {...props} />
  ),
  h2: ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className={cn("mt-8 mb-3 text-xl font-semibold tracking-tight", className)} {...props} />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className={cn("mt-6 mb-2 text-lg font-semibold tracking-tight", className)} {...props} />
  ),
  h4: ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4 className={cn("mt-6 mb-2 text-base font-semibold tracking-tight", className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className={cn("my-4 list-disc space-y-2 pl-6", className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className={cn("my-4 list-decimal space-y-2 pl-6", className)} {...props} />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className={cn("pl-1 leading-7", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={cn(
        "my-5 pl-4 italic text-muted-foreground/75",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
    <hr className={cn("my-6 h-px border-0 bg-current opacity-10", className)} {...props} />
  ),
  table: ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
    <table
      className={cn(
        "my-5 w-full border-collapse text-left text-sm",
        className,
      )}
      {...props}
    />
  ),
  thead: ({ className, ...props }: ComponentPropsWithoutRef<"thead">) => (
    <thead className={cn("text-xs uppercase tracking-wide text-muted-foreground/70", className)} {...props} />
  ),
  tbody: ({ className, ...props }: ComponentPropsWithoutRef<"tbody">) => (
    <tbody className={cn("[&_tr+tr]:opacity-80", className)} {...props} />
  ),
  tr: ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
    <tr className={cn("", className)} {...props} />
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th className={cn("px-0 py-2 pr-5 font-medium", className)} {...props} />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td className={cn("px-0 py-2 pr-5 align-top opacity-80", className)} {...props } />
  ),
  pre: ({ className, children }: ComponentPropsWithoutRef<"pre">) => (
    (() => {
      const child = Children.toArray(children)[0];
      const code = isValidElement<{ className?: string; children?: unknown }>(child)
        ? getTextContent(child.props.children)
        : getTextContent(children);
      const codeClassName = isValidElement<{ className?: string }>(child)
        ? child.props.className
        : undefined;

      return (
        <div className={cn("my-5", className)}>
          <MarkdownCodeBlock
            language={getCodeLanguage(codeClassName)}
            code={code.replace(/\n$/, "")}
          />
        </div>
      );
    })()
  ),
  // React Markdown v10 no longer consistently provides the legacy `inline`
  // prop. Fenced code is handled by the custom `pre` renderer above, so a
  // standalone `code` element should always be rendered as inline code.
  code: ({ className, children, ...props }: ComponentPropsWithoutRef<"code">) => (
    <code className={cn("md-inline-code", className)} {...props}>
      {children}
    </code>
  ),
};

type MarkdownContentProps = {
  children: string;
  className?: string;
};

export const MarkdownContent = ({ children, className }: MarkdownContentProps) => {
  return (
    // React Markdown doesn't accept class name anymore
    <div className={cn("md-content break-words text-inherit", className)}>
      <ReactMarkdown
        remarkPlugins={markdownPlugins.remark}
        rehypePlugins={markdownPlugins.rehype}
        components={markdownComponents}
        
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
