import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Cache photos for 5 minutes
let photosCache: any = null
let lastCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files')

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      )
    }

    const uploadPromises = files.map(async (file: any) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'image',
              folder: 'birthday',
              format: 'webp', // Convert all images to WebP
              quality: 'auto:good', // Automatic quality optimization
              fetch_format: 'auto',
              eager: [
                { width: 400, height: 400, crop: 'fill' }, // Gallery thumbnail
                { width: 1200, height: 1200, crop: 'fit' } // Full-screen view
              ],
              eager_async: true
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          .end(buffer)
      })
    })

    const results = await Promise.all(uploadPromises)
    // Invalidate cache when new photos are uploaded
    photosCache = null
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error uploading photos:', error)
    return NextResponse.json(
      { error: 'Failed to upload photos' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '30')
    const start = (page - 1) * limit

    // Check cache first
    const now = Date.now()
    if (photosCache && now - lastCacheTime < CACHE_DURATION) {
      const paginatedResults = photosCache.slice(start, start + limit)
      return NextResponse.json({
        resources: paginatedResults,
        total: photosCache.length,
        page,
        totalPages: Math.ceil(photosCache.length / limit)
      })
    }

    // Fetch all photos if cache is invalid
    const { resources } = await cloudinary.search
      .expression('folder:birthday')
      .with_field('context')
      .max_results(500)
      .execute()

    // Update cache
    photosCache = resources
    lastCacheTime = now

    // Return paginated results
    const paginatedResults = resources.slice(start, start + limit)
    return NextResponse.json({
      resources: paginatedResults,
      total: resources.length,
      page,
      totalPages: Math.ceil(resources.length / limit)
    })
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}
