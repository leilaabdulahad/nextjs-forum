import { NextApiRequest, NextApiResponse } from 'next'
import Thread from '@/models/Thread'
import Comment from '@/models/Comment'
import { createCommentHandler } from '@/handlers/createComment'
import { updateCommentHandler } from '@/handlers/updateComment'
import { getCommentsHandler } from '@/handlers/getComments'

export async function createComment(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const { content, username, parentCommentId } = req.body
  return createCommentHandler(id as string, content, username, parentCommentId, res)
}

export async function updateComment(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const { commentId, isAnswer } = req.body
  return updateCommentHandler(id as string, commentId, isAnswer, res)
}

export async function getComments(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  return getCommentsHandler(id as string, res)
}