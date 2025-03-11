import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import Wish from '../../../models/Wish'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { name, message } = body

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    const wish = await Wish.findByIdAndUpdate(
      params.id,
      { name, message },
      { new: true }
    )

    if (!wish) {
      return NextResponse.json(
        { error: 'Wish not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(wish)
  } catch (error) {
    console.error('Error updating wish:', error)
    return NextResponse.json(
      { error: 'Error updating wish' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const wish = await Wish.findByIdAndDelete(params.id)

    if (!wish) {
      return NextResponse.json(
        { error: 'Wish not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Wish deleted successfully' })
  } catch (error) {
    console.error('Error deleting wish:', error)
    return NextResponse.json(
      { error: 'Error deleting wish' },
      { status: 500 }
    )
  }
}
