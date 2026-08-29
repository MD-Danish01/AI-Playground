"use client";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

function CodeBlock({ inline, className, children, ...props }) {
  const language = /language-(\w+)/.exec(className || "")?.[1];

  if (inline) {
    return (
      <code
        className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.92em] text-white/95"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-white/10 bg-[#111318] shadow-lg">
      {language && (
        <div className="border-b border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-white/92">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function MarkdownMessage({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkBreaks, remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="mb-4 last:mb-0 text-[15px] leading-7 text-white/92">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 list-disc space-y-2 pl-6 text-[15px] leading-7 text-white/92 last:mb-0">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 list-decimal space-y-2 pl-6 text-[15px] leading-7 text-white/92 last:mb-0">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="mb-4 rounded-r-xl border-l-2 border-cyan-300/40 bg-white/5 pl-4 pr-4 py-3 italic text-white/80 last:mb-0">
            {children}
          </blockquote>
        ),
        code: CodeBlock,
        pre: ({ children }) => <>{children}</>,
        hr: () => <hr className="my-5 border-white/10" />,
        strong: ({ children }) => (
          <strong className="font-semibold text-white/98">{children}</strong>
        ),
        h1: ({ children }) => (
          <h1 className="mb-3 text-2xl font-semibold tracking-tight text-white/98 last:mb-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-white/98 last:mb-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 text-lg font-semibold tracking-tight text-white/98 last:mb-0">
            {children}
          </h3>
        ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="w-full border-collapse text-left text-[15px] text-white/90">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
        th: ({ children }) => (
          <th className="border-b border-white/10 px-4 py-3 font-semibold text-white/95">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-white/10 px-4 py-3 align-top text-white/88">
            {children}
          </td>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-cyan-300 underline decoration-cyan-300/30 underline-offset-4 transition-colors hover:text-cyan-200 hover:decoration-cyan-200"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}