import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import Thread from '@/models/Thread'; // Import the Thread model
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // Connect to the database
  await dbConnect();

  if (method === 'POST') {
    const { content, username } = req.body;
    const { id, commentId } = req.query;

    // Add validation to check for required fields
    if (!content || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // Find the comment by its ID and update it by adding a new reply
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $push: { replies: { content, username } },
        },
        { new: true } // This option returns the updated comment
      );

      // Find the thread by its ID and update it by replacing the old comment with the updated comment
      await Thread.findByIdAndUpdate(
        id,
        {
          $set: { 'comments.$[elem]': updatedComment },
        },
        {
          arrayFilters: [{ 'elem._id': commentId }],
          new: true,
        }
      );

      res.status(200).json({ success: true, data: updatedComment });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}