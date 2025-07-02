'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { Category, createCategory, getAllcategories, updateCategory, deleteCategory } from '@/action/category'

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // New category form state
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  
  // Edit mode
  const [editMode, setEditMode] = useState(false)
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null)

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const result = await getAllcategories()
      if (result.success && result.data) {
        setCategories(result.data)
      } else {
        setError(result.error || 'Failed to fetch categories')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNewCategoryName('')
    setNewCategoryDescription('')
    setEditMode(false)
    setEditCategoryId(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(null)

      const formData = new FormData()
      formData.append('name', newCategoryName)
      formData.append('description', newCategoryDescription)

      let result: { success: boolean; data?: Category | Category[]; error?: string }
      
      if (editMode && editCategoryId) {
        // Update existing category
        result = await updateCategory(editCategoryId, formData)
        if (result.success) {
          setSuccess(`Category "${newCategoryName}" updated successfully!`)
          // Update categories list with the updated category
          setCategories(categories.map(category => 
            category._id?.toString() === editCategoryId ? (result.data as Category) : category
          ))
        }
      } else {
        // Create new category
        result = await createCategory(formData)
        if (result.success && result.data) {
          setSuccess(`Category "${newCategoryName}" created successfully!`)
          // Add new category to the list
          if (!Array.isArray(result.data)) {
            setCategories([...categories, result.data])
          }
        }
      }
      
      if (!result?.success) {
        setError(result?.error || 'Operation failed')
      } else {
        resetForm()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditMode(true)
    setEditCategoryId(category._id?.toString() || null)
    setNewCategoryName(category.name)
    setNewCategoryDescription(category.description || '')
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?\nThis action cannot be undone.`)) {
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      const result = await deleteCategory(id)
      
      if (result.success) {
        setSuccess(`Category "${name}" deleted successfully!`)
        // Remove deleted category from list
        setCategories(categories.filter(category => category._id?.toString() !== id))
        resetForm()
      } else {
        setError(result.error || 'Failed to delete category')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Categories Management</h1>
            <p className="text-muted-foreground">Create and manage your blog categories</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/owner" 
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md mr-2 hover:bg-secondary/80"
            >
              Back to Dashboard
            </Link>
            <Link 
              href="/owner" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80"
            >
              Manage Posts
            </Link>
          </div>
        </header>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-md mb-6">
            {success}
          </div>
        )}

        {/* Category Form */}
        <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? 'Edit Category' : 'Create New Category'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                placeholder="e.g., Technology, Design, Programming"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="categoryDescription" className="block text-sm font-medium mb-1">
                Description (Optional)
              </label>
              <textarea
                id="categoryDescription"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                placeholder="A brief description of this category"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : editMode ? 'Update Category' : 'Create Category'}
              </button>
              
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-card border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold p-6 border-b">
            All Categories
          </h2>
          
          {loading ? (
            <div className="p-6 text-center">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No categories found. Create your first category above.
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((category) => (
                <div key={category._id?.toString()} className="p-6 flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="font-medium text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description || 'No description provided'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Slug: {category.slug}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id?.toString() || '', category.name)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}