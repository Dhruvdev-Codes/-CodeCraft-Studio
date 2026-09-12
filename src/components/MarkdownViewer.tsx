import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders Markdown (with GitHub-flavored tables/fenced code) in a styled container. */
export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}