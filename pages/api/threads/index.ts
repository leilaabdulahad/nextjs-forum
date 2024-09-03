import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import Thread from '../../../models/Thread'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'GET') {
    try {
      const threads = await Thread.find({})
      res.status(200).json(threads)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching threads', error })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
