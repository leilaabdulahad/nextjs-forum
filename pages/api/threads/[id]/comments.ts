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

  res.setHeader('Cache-Control', 'no-store')

  const { id } = req.query

  if (req.method === 'POST') {
    try {
      const { content, username, parentCommentId } = req.body; // Get parentCommentId from the request body
      const comment = new Comment({ content, username, threadId: id, parentCommentId }); // Save parentCommentId
  
      await comment.save();
  
      const thread = await Thread.findById(id);
      if (!thread) {
        res.status(404).json({ message: 'Thread not found' });
      } else {
        thread.comments.push(comment); 
        await thread.save();
        res.status(201).json(comment);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating comment', error });
    }
  }
   else if (req.method === 'PUT') {
    const { commentId, isAnswer } = req.body

    if (typeof isAnswer === 'boolean') {
      try {
        await Comment.updateMany({ threadId: id, isAnswer: true }, { isAnswer: false }) // Unmark any previous answer
        const updatedComment = await Comment.findByIdAndUpdate(commentId, { isAnswer }, { new: true })

        res.status(200).json(updatedComment)
      } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error })
      }
    } else {
      res.status(400).json({ message: 'Invalid request' })
    }
  }  else if (req.method === 'GET') {
    try {
      const thread = await Thread.findById(id).populate({
        path: 'comments',
        populate: { path: 'parentCommentId' } // Populate nested comments
      });
      if (!thread) {
        res.status(404).json({ message: 'Thread not found' });
      } else {
        res.status(200).json(thread.comments);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error });
    }
  }
  else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}