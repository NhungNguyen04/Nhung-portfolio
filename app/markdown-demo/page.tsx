'use client'

import { useState } from 'react'
import MarkdownEditor from '@/components/MarkdownEditor'

export default function MarkdownDemoPage() {
  const [content, setContent] = useState(`# Welcome to the Markdown Editor!

This editor supports **bold text**, *italic text*, and even ***bold italic*** text.

## Features

### Text Formatting
- **Bold**: \`**text**\`
- *Italic*: \`*text*\`
- ~~Strikethrough~~: \`~~text~~\`
- \`Inline code\`: \`\`code\`\`

### Headers
You can create headers from H1 to H4:
# H1 Header
## H2 Header  
### H3 Header
#### H4 Header

### Lists

#### Unordered Lists:
- First item
- Second item
- Third item

#### Ordered Lists:
1. First item
2. Second item
3. Third item

### Links and Images
[Visit GitHub](https://github.com)

![Sample Image](https://via.placeholder.com/400x200?text=Sample+Image)

### Code Blocks

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
  return "Welcome to markdown!";
}
\`\`\`

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
\`\`\`

### Blockquotes

> This is a blockquote. You can use it to highlight important information or quotes from other sources.

### Horizontal Rule

---

### Tips for Using the Editor:

1. **Edit Mode**: Write your markdown content
2. **Preview Mode**: See how your content will look when rendered
3. **Split Mode**: Edit and preview side by side
4. **Image Upload**: Click the 🖼️ Image button to upload images directly
5. **Toolbar**: Use the toolbar buttons for quick formatting

Happy writing! ✨`)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Markdown Editor Demo</h1>
            <p className="text-gray-600 mt-1">
              Test the markdown editor with live preview functionality
            </p>
          </div>

          <div className="p-6">
            <MarkdownEditor
              value={content}
              onChange={setContent}
            />
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Quick Markdown Reference:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Headers:</h4>
                <code className="text-xs block"># H1 ## H2 ### H3</code>
              </div>
              <div>
                <h4 className="font-medium mb-1">Emphasis:</h4>
                <code className="text-xs block">**bold** *italic*</code>
              </div>
              <div>
                <h4 className="font-medium mb-1">Lists:</h4>
                <code className="text-xs block">- item<br/>1. numbered</code>
              </div>
              <div>
                <h4 className="font-medium mb-1">Links:</h4>
                <code className="text-xs block">[text](url)</code>
              </div>
              <div>
                <h4 className="font-medium mb-1">Images:</h4>
                <code className="text-xs block">![alt](url)</code>
              </div>
              <div>
                <h4 className="font-medium mb-1">Code:</h4>
                <code className="text-xs block">\`inline\` ```block```</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
