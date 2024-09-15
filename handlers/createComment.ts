import { NextApiResponse } from 'next'
import Thread from '@/models/Thread'
import Comment from '@/models/Comment'

export async function createCommentHandler(
  threadId: string,
  content: string,
  username: string,
  parentCommentId: string | null,
  res: NextApiResponse
) {
  try {
    const comment = new Comment({ content, username, threadId, parentCommentId })
    await comment.save()
    
    const thread = await Thread.findById(threadId)
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' })
    }
    
    thread.comments.push(comment)
    await thread.save()
    
    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error })
  }
}