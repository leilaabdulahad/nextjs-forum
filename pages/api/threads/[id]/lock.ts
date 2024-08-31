import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Thread from '@/models/Thread'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const thread = await Thread.findById(id)
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' })
      }

      thread.isLocked = true
      await thread.save()

      res.status(200).json({ message: 'Thread locked successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Error locking thread', error })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
