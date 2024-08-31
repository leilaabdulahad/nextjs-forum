import type { NextApiRequest, NextApiResponse } from 'next'
import type { Document } from 'mongoose'
import dbConnect from '@/lib/dbConnect'
import Thread from '@/models/Thread'
import Comment from '@/models/Comment'

interface IComment extends Document {
  content: string;
  username: string;
  thread: string;
  isAnswer?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const { id } = req.query

if (req.method === 'POST') {
  try {
    const { content, username } = req.body

    const thread = await Thread.findById(id)
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' })
    }

    if (thread.isLocked) {
      return res.status(403).json({ message: 'Thread is locked. No new comments allowed.' })
    }

    const hasAcceptedAnswer = thread.comments.some((comment: IComment) => comment.isAnswer)
    if (hasAcceptedAnswer) {
      return res.status(403).json({ message: 'This thread already has an accepted answer. No new comments allowed.' })
    }

    const comment: IComment = new Comment({ content, username, thread: id }) 
    await comment.save()

    thread.comments.push(comment) 
    await thread.save()

    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error })
  }
  } else if (req.method === 'GET') {
    try {
      const thread = await Thread.findById(id).populate('comments')
      if (!thread) {
        res.status(404).json({ message: 'Thread not found' })
      } else {
        res.status(200).json(thread.comments)
      }
    } catch (error) {
      res.status (500).json({ message: 'Error fetching comments', error })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
