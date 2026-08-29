'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'

const codeBlocks = `
.hljs { background: #1e1e1e !important; color: #d4d4d4; }
.hljs-keyword { color: #569cd6; }
.hljs-string { color: #ce9178; }
.hljs-number { color: #b5cea8; }
.hljs-function { color: #dcdcaa; }
.hljs-title { color: #dcdcaa; }
.hljs-params { color: #9cdcfe; }
.hljs-comment { color: #6a9955; }
.hljs-type { color: #4ec9b0; }
.hljs-class { color: #4ec9b0; }
.hljs-built_in { color: #4ec9b0; }
.hljs-literal { color: #569cd6; }
.hljs-symbol { color: #569cd6; }
.hljs-variable { color: #9cdcfe; }
.hljs-template-variable { color: #9cdcfe; }
.hljs-tag { color: #569cd6; }
.hljs-attribute { color: #9cdcfe; }
.hljs-selector-tag { color: #569cd6; }
.hljs-selector-id { color: #d7ba7d; }
.hljs-selector-class { color: #d7ba7d; }
.hljs-selector-attr { color: #9cdcfe; }
.hljs-regexp { color: #d16969; }
.hljs-link { color: #569cd6; }
.hljs-bullet { color: #d4d4d4; }
.hljs-meta { color: #9b9b9b; }
`

function extractCodeContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) {
    return children.map(c => extractCodeContent(c)).join('')
  }
  if (typeof children === 'object' && children !== null) {
    const child = children as React.ReactElement<any>
    if (child.props?.children) {
      return extractCodeContent(child.props.children)
    }
  }
  return String(children)
}

function CopyCodeButton({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const codeContent = extractCodeContent(children)
    navigator.clipboard.writeText(codeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded flex items-center gap-1"
      onClick={() => {
        const codeContent = extractCodeContent(children)
        navigator.clipboard.writeText(codeContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-green-400" />
          <span className="text-green-400 text-xs">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span className="text-xs">Copy</span>
        </>
      )}
    </button>
  )
}

export function MarkdownRenderer({ 
  content, 
  className 
}: { 
  content: string
  className?: string
}) {
  // Inject custom styles for syntax highlighting
  if (typeof window !== 'undefined' && !document.getElementById('markdown-styles')) {
    const style = document.createElement('style')
    style.id = 'markdown-styles'
    style.textContent = codeBlocks
    document.head.appendChild(style)
  }

  return (
    <div className={cn('prose prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 {...props} className="text-3xl font-bold text-white mt-8 mb-4 pb-2 border-b border-gray-800">
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 {...props} className="text-2xl font-bold text-white mt-8 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props} className="text-xl font-bold text-white mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p {...props} className="text-gray-300 leading-relaxed mb-4">
              {children}
            </p>
          ),
          code: ({ children, ...props }) => {
            const inline = !props.className
            if (inline) {
              return (
                <code
                  {...props}
                  className="bg-gray-800 px-1.5 py-0.5 rounded text-purple-300 text-sm font-mono"
                >
                  {children}
                </code>
              )
            }
            return <code {...props} className="font-mono text-sm" />
          },
          pre: ({ children, ...props }) => (
            <div className="relative group my-4">
              <pre
                {...props}
                className="bg-gray-950 border border-gray-700 rounded-lg p-4 overflow-x-auto"
              >
                {children}
              </pre>
              <CopyCodeButton children={children} />
            </div>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4 bg-purple-500/5 rounded-r-lg py-2"
            >
              {children}
            </blockquote>
          ),
          ul: ({ children, ...props }) => (
            <ul {...props} className="list-disc list-inside space-y-2 my-4 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol {...props} className="list-decimal list-inside space-y-2 my-4 ml-4">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li {...props} className="text-gray-300 leading-relaxed">
              {children}
            </li>
          ),
          a: ({ children, href, ...props }) => (
            <a
              {...props}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              {children}
            </a>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table {...props} className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              {...props}
              className="border border-gray-700 px-4 py-2 text-left font-semibold text-white bg-gray-800"
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              {...props}
              className="border border-gray-700 px-4 py-2 text-gray-300"
            >
              {children}
            </td>
          ),
          hr: () => (
            <hr className="border-gray-800 my-8" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}