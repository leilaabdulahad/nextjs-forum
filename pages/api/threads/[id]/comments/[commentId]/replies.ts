import dbConnect from '@/lib/dbConnect'
import Comment from '@/models/Comment'
import Thread from '@/models/Thread'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect()

  if (method === 'POST') {
    const { content, username } = req.body
    const { id, commentId } = req.query

    if (!content || !username) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $push: { replies: { content, username } },
        },
        { new: true } 
      )

      await Thread.findByIdAndUpdate(
        id,
        {
          $set: { 'comments.$[elem]': updatedComment },
        },
        {
          arrayFilters: [{ 'elem._id': commentId }],
          new: true,
        }
      )

      res.status(200).json({ success: true, data: updatedComment })
    } catch (error) {
      res.status(400).json({ success: false })
    }
  }
}