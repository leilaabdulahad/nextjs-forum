import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined')
  throw new Error('Define the MONGODB_URI environment variable inside .env.local');
} else {
  console.log('MONGODB_URI:', MONGODB_URI)
}

let cached = (global as any).mongo

if (!cached) {
  cached = (global as any).mongo = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
        return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
