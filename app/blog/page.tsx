'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Calendar, Tag, Folder, Clock } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAllBlogs, type Blog } from '@/action/blog'
import { getAllTags, type Tag as TagType } from '@/action/tag'
import { getAllcategories, type Category } from '@/action/category'
import StarBackground from '@/components/StarBackground'

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsResult, tagsResult, categoriesResult] = await Promise.all([
          getAllBlogs(true), // Only published blogs
          getAllTags(),
          getAllcategories()
        ])

        if (blogsResult.success && blogsResult.data) {
          setBlogs(blogsResult.data)
          setFilteredBlogs(blogsResult.data)
        }
        
        if (tagsResult.success && tagsResult.data) {
          setTags(tagsResult.data)
        }
        
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data)
        }

        // Handle URL parameters
        const categoryParam = searchParams.get('category')
        const tagParam = searchParams.get('tag')
        const searchParam = searchParams.get('search')

        if (categoryParam) setSelectedCategory(categoryParam)
        if (tagParam) setSelectedTags([tagParam])
        if (searchParam) setSearchTerm(searchParam)

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  useEffect(() => {
    let filtered = blogs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(blog => 
        blog.category && blog.category._id?.toString() === selectedCategory
      )
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(blog =>
        blog.tags.some(tag => selectedTags.includes(tag._id?.toString() || ''))
      )
    }

    setFilteredBlogs(filtered)
  }, [blogs, searchTerm, selectedCategory, selectedTags])

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedTags([])
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className=" bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
          <div className="flex items-center justify-between py-4 px-6 hover:cursor-pointer">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Portfolio</span>
            </button>
            
            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm  p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-primary-foreground">Filters</h2>
                {(searchTerm || selectedCategory || selectedTags.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-foreground hover:text-primary-foreground/50"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-foreground mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full pl-10 pr-4 py-2 border border-primary-foreground rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-foreground mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-primary-foreground rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id?.toString()} value={category._id?.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-primary-foreground mb-2">
                  Tags
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag._id?.toString() || '')
                    return (
                      <button
                        key={tag._id?.toString()}
                        onClick={() => handleTagToggle(tag._id?.toString() || '')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
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
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-primary-foreground">
                {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''} found
                {(searchTerm || selectedCategory || selectedTags.length > 0) && (
                  <span className="ml-2 text-sm">
                    {searchTerm && `• Search: "${searchTerm}"`}
                    {selectedCategory && `• Category: ${categories.find(c => c._id?.toString() === selectedCategory)?.name}`}
                    {selectedTags.length > 0 && `• Tags: ${selectedTags.length} selected`}
                  </span>
                )}
              </p>
            </div>

            {/* Blog Posts */}
            <div className="space-y-6">
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <div className="text-gray-400 mb-4">
                    <Search size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search criteria or clear the filters.
                  </p>
                  {(searchTerm || selectedCategory || selectedTags.length > 0) && (
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                filteredBlogs.map((blog) => (
                  <article
                    key={blog._id?.toString()}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="block group"
                          >
                            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                              {blog.title}
                            </h2>
                          </Link>

                          {/* Meta information */}
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{formatDate(blog.createdAt)}</span>
                            </div>
                            
                            {blog.category && (
                              <div className="flex items-center space-x-1">
                                <Folder size={14} />
                                <span>{blog.category.name}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{Math.ceil(blog.content.length / 200)} min read</span>
                            </div>
                          </div>

                          {/* Excerpt */}
                          {blog.excerpt && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {blog.excerpt}
                            </p>
                          )}

                          {/* Tags */}
                          {blog.tags.length > 0 && (
                            <div className="flex items-center space-x-2 mb-4">
                              <Tag size={14} className="text-gray-400" />
                              <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                  <button
                                    key={tag._id?.toString()}
                                    onClick={() => handleTagToggle(tag._id?.toString() || '')}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white hover:opacity-80 transition-opacity"
                                    style={{ backgroundColor: tag.color }}
                                  >
                                    {tag.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <Link
                            href={`/blog/${blog.slug}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Read more →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
