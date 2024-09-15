import { NextApiResponse } from 'next'
import Comment from '@/models/Comment'

export async function updateCommentHandler(
  threadId: string,
  commentId: string,
  isAnswer: boolean,
  res: NextApiResponse
) {
  if (typeof isAnswer !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request' })
  }

  try {
    await Comment.updateMany({ threadId, isAnswer: true }, { isAnswer: false })
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { isAnswer }, { new: true })
    res.status(200).json(updatedComment)
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error })
  }
}