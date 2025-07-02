'use client'

import React from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * A simple markdown renderer for basic markdown syntax.
 * For more advanced features, consider using react-markdown or marked.
 */
export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  
  const processMarkdown = (text: string): string => {
    // Split content into lines for better processing
    const lines = text.split('\n')
    const processedLines: string[] = []
    
    let inCodeBlock = false
    let inUnorderedList = false
    let inOrderedList = false
    let currentCodeBlock = ''
    let codeBlockLanguage = ''
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      
      // Handle code blocks first (they should not be processed for other markdown)
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          processedLines.push(`<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">${currentCodeBlock.trim()}</code></pre>`)
          inCodeBlock = false
          currentCodeBlock = ''
          codeBlockLanguage = ''
        } else {
          // Start of code block
          inCodeBlock = true
          codeBlockLanguage = line.substring(3).trim()
        }
        continue
      }
      
      if (inCodeBlock) {
        currentCodeBlock += line + '\n'
        continue
      }
      
      // Skip empty lines
      if (line.trim() === '') {
        // Close lists on empty lines
        if (inUnorderedList) {
          processedLines.push('</ul>')
          inUnorderedList = false
        }
        if (inOrderedList) {
          processedLines.push('</ol>')
          inOrderedList = false
        }
        processedLines.push('')
        continue
      }
      
      // Headers
      if (line.startsWith('#### ')) {
        // Close any open lists before headers
        if (inUnorderedList) {
          processedLines.push('</ul>')
          inUnorderedList = false
        }
        if (inOrderedList) {
          processedLines.push('</ol>')
          inOrderedList = false
        }
        line = `<h4 class="text-lg font-semibold mt-6 mb-3 pl-0">${line.substring(5)}</h4>`
      } else if (line.startsWith('### ')) {
        // Close any open lists before headers
        if (inUnorderedList) {
          processedLines.push('</ul>')
          inUnorderedList = false
        }
        if (inOrderedList) {
          processedLines.push('</ol>')
          inOrderedList = false
        }
        line = `<h3 class="text-xl font-semibold mt-6 mb-3 pl-0">${line.substring(4)}</h3>`
      } else if (line.startsWith('## ')) {
        // Close any open lists before headers
        if (inUnorderedList) {
          processedLines.push('</ul>')
          inUnorderedList = false
        }
        if (inOrderedList) {
          processedLines.push('</ol>')
          inOrderedList = false
        }
        line = `<h2 class="text-2xl font-semibold mt-8 mb-4 pl-0">${line.substring(3)}</h2>`
      } else if (line.startsWith('# ')) {
        // Close any open lists before headers
        if (inUnorderedList) {
          processedLines.push('</ul>')
          inUnorderedList = false
        }
        if (inOrderedList) {
          processedLines.push('</ol>')
          inOrderedList = false
        }
        line = `<h1 class="text-3xl font-bold mt-8 mb-6 pl-0">${line.substring(2)}</h1>`
      }
      // Images (process before links to avoid conflicts)
      else if (line.trim().startsWith('![')) {
        line = line.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 shadow-sm" />')
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        line = `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">${line.substring(2)}</blockquote>`
      }
      // Horizontal rules
      else if (line.trim() === '---') {
        line = '<hr class="border-t border-gray-300 my-8" />'
      }
      // Unordered lists
      else if (/^[\s]*[-*+][\s]+/.test(line)) {
        if (!inUnorderedList) {
          processedLines.push('<ul class="mb-4 ml-0 pl-6 list-disc space-y-1">')
          inUnorderedList = true
        }
        const content = line.replace(/^[\s]*[-*+][\s]+/, '')
        line = `<li class="pl-0">${processInlineMarkdown(content)}</li>`
      }
      // Ordered lists
      else if (/^[\s]*\d+\.[\s]+/.test(line)) {
        if (!inOrderedList) {
          processedLines.push('<ol class="mb-4 ml-0 pl-6 list-decimal space-y-1">')
          inOrderedList = true
        }
        const content = line.replace(/^[\s]*\d+\.[\s]+/, '')
        line = `<li class="pl-0">${processInlineMarkdown(content)}</li>`
      }
      // Regular paragraphs
      else {
        // Close any open lists
        if (inUnorderedList) {
          processedLines.push('</ul>')
          inUnorderedList = false
        }
        if (inOrderedList) {
          processedLines.push('</ol>')
          inOrderedList = false
        }
        
        // Only wrap in paragraph if it's not already a processed element
        if (!line.startsWith('<')) {
          line = `<p class="mb-4 pl-0">${processInlineMarkdown(line)}</p>`
        }
      }
      
      processedLines.push(line)
    }
    
    // Close any remaining open lists
    if (inUnorderedList) processedLines.push('</ul>')
    if (inOrderedList) processedLines.push('</ol>')
    
    return processedLines.filter(line => line !== '').join('\n')
  }
  
  const processInlineMarkdown = (text: string): string => {
    return text
      // Bold and Italic (process bold first to avoid conflicts)
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-semibold italic">$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Strikethrough
      .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
      
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
  }

  const processedContent = processMarkdown(content)

  return (
    <div 
      className={`prose prose-gray max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}

// Alternative component for safer rendering without dangerouslySetInnerHTML
export function SafeMarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const lines = content.split('\n')
  
  return (
    <div className={`space-y-4 ${className}`}>
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{line.substring(4)}</h3>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mt-8 mb-4">{line.substring(3)}</h2>
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-6">{line.substring(2)}</h1>
        }
        
        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
              {line.substring(2)}
            </blockquote>
          )
        }
        
        // Lists
        if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
          return (
            <li key={index} className="ml-4 mb-1">
              • {line.substring(2)}
            </li>
          )
        }
        
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={index} className="ml-4 mb-1 list-decimal">
              {line.replace(/^\d+\.\s/, '')}
            </li>
          )
        }
        
        // Horizontal rule
        if (line === '---') {
          return <hr key={index} className="border-t border-gray-300 my-8" />
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return <p key={index} className="mb-4">{line}</p>
        }
        
        return null
      })}
    </div>
  )
}
