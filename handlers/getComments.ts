import { NextApiResponse } from 'next'
import Thread from '@/models/Thread'

export async function getCommentsHandler(threadId: string, res: NextApiResponse) {
  try {
    const thread = await Thread.findById(threadId).populate({
      path: 'comments',
      populate: { path: 'parentCommentId' }
    })
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' })
    }
    
    res.status(200).json(thread.comments)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error })
  }
}