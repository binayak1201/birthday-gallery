import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Wish from '../../models/Wish'
import { connectToDatabase } from '../../lib/mongodb'

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection failed')
    }
    
    const body = await request.json()
    const { name, message } = body

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    const wish = await Wish.create({ name, message })
    return NextResponse.json(wish, { status: 201 })
  } catch (error) {
    console.error('Error creating wish:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error creating wish'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection failed')
    }
    
    const wishes = await Wish.find().sort({ createdAt: -1 })
    return NextResponse.json(wishes, { status: 200 })
  } catch (error) {
    console.error('Error fetching wishes:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error fetching wishes'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
