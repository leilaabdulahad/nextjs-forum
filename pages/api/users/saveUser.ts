import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/dbConnect'
import User from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { clerkId, username } = req.body

  try {
    await connectToDatabase()

    const existingUser = await User.findOne({ clerkId })

    if (!existingUser) {
      const newUser = new User({ clerkId, username, isModerator: false })
      await newUser.save();
      return res.status(201).json({ message: 'User created', user: newUser })
    }

    return res.status(200).json({ message: 'User already exists', user: existingUser })
  } catch (error) {
    console.error('Error saving user:', error)
    res.status(500).json({ error: 'Failed to save user' })
  }
}