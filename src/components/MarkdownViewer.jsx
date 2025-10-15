'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function MarkdownViewer({ content }) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // 自定义样式
          h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-6 mb-3 text-gray-800" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-4 mb-2 text-gray-800" {...props} />,
          h4: ({node, ...props}) => <h4 className="text-xl font-semibold mt-3 mb-2 text-gray-700" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
          li: ({node, ...props}) => <li className="ml-4" {...props} />,
          a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
          code: ({node, inline, ...props}) => 
            inline ? (
              <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
            ) : (
              <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props} />
            ),
          pre: ({node, ...props}) => <pre className="mb-4" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4" {...props} />
          ),
          table: ({node, ...props}) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          th: ({node, ...props}) => (
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold" {...props} />
          ),
          td: ({node, ...props}) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
