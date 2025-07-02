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

// Category interface
export interface Category {
  _id?: ObjectId
  name: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Create a new Category
export async function createCategory(formData: FormData): Promise<{
  success: boolean
  data?: Category
  error?: string
}> {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string || ''

    // Validation
    if (!name) {
      return {
        success: false,
        error: 'Name and is required'
      }
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Category>('categories')

    // Check if name already exists
    const existingCategory = await collection.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { slug }
      ]
    })
    
    if (existingCategory) {
      return {
        success: false,
        error: 'A Category with this name already exists'
      }
    }

    const CategoryData: Omit<Category, '_id'> = {
      name: name.trim(),
      slug,
      description: description.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(CategoryData)
    
    if (result.acknowledged) {
      const createdCategory = await collection.findOne({ _id: result.insertedId })
      
      // Revalidate relevant pages
      revalidatePath('/owner/categories')
      revalidatePath('/owner/blog/create')
      
      return {
        success: true,
        data: createdCategory as Category
      }
    } else {
      return {
        success: false,
        error: 'Failed to create Category'
      }
    }

  } catch (error) {
    console.error('Error creating Category:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Get all categories
export async function getAllcategories(): Promise<{
  success: boolean
  data?: Category[]
  error?: string
}> {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Category>('categories')

    const categories = await collection
      .find({})
      .sort({ name: 1 })
      .toArray()

    return {
      success: true,
      data: categories as Category[]
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories'
    }
  }
}

// Get Category by ID
export async function getCategoryById(id: string): Promise<{
  success: boolean
  data?: Category
  error?: string
}> {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Category>('categories')

    const Category = await collection.findOne({ _id: new ObjectId(id) })

    if (!Category) {
      return {
        success: false,
        error: 'Category not found'
      }
    }

    return {
      success: true,
      data: Category as Category
    }
  } catch (error) {
    console.error('Error fetching Category:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Category'
    }
  }
}

// Update Category
export async function updateCategory(id: string, formData: FormData): Promise<{
  success: boolean
  data?: Category
  error?: string
}> {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string || ''

    if (!name) {
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
    const collection = db.collection<Category>('categories')

    // Check if name already exists (excluding current Category)
    const existingCategory = await collection.findOne({ 
      _id: { $ne: new ObjectId(id) },
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { slug }
      ]
    })
    
    if (existingCategory) {
      return {
        success: false,
        error: 'A Category with this name already exists'
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name.trim(),
          slug,
          description: description.trim(),
          updatedAt: new Date()
        }
      }
    )

    if (result.modifiedCount > 0) {
      const updatedCategory = await collection.findOne({ _id: new ObjectId(id) })
      
      revalidatePath('/owner/categories')
      revalidatePath('/owner/blog')
      
      return {
        success: true,
        data: updatedCategory as Category
      }
    } else {
      return {
        success: false,
        error: 'Category not found or no changes made'
      }
    }

  } catch (error) {
    console.error('Error updating Category:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update Category'
    }
  }
}

// Delete Category
export async function deleteCategory(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const categoriesCollection = db.collection<Category>('categories')
    const blogsCollection = db.collection('blogs')

    // Check if Category is being used by any blogs
    const blogsUsingCategory = await blogsCollection.findOne({ 
      'categories._id': new ObjectId(id) 
    })

    if (blogsUsingCategory) {
      return {
        success: false,
        error: 'Cannot delete Category that is being used by blog posts'
      }
    }

    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount > 0) {
      revalidatePath('/owner/categories')
      revalidatePath('/owner/blog')
      
      return {
        success: true
      }
    } else {
      return {
        success: false,
        error: 'Category not found'
      }
    }

  } catch (error) {
    console.error('Error deleting Category:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete Category'
    }
  }
}

// Get categories by IDs (for blog posts)
export async function getcategoriesByIds(CategoryIds: string[]): Promise<{
  success: boolean
  data?: Category[]
  error?: string
}> {
  try {
    if (!CategoryIds || CategoryIds.length === 0) {
      return {
        success: true,
        data: []
      }
    }

    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection<Category>('categories')

    const objectIds = CategoryIds.map(id => new ObjectId(id))
    const categories = await collection
      .find({ _id: { $in: objectIds } })
      .sort({ name: 1 })
      .toArray()

    return {
      success: true,
      data: categories as Category[]
    }
  } catch (error) {
    console.error('Error fetching categories by IDs:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories'
    }
  }
}
