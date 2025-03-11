import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import { Photo } from '../../../../models/Photo'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { filter, brightness, contrast } = body

    const photo = await Photo.findOneAndUpdate(
      { public_id: params.id },
      {
        effects: {
          filter,
          brightness,
          contrast,
        },
      },
      { new: true }
    )

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(photo)
  } catch (error) {
    console.error('Error applying effects:', error)
    return NextResponse.json(
      { error: 'Error applying effects' },
      { status: 500 }
    )
  }
}
