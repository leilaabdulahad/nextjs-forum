import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import Thread from '../../../../models/Thread'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  await dbConnect()

  if (req.method === 'POST') {
    try {
      const thread = await Thread.findById(id)

      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' })
      }

      const { content, username } = req.body

      const newComment = {
        content,
        username,
        creationDate: new Date(),
        isAnswer: false,
      }

      thread.comments.push(newComment)
      await thread.save()

      return res.status(201).json(thread)
    } catch (error) {
      return res.status(500).json({ message: 'Error creating comment', error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
