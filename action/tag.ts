'use server'

import { MongoClient, ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'

const uri = process.env.DATABASE_URL!

if (!uri) {
  throw new Error('DATABASE_URL environment variable is not defined')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise!
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// Tag interface
export interface Tag {
  _id?: ObjectId
  name: string
  color: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Create a new tag
export async function createTag(formData: FormData): Promise<{
  success: boolean
  data?: Tag
  error?: string
}> {
  try {
    const name = formData.get('name') as string
    const color = formData.get('color') as string
    const description = formData.get('description') as string || ''

    // Validation
    if (!name || !color) {
      return {
        success: false,
        error: 'Name and color are required'
      }
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Tag>('tags')

    // Check if name already exists
    const existingTag = await collection.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { slug }
      ]
    })
    
    if (existingTag) {
      return {
        success: false,
        error: 'A tag with this name already exists'
      }
    }

    const tagData: Omit<Tag, '_id'> = {
      name: name.trim(),
      color,
      slug,
      description: description.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(tagData)
    
    if (result.acknowledged) {
      const createdTag = await collection.findOne({ _id: result.insertedId })
      
      // Revalidate relevant pages
      revalidatePath('/owner/tags')
      revalidatePath('/owner/blog/create')
      
      return {
        success: true,
        data: createdTag as Tag
      }
    } else {
      return {
        success: false,
        error: 'Failed to create tag'
      }
    }

  } catch (error) {
    console.error('Error creating tag:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Get all tags
export async function getAllTags(): Promise<{
  success: boolean
  data?: Tag[]
  error?: string
}> {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Tag>('tags')

    const tags = await collection
      .find({})
      .sort({ name: 1 })
      .toArray()

    return {
      success: true,
      data: tags as Tag[]
    }
  } catch (error) {
    console.error('Error fetching tags:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tags'
    }
  }
}

// Get tag by ID
export async function getTagById(id: string): Promise<{
  success: boolean
  data?: Tag
  error?: string
}> {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Tag>('tags')

    const tag = await collection.findOne({ _id: new ObjectId(id) })

    if (!tag) {
      return {
        success: false,
        error: 'Tag not found'
      }
    }

    return {
      success: true,
      data: tag as Tag
    }
  } catch (error) {
    console.error('Error fetching tag:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tag'
    }
  }
}

// Update tag
export async function updateTag(id: string, formData: FormData): Promise<{
  success: boolean
  data?: Tag
  error?: string
}> {
  try {
    const name = formData.get('name') as string
    const color = formData.get('color') as string
    const description = formData.get('description') as string || ''

    if (!name || !color) {
      return {
        success: false,
        error: 'Name and color are required'
      }
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Tag>('tags')

    // Check if name already exists (excluding current tag)
    const existingTag = await collection.findOne({ 
      _id: { $ne: new ObjectId(id) },
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { slug }
      ]
    })
    
    if (existingTag) {
      return {
        success: false,
        error: 'A tag with this name already exists'
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name.trim(),
          color,
          slug,
          description: description.trim(),
          updatedAt: new Date()
        }
      }
    )

    if (result.modifiedCount > 0) {
      const updatedTag = await collection.findOne({ _id: new ObjectId(id) })
      
      revalidatePath('/owner/tags')
      revalidatePath('/owner/blog')
      
      return {
        success: true,
        data: updatedTag as Tag
      }
    } else {
      return {
        success: false,
        error: 'Tag not found or no changes made'
      }
    }

  } catch (error) {
    console.error('Error updating tag:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update tag'
    }
  }
}

// Delete tag
export async function deleteTag(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const tagsCollection = db.collection<Tag>('tags')
    const blogsCollection = db.collection('blogs')

    // Check if tag is being used by any blogs
    const blogsUsingTag = await blogsCollection.findOne({ 
      'tags._id': new ObjectId(id) 
    })

    if (blogsUsingTag) {
      return {
        success: false,
        error: 'Cannot delete tag that is being used by blog posts'
      }
    }

    const result = await tagsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount > 0) {
      revalidatePath('/owner/tags')
      revalidatePath('/owner/blog')
      
      return {
        success: true
      }
    } else {
      return {
        success: false,
        error: 'Tag not found'
      }
    }

  } catch (error) {
    console.error('Error deleting tag:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete tag'
    }
  }
}

// Get tags by IDs (for blog posts)
export async function getTagsByIds(tagIds: string[]): Promise<{
  success: boolean
  data?: Tag[]
  error?: string
}> {
  try {
    if (!tagIds || tagIds.length === 0) {
      return {
        success: true,
        data: []
      }
    }

    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Tag>('tags')

    const objectIds = tagIds.map(id => new ObjectId(id))
    const tags = await collection
      .find({ _id: { $in: objectIds } })
      .sort({ name: 1 })
      .toArray()

    return {
      success: true,
      data: tags as Tag[]
    }
  } catch (error) {
    console.error('Error fetching tags by IDs:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tags'
    }
  }
}
