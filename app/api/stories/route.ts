import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../lib/mongodb'
import { Story, Photo } from '../../models/Photo'

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { title, description, date, photoIds } = body

    if (!title || !photoIds?.length) {
      return NextResponse.json(
        { error: 'Title and photos are required' },
        { status: 400 }
      )
    }

    const story = await Story.create({ title, description, date })
    await Photo.updateMany(
      { public_id: { $in: photoIds } },
      { story: story._id }
    )

    return NextResponse.json(story)
  } catch (error) {
    console.error('Error creating story:', error)
    return NextResponse.json(
      { error: 'Error creating story' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    const stories = await Story.find().sort({ date: -1 })
    const storiesWithPhotos = await Promise.all(
      stories.map(async (story) => {
        const photos = await Photo.find({ story: story._id })
        return {
          ...story.toObject(),
          photos,
        }
      })
    )
    return NextResponse.json(storiesWithPhotos)
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { error: 'Error fetching stories' },
      { status: 500 }
    )
  }
}
