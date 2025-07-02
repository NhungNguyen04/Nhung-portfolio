'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import Link from 'next/link'
import { Tag, createTag, getAllTags, updateTag, deleteTag } from '@/action/tag'

// Predefined colors for tags as suggestions
const TAG_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#14B8A6', // Teal
  '#A855F7', // Violet
]

export default function TagsManagementPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // New tag form state
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0])
  const [newTagDescription, setNewTagDescription] = useState('')
  
  // Edit mode
  const [editMode, setEditMode] = useState(false)
  const [editTagId, setEditTagId] = useState<string | null>(null)
  
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  // Fetch all tags on component mount
  useEffect(() => {
    fetchTags()
  }, [])

  // Handle clicks outside the color picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setColorPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [colorPickerRef])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const result = await getAllTags()
      
      if (result.success && result.data) {
        setTags(result.data)
      } else {
        setError(result.error || 'Failed to fetch tags')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)
    
    try {
      const formData = new FormData()
      formData.append('name', newTagName)
      formData.append('color', newTagColor)
      formData.append('description', newTagDescription)
      
      let result
      
      if (editMode && editTagId) {
        result = await updateTag(editTagId, formData)
      } else {
        result = await createTag(formData)
      }
      
      if (result.success) {
        setSuccess(editMode ? 'Tag updated successfully!' : 'Tag created successfully!')
        resetForm()
        fetchTags() // Refresh tag list
      } else {
        setError(result.error || `Failed to ${editMode ? 'update' : 'create'} tag`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleEdit = (tag: Tag) => {
    setEditMode(true)
    setEditTagId(tag._id?.toString() || null)
    setNewTagName(tag.name)
    setNewTagColor(tag.color)
    setNewTagDescription(tag.description || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the tag "${name}"? This cannot be undone.`)) {
      return
    }
    
    try {
      setIsSubmitting(true)
      const result = await deleteTag(id)
      
      if (result.success) {
        setSuccess('Tag deleted successfully!')
        fetchTags() // Refresh tag list
      } else {
        setError(result.error || 'Failed to delete tag')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const resetForm = () => {
    setEditMode(false)
    setEditTagId(null)
    setNewTagName('')
    setNewTagColor(TAG_COLORS[0])
    setNewTagDescription('')
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tag Management</h1>
                <p className="text-gray-600 mt-1">Create and manage tags for your blog posts</p>
              </div>
              <div className="space-x-2">
                <Link
                  href="/owner/blog"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Blog Posts
                </Link>
                <Link
                  href="/owner/blog/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  New Blog Post
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notification Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tag Form */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {editMode ? 'Edit Tag' : 'Create New Tag'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tag Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., TypeScript"
                    required
                  />
                </div>
                
                {/* Tag Color */}
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    Color *
                  </label>
                  <div className="relative">
                    <div className="mt-1 flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
                        style={{ backgroundColor: newTagColor }}
                        onClick={() => setColorPickerOpen(!colorPickerOpen)}
                      ></div>
                      
                      <input 
                        type="color"
                        id="color-input"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="h-10 border-0 bg-transparent cursor-pointer"
                        aria-label="Select custom color"
                      />
                      
                      <input
                        type="text"
                        value={newTagColor}
                        onChange={(e) => {
                          // Validate hex color format
                          const colorRegex = /^#([0-9A-F]{3}){1,2}$/i
                          const value = e.target.value
                          if (colorRegex.test(value) || value.startsWith('#') && value.length <= 7) {
                            setNewTagColor(value)
                          }
                        }}
                        className="h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="#RRGGBB"
                        maxLength={7}
                      />
                    </div>
                    
                    {/* Color Suggestions */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Suggested colors:</p>
                      <div className="flex flex-wrap gap-2">
                        {TAG_COLORS.map((color) => (
                          <div
                            key={color}
                            className="w-6 h-6 rounded-full cursor-pointer transform transition-transform hover:scale-110 border border-gray-200"
                            style={{ backgroundColor: color }}
                            onClick={() => setNewTagColor(color)}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tag Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newTagDescription}
                    onChange={(e) => setNewTagDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    placeholder="Optional description of what this tag represents"
                  ></textarea>
                </div>
                
                {/* Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !newTagName || !newTagColor}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    {isSubmitting ? 'Processing...' : editMode ? 'Update Tag' : 'Create Tag'}
                  </button>
                  
                  {editMode && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-1"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          {/* Tags List */}
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Available Tags</h2>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : tags.length === 0 ? (
                <div className="p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tags available</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first tag.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tag
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tags.map((tag) => (
                        <tr key={tag._id?.toString()} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: tag.color }}
                              ></div>
                              <span className="font-medium text-gray-900">{tag.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                            {tag.description || <span className="text-gray-500 italic">No description</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(tag.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <button
                              onClick={() => handleEdit(tag)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(tag._id?.toString() || '', tag.name)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
