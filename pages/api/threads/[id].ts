import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import Thread from '../../../models/Thread'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const { id } = req.query

  if (req.method === 'POST') {
    try {
      const thread = new Thread(req.body)
      await thread.save()
      res.status(201).json(thread)
    } catch (error) {
      res.status(500).json({ message: 'Error creating thread', error })
    }
  } else if (req.method === 'GET') {
    try {
      const thread = await Thread.findById(id)
      if (!thread) {
        res.status(404).json({ message: 'Thread not found' })
      } else {
        res.status(200).json(thread)
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching thread', error })
    }
  } else if (req.method === 'PUT') {
    try {
      const thread = await Thread.findByIdAndUpdate(id, req.body, { new: true });
      if (!thread) {
        res.status(404).json({ message: 'Thread not found' });
      } else {
        res.status(200).json(thread);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating thread', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}