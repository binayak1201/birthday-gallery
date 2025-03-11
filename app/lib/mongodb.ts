import mongoose, { ConnectOptions } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

interface CachedConnection {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: CachedConnection | undefined
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

export async function connectToDatabase() {
  try {
    if (cached.conn) {
      if (mongoose.connection.readyState === 1) {
        console.log('Using existing MongoDB connection')
        return cached.conn
      }
      // Reset connection if not connected
      console.log('Connection lost, reconnecting...')
      await mongoose.connection.close()
      cached.conn = null
      cached.promise = null
    }

    if (!cached.promise) {
      const opts: ConnectOptions = {
        bufferCommands: false,
        maxPoolSize: 10,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
        retryReads: true,
        writeConcern: {
          w: 'majority',
          wtimeout: 2500
        },
        autoCreate: true,
        autoIndex: true,
        connectTimeoutMS: 10000,
      }

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('New MongoDB connection established')
        
        // Handle connection events
        mongoose.connection.on('error', (error) => {
          console.error('MongoDB connection error:', error)
          if (cached) {
            cached.conn = null
            cached.promise = null
          }
        })

        mongoose.connection.on('disconnected', () => {
          console.log('MongoDB disconnected')
          if (cached) {
            cached.conn = null
            cached.promise = null
          }
        })

        mongoose.connection.on('connected', () => {
          console.log('MongoDB connected successfully')
        })

        return mongoose
      })
    }

    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    console.error('MongoDB connection error:', error)
    cached.conn = null
    cached.promise = null
    throw error
  }
}
