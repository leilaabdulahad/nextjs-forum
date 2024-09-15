import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import { createComment, updateComment, getComments } from '@/controllers/commentController'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()
  res.setHeader('Cache-Control', 'no-store')

  switch (req.method) {
    case 'POST':
      return createComment(req, res)
    case 'PUT':
      return updateComment(req, res)
    case 'GET':
      return getComments(req, res)
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}