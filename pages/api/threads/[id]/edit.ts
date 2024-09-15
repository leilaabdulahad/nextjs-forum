import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Thread from '@/models/Thread'
import User from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()
  
  const { id } = req.query

  if (req.method === 'PUT') {
    const { userId, updates } = req.body;

    try {
      const user = await User.findById(userId)
      
      if (!user || !user.publicMetadata?.isModerator) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      const thread = await Thread.findById(id);
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' })
      }

      //updates thread with new values
      thread.title = updates.title
      thread.description = updates.description
      await thread.save()

      res.status(200).json(thread)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error updating thread', error })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
