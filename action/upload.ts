'use server'

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Types for upload responses
export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  format: string
  width: number
  height: number
  bytes: number
  created_at: string
}

export interface UploadResponse {
  success: boolean
  data?: CloudinaryUploadResult | CloudinaryUploadResult[]
  error?: string
}

// Upload single image
export async function uploadSingleImage(formData: FormData): Promise<UploadResponse> {
  try {
    const file = formData.get('image') as File
    
    if (!file) {
      return {
        success: false,
        error: 'No image file provided'
      }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      }
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 10MB'
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResponse = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'portfolio', // Optional: organize images in folders
          transformation: [
            { quality: 'auto:good' }, // Automatic quality optimization
            { fetch_format: 'auto' }  // Automatic format optimization
          ]
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve(result as CloudinaryUploadResult)
          } else {
            reject(new Error('Upload failed'))
          }
        }
      ).end(buffer)
    })

    return {
      success: true,
      data: uploadResponse
    }

  } catch (error) {
    console.error('Single image upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Upload multiple images
export async function uploadMultipleImages(formData: FormData): Promise<UploadResponse> {
  try {
    const files = formData.getAll('images') as File[]
    
    if (!files || files.length === 0) {
      return {
        success: false,
        error: 'No image files provided'
      }
    }

    // Validate maximum number of files (e.g., 10 files max)
    const maxFiles = 10
    if (files.length > maxFiles) {
      return {
        success: false,
        error: `Maximum ${maxFiles} files allowed`
      }
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: `File ${file.name} is not an image`
        }
      }

      const maxSize = 10 * 1024 * 1024 // 10MB per file
      if (file.size > maxSize) {
        return {
          success: false,
          error: `File ${file.name} exceeds 10MB limit`
        }
      }
    }

    // Upload all files concurrently
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      return new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'portfolio/gallery', // Different folder for multiple uploads
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else if (result) {
              resolve(result as CloudinaryUploadResult)
            } else {
              reject(new Error('Upload failed'))
            }
          }
        ).end(buffer)
      })
    })

    const uploadResults = await Promise.all(uploadPromises)

    return {
      success: true,
      data: uploadResults
    }

  } catch (error) {
    console.error('Multiple images upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string): Promise<UploadResponse> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    
    if (result.result === 'ok') {
      return {
        success: true,
        data: result as any
      }
    } else {
      return {
        success: false,
        error: 'Failed to delete image'
      }
    }
  } catch (error) {
    console.error('Delete image error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

// Get optimized image URL with transformations
export async function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string
    format?: string
  } = {}
): Promise<string> {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto:good',
    format = 'auto'
  } = options

  let transformation = `q_${quality},f_${format}`
  
  if (width && height) {
    transformation += `,w_${width},h_${height},c_${crop}`
  } else if (width) {
    transformation += `,w_${width}`
  } else if (height) {
    transformation += `,h_${height}`
  }

  return cloudinary.url(publicId, {
    transformation: transformation
  })
}