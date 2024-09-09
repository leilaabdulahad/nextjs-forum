import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Thread from '@/models/Thread'
import User from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const { id } = req.query

  if (req.method === 'PUT') {
    const { userId, isLocked } = req.body

    try {
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      if (!user.isModerator) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      const thread = await Thread.findById(id)
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' })
      }

      thread.isLocked = isLocked;
      await thread.save()

      res.status(200).json({ message: isLocked ? 'Thread locked successfully' : 'Thread unlocked successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Error updating thread', error })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
