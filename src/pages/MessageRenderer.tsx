import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface MessageRendererProps {
  content: string;
  isUser: boolean;
}

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({
  content,
  isUser,
}) => {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const CodeBlock: React.FC<CodeBlockProps> = ({
    children,
    className,
    inline,
  }) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    if (inline) {
      return (
        <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }

    return (
      <div className="relative group my-3">
        <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {language || "code"}
          </span>
          <button
            onClick={() => copyToClipboard(children)}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded"
          >
            {copiedCode === children ? (
              <>
                <Check className="h-3 w-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <SyntaxHighlighter
          style={theme === "dark" ? vscDarkPlus : vs}
          language={language}
          PreTag="div"
          className="!mt-0 !rounded-t-none text-sm"
          customStyle={{
            margin: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    );
  };

  if (isUser) {
    return (
      <div className="text-xs sm:text-sm whitespace-pre-wrap break-words">
        {content}
      </div>
    );
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code: CodeBlock,
          pre: ({ children }) => <div>{children}</div>,
          p: ({ children }) => (
            <p className="text-xs sm:text-sm mb-2 last:mb-0 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="text-xs sm:text-sm mb-2 pl-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="text-xs sm:text-sm mb-2 pl-4 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1: ({ children }) => (
            <h1 className="text-sm sm:text-base font-bold mb-2 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-semibold mb-2 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-semibold mb-1 text-foreground">
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-2 bg-primary/10 rounded-r text-xs sm:text-sm mb-2">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full text-xs border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1 bg-muted border border-border font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2 py-1 border border-border">
              {children}
            </td>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/80">
              {children}
            </em>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageRenderer;
