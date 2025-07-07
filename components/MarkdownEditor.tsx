'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { uploadSingleImage } from '@/action/upload'
import MarkdownRenderer from './MarkdownRenderer'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'split'>('edit')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await uploadSingleImage(formData)
      
      if (response.success && response.data) {
        const imageUrl = Array.isArray(response.data) 
          ? response.data[0].secure_url 
          : response.data.secure_url
        
        // Insert markdown image syntax at cursor position
        const textarea = textareaRef.current
        if (textarea) {
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const imageMarkdown = `![${file.name}](${imageUrl})`
          const newValue = value.substring(0, start) + imageMarkdown + value.substring(end)
          onChange(newValue)
          
          // Set cursor position after the inserted image
          setTimeout(() => {
            textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length)
            textarea.focus()
          }, 0)
        }
      } else {
        setUploadError(response.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    let insertText: string
    if (syntax.includes('|')) {
      // For syntax that wraps text (like **bold** or *italic*)
      const [before, after] = syntax.split('|')
      insertText = before + (selectedText || placeholder) + after
    } else {
      // For syntax that prefixes text (like # for headers)
      insertText = syntax + (selectedText || placeholder)
    }
    
    const newValue = value.substring(0, start) + insertText + value.substring(end)
    onChange(newValue)
    
    // Set cursor position
    setTimeout(() => {
      if (selectedText) {
        textarea.setSelectionRange(start + insertText.length, start + insertText.length)
      } else {
        textarea.setSelectionRange(start + syntax.indexOf('|') || syntax.length, start + syntax.indexOf('|') || syntax.length)
      }
      textarea.focus()
    }, 0)
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Header with Mode Toggle */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex justify-between items-center">
        {/* Mode Toggle Buttons */}
        <div className="flex bg-white border border-gray-300 rounded overflow-hidden">
          <button
            type="button"
            onClick={() => setPreviewMode('edit')}
            className={`px-3 py-1 text-sm font-medium ${
              previewMode === 'edit'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            ✏️ Edit
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('preview')}
            className={`px-3 py-1 text-sm font-medium border-l border-gray-300 ${
              previewMode === 'preview'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            👁️ Preview
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('split')}
            className={`px-3 py-1 text-sm font-medium border-l border-gray-300 ${
              previewMode === 'split'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📱 Split
          </button>
        </div>

        {/* Toolbar - only show in edit or split mode */}
        {(previewMode === 'edit' || previewMode === 'split') && (
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => insertMarkdown('**|**', 'bold text')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold"
              title="Bold"
            >
              B
            </button>
            
            <button
              type="button"
              onClick={() => insertMarkdown('*|*', 'italic text')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 italic"
              title="Italic"
            >
              I
            </button>
            
            <button
              type="button"
              onClick={() => insertMarkdown('# ', 'Heading')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
              title="Heading 1"
            >
              H1
            </button>
            
            <button
              type="button"
              onClick={() => insertMarkdown('## ', 'Heading')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
              title="Heading 2"
            >
              H2
            </button>
            
            <button
              type="button"
              onClick={() => insertMarkdown('### ', 'Heading')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
              title="Heading 3"
            >
              H3
            </button>
            
            <div className="w-px bg-gray-300 mx-1"></div>
            
            <button
              type="button"
              onClick={() => insertMarkdown('[|](url)', 'link text')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
              title="Link"
            >
              🔗
            </button>
            
            <button
              type="button"
              onClick={() => insertMarkdown('`|`', 'code')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 font-mono"
              title="Inline Code"
            >
              &lt;/&gt;
            </button>
            
            <button
              type="button"
              onClick={() => insertMarkdown('```\n|\n```', 'code block')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
              title="Code Block"
            >
              { }
            </button>
            
            <div className="w-px bg-gray-300 mx-1"></div>
            
            <button
              type="button"
              onClick={() => insertMarkdown('- ', 'List item')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
              title="Unordered List"
            >
              • List
            </button>
            
            <button
              type="button"
              onClick={() => insertMarkdown('1. ', 'List item')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
              title="Ordered List"
            >
              1. List
            </button>
            
            <button
              type="button"
              onClick={() => insertMarkdown('> ', 'Quote')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
              title="Quote"
            >
              " Quote
            </button>
            
            <div className="w-px bg-gray-300 mx-1"></div>
            
            {/* Image Upload */}
            <label className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-1">
              {uploading ? (
                <>
                  <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : (
                <>
                  🖼️ Image
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border-b border-red-200 p-2">
          <p className="text-sm text-red-800">Upload error: {uploadError}</p>
        </div>
      )}

      {/* Content Area */}
      <div className={`flex ${previewMode === 'split' ? 'divide-x divide-gray-300' : ''}`}>
        {/* Editor */}
        {(previewMode === 'edit' || previewMode === 'split') && (
          <div className={previewMode === 'split' ? 'w-1/2' : 'w-full'}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-96 p-4 resize-y focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed border-0"
              placeholder="Write your blog post in Markdown...

Examples:
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`Inline code`

```
Code block
```

- Unordered list item
- Another item

1. Ordered list item
2. Another item

[Link text](https://example.com)
![Image alt text](image-url)

> This is a quote

---

Use the toolbar buttons above or type Markdown syntax directly!"
            />
          </div>
        )}

        {/* Preview */}
        {(previewMode === 'preview' || previewMode === 'split') && (
          <div className={`${previewMode === 'split' ? 'w-1/2' : 'w-full'} bg-card`}>
            <div className="h-96 overflow-y-auto p-4">
              {value.trim() ? (
                <MarkdownRenderer content={value} className="prose-sm" />
              ) : (
                <div className="text-gray-500 text-center py-8">
                  <p className="text-lg mb-2">📝 Preview</p>
                  <p>Start writing in the editor to see the preview here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Help Text - only show in edit mode */}
      {previewMode === 'edit' && (
        <div className="bg-gray-50 border-t border-gray-300 p-2 text-xs text-gray-600">
          <div className="flex flex-wrap gap-4">
            <span><strong>Bold:</strong> **text**</span>
            <span><strong>Italic:</strong> *text*</span>
            <span><strong>Link:</strong> [text](url)</span>
            <span><strong>Image:</strong> ![alt](url)</span>
            <span><strong>Code:</strong> `code`</span>
            <span><strong>Heading:</strong> # H1 ## H2 ### H3</span>
          </div>
        </div>
      )}
    </div>
  )
}
