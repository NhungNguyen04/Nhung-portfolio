'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MarkdownEditor from '@/components/MarkdownEditor'
import { createBlog } from '@/action/blog'
import { getAllTags, type Tag } from '@/action/tag'
import { getAllcategories, type Category } from '@/action/category'

export default function CreateBlogPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([]) // Changed to store tag IDs
  const [selectedCategory, setSelectedCategory] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [availableCategories, setAvailableCategories] = useState<Category[]>([])
  const [loadingTags, setLoadingTags] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  const router = useRouter()

  // Fetch available tags and categories on component mount
  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      try {
        // Fetch tags
        const tagsResult = await getAllTags()
        if (tagsResult.success && tagsResult.data) {
          setAvailableTags(tagsResult.data)
        }
        
        // Fetch categories
        const categoriesResult = await getAllcategories()
        if (categoriesResult.success && categoriesResult.data) {
          setAvailableCategories(categoriesResult.data)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoadingTags(false)
        setLoadingCategories(false)
      }
    }

    fetchTagsAndCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('tags', selectedTags.join(',')) // Convert tag IDs to comma-separated string
      formData.append('author', author)
      formData.append('published', published.toString())
      formData.append('category', selectedCategory) // Add selected category

      const result = await createBlog(formData)

      if (result.success) {
        setSuccess('Blog post created successfully!')
        // Reset form
        setTitle('')
        setContent('')
        setSelectedTags([])
        setSelectedCategory('')
        setAuthor('')
        setPublished(false)
        
        // Redirect to blog list after a short delay
        setTimeout(() => {
          router.push('/owner/blog')
        }, 2000)
      } else {
        setError(result.error || 'Failed to create blog post')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('tags', selectedTags.join(',')) // Convert tag IDs to comma-separated string
      formData.append('author', author)
      formData.append('category', selectedCategory) // Add selected category
      formData.append('published', 'false') // Save as draft

      const result = await createBlog(formData)

      if (result.success) {
        setSuccess('Draft saved successfully!')
      } else {
        setError(result.error || 'Failed to save draft')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Blog Post</h1>
            <p className="text-gray-600 mt-1">Write and publish your blog post</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your blog title..."
                required
              />
            </div>

            {/* Tags */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <a
                  href="/owner/tags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Manage Tags
                </a>
              </div>
              
              {loadingTags ? (
                <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading tags...</span>
                </div>
              ) : availableTags.length === 0 ? (
                <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                  <p className="text-sm text-gray-600 text-center">
                    No tags available. 
                    <a
                      href="/owner/tags"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      Create some tags first.
                    </a>
                  </p>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag._id?.toString() || '')
                      return (
                        <button
                          key={tag._id?.toString()}
                          type="button"
                          onClick={() => {
                            const tagId = tag._id?.toString() || ''
                            if (isSelected) {
                              setSelectedTags(selectedTags.filter(id => id !== tagId))
                            } else {
                              setSelectedTags([...selectedTags, tagId])
                            }
                          }}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'text-white border-2 border-transparent'
                              : 'text-gray-700 bg-gray-100 border-2 border-gray-200 hover:bg-gray-200'
                          }`}
                          style={{
                            backgroundColor: isSelected ? tag.color : undefined,
                            borderColor: isSelected ? tag.color : undefined
                          }}
                        >
                          {tag.name}
                          {isSelected && (
                            <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {selectedTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected tags: {selectedTags.length}
                  </p>
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <a
                  href="/owner/categories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Manage Categories
                </a>
              </div>
              
              {loadingCategories ? (
                <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading categories...</span>
                </div>
              ) : availableCategories.length === 0 ? (
                <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                  <p className="text-sm text-gray-600 text-center">
                    No categories available. 
                    <a
                      href="/owner/categories"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      Create some categories first.
                    </a>
                  </p>
                </div>
              ) : (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select Category --</option>
                  {availableCategories.map((category) => (
                    <option key={category._id?.toString()} value={category._id?.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content * (Markdown)
              </label>
              <div className="border border-gray-300 rounded-md">
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Write your content using Markdown syntax. You can use the toolbar buttons or type Markdown directly.
              </p>
            </div>

            {/* Published Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Creating...' : published ? 'Publish Post' : 'Create Post'}
              </button>
              
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
