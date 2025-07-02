'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Tag, Folder, Clock, Share2, Globe, Copy } from 'lucide-react'
import { getBlogBySlug, getAllBlogs, type Blog } from '@/action/blog'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import StarBackground from '../../../components/StarBackground'
import { useLanguage } from '../../../lib/languageContext'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const { language, toggleLanguage } = useLanguage()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchBlog(params.id as string)
    }
  }, [params.id])

  const fetchBlog = async (slug: string) => {
    try {
      setLoading(true)
      const result = await getBlogBySlug(slug)
      
      if (result.success && result.data) {
        setBlog(result.data)
      } else {
        setError(result.error || 'Blog post not found')
      }
    } catch (err) {
      setError('Failed to fetch blog post')
      console.error('Error fetching blog:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: url,
        })
      } catch (err) {
        // Fallback to copy URL
        copyToClipboard(url)
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <StarBackground />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <StarBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/blog')}
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              <span>Back to Blog</span>
            </button>
            
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 text-foreground/80 hover:text-primary transition-colors duration-300"
            >
              <Globe size={20} />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>

          {/* Error Content */}
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {error === 'Blog post not found' ? 'Post Not Found' : 'Error'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {error === 'Blog post not found' 
                ? 'The blog post you\'re looking for doesn\'t exist or has been removed.'
                : error
              }
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/blog')}
                className="cosmic-button"
              >
                Back to Blog
              </button>
              <button
                onClick={() => router.push('/')}
                className="cosmic-button"
              >
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StarBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/blog')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 text-foreground/80 hover:text-primary transition-colors duration-300"
            >
              {copySuccess ? (
                <>
                  <Copy size={20} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={20} />
                  <span>Share</span>
                </>
              )}
            </button>
            
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 text-foreground/80 hover:text-primary transition-colors duration-300"
            >
              <Globe size={20} />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Blog Post Content */}
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-12">
            {/* Category Badge */}
            {blog.category && (
              <div className="mb-6">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground"
                >
                  <Folder size={14} className="mr-2" />
                  {blog.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Published on {formatDate(blog.createdAt)}</span>
              </div>
              
              {blog.updatedAt && new Date(blog.updatedAt).getTime() !== new Date(blog.createdAt).getTime() && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>Updated {formatDate(blog.updatedAt)}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag._id?.toString()}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                      border: `1px solid ${tag.color}40`
                    }}
                  >
                    <Tag size={12} className="mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Divider */}
          <hr className="border-border/30 mb-12" />

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white/5 backdrop-blur-md rounded-lg border border-border/20 p-8">
              <MarkdownRenderer 
                content={blog.content} 
                className="text-foreground leading-relaxed"
              />
            </div>
          </div>

          {/* Post Footer */}
          <footer className="mt-12 pt-8 border-t border-border/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Tags (repeated for easy access) */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-2">Tags:</span>
                {blog.tags.map((tag) => (
                  <button
                    key={tag._id?.toString()}
                    onClick={() => router.push(`/blog?tag=${tag._id}`)}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium hover:opacity-80 transition-opacity"
                    style={{ 
                      backgroundColor: `${tag.color}20`,
                      color: tag.color 
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors duration-200"
              >
                <Share2 size={16} />
                <span>Share this post</span>
              </button>
            </div>
          </footer>
        </article>

        {/* Navigation to other posts */}
        <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-border/30">
          <div className="text-center">
            <button
              onClick={() => router.push('/blog')}
              className="cosmic-button"
            >
              View All Posts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}