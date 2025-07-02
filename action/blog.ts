'use server'

import { MongoClient, ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'
import { Tag, getTagsByIds } from './tag'
import { Category } from './category'

const uri = process.env.DATABASE_URL!

if (!uri) {
  throw new Error('DATABASE_URL environment variable is not defined')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise!
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// Blog interface
export interface Blog {
  _id?: ObjectId
  title: string
  content: string
  tags: Tag[] // Changed from string[] to Tag[]
  slug: string
  category?: Category
  categoryId?: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  excerpt?: string
}

// Create a new blog post
export async function createBlog(formData: FormData): Promise<{
  success: boolean
  data?: Blog
  error?: string
}> {
  try {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const tagIds = formData.get('tags') as string
    const published = formData.get('published') === 'true'
    const categoryId = formData.get('category') as string

    // Validation
    if (!title || !content) {
      return {
        success: false,
        error: 'Title and content are required'
      }
    }

    // Process tag IDs and fetch tag objects
    const tagIdArray = tagIds 
      ? tagIds.split(',').map(id => id.trim()).filter(id => id.length > 0)
      : []

    // Fetch tag objects
    const tagsResult = await getTagsByIds(tagIdArray)
    if (!tagsResult.success) {
      return {
        success: false,
        error: tagsResult.error || 'Failed to fetch tags'
      }
    }
    const tags = tagsResult.data || []

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create excerpt from content (first 150 characters of plain text)
    // Remove common markdown syntax for a clean excerpt
    const excerpt = content
      .replace(/#{1,6}\s+/g, '') // Remove headers (# ## ###)
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold (**text**)
      .replace(/\*(.*?)\*/g, '$1') // Remove italic (*text*)
      .replace(/`(.*?)`/g, '$1') // Remove inline code (`code`)
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images ![alt](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text [text](url) -> text
      .replace(/>\s+/g, '') // Remove blockquotes (>)
      .replace(/[-*+]\s+/g, '') // Remove list markers (- * +)
      .replace(/\d+\.\s+/g, '') // Remove numbered list markers (1. 2.)
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .substring(0, 150)
      .trim() + (content.length > 150 ? '...' : '')
      
    // Handle category if provided
    let category
    if (categoryId) {
      try {
        const client = await clientPromise
        const db = client.db('portfolio')
        const categoriesCollection = db.collection('categories')
        category = await categoriesCollection.findOne({ _id: new ObjectId(categoryId) })
      } catch (err) {
        console.error('Error fetching category:', err)
      }
    }

    const blogPost: Omit<Blog, '_id'> = {
      title,
      content,
      tags,
      slug,
      excerpt,
      published,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Add category if found
    if (category) {
      blogPost.category = category as Category
      blogPost.categoryId = categoryId
    }

    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Blog>('blogs')

    // Check if slug already exists
    const existingBlog = await collection.findOne({ slug })
    if (existingBlog) {
      // Append timestamp to make slug unique
      blogPost.slug = `${slug}-${Date.now()}`
    }

    const result = await collection.insertOne(blogPost)
    
    if (result.acknowledged) {
      const createdBlog = await collection.findOne({ _id: result.insertedId })
      
      // Revalidate the blog list page
      revalidatePath('/blog')
      revalidatePath('/owner/blog')
      
      return {
        success: true,
        data: createdBlog as Blog
      }
    } else {
      return {
        success: false,
        error: 'Failed to create blog post'
      }
    }

  } catch (error) {
    console.error('Error creating blog:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Get all blogs
export async function getAllBlogs(publishedOnly: boolean = false): Promise<{
  success: boolean
  data?: Blog[]
  error?: string
}> {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Blog>('blogs')

    const filter = publishedOnly ? { published: true } : {}
    const blogs = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    return {
      success: true,
      data: blogs as Blog[]
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blogs'
    }
  }
}

// Get blog by slug
export async function getBlogBySlug(slug: string): Promise<{
  success: boolean
  data?: Blog
  error?: string
}> {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Blog>('blogs')

    const blog = await collection.findOne({ slug })

    if (!blog) {
      return {
        success: false,
        error: 'Blog not found'
      }
    }

    return {
      success: true,
      data: blog as Blog
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blog'
    }
  }
}

// Update blog
export async function updateBlog(id: string, formData: FormData): Promise<{
  success: boolean
  data?: Blog
  error?: string
}> {
  try {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const tagIds = formData.get('tags') as string // Now expects comma-separated tag IDs
    const published = formData.get('published') === 'true'
    const categoryId = formData.get('category') as string

    if (!title || !content) {
      return {
        success: false,
        error: 'Title and content are required'
      }
    }

    // Process tag IDs and fetch tag objects
    const tagIdArray = tagIds 
      ? tagIds.split(',').map(id => id.trim()).filter(id => id.length > 0)
      : []

    // Fetch tag objects
    const tagsResult = await getTagsByIds(tagIdArray)
    if (!tagsResult.success) {
      return {
        success: false,
        error: tagsResult.error || 'Failed to fetch tags'
      }
    }
    const tags = tagsResult.data || []

    // Handle category if provided
    let category
    if (categoryId) {
      try {
        const client = await clientPromise
        const db = client.db('portfolio')
        const categoriesCollection = db.collection('categories')
        category = await categoriesCollection.findOne({ _id: new ObjectId(categoryId) })
      } catch (err) {
        console.error('Error fetching category:', err)
      }
    }

    const excerpt = content
      .replace(/#{1,6}\s+/g, '') // Remove headers (# ## ###)
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold (**text**)
      .replace(/\*(.*?)\*/g, '$1') // Remove italic (*text*)
      .replace(/`(.*?)`/g, '$1') // Remove inline code (`code`)
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images ![alt](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text [text](url) -> text
      .replace(/>\s+/g, '') // Remove blockquotes (>)
      .replace(/[-*+]\s+/g, '') // Remove list markers (- * +)
      .replace(/\d+\.\s+/g, '') // Remove numbered list markers (1. 2.)
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .substring(0, 150)
      .trim() + (content.length > 150 ? '...' : '')

    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Blog>('blogs')

    const updateData: any = {
      title,
      content,
      tags,
      excerpt,
      published,
      updatedAt: new Date()
    }
    
    // Add category if found
    if (category) {
      updateData.category = category
      updateData.categoryId = categoryId
    } else if (categoryId === '') {
      // Remove category if empty string is passed (category was unselected)
      updateData.category = null
      updateData.categoryId = null
    }
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateData
      }
    )

    if (result.modifiedCount > 0) {
      const updatedBlog = await collection.findOne({ _id: new ObjectId(id) })
      
      revalidatePath('/blog')
      revalidatePath('/owner/blog')
      
      return {
        success: true,
        data: updatedBlog as Blog
      }
    } else {
      return {
        success: false,
        error: 'Blog not found or no changes made'
      }
    }

  } catch (error) {
    console.error('Error updating blog:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update blog'
    }
  }
}

// Delete blog
export async function deleteBlog(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Blog>('blogs')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount > 0) {
      revalidatePath('/blog')
      revalidatePath('/owner/blog')
      
      return {
        success: true
      }
    } else {
      return {
        success: false,
        error: 'Blog not found'
      }
    }

  } catch (error) {
    console.error('Error deleting blog:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete blog'
    }
  }
}
