import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect';
import Thread from '../../../models/Thread';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const thread = new Thread(req.body)
      await thread.save()
      res.status(201).json(thread)
    } catch (error) {
      res.status(500).json({ message: 'Error creating thread', error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
