import { NextApiRequest, NextApiResponse } from 'next'
import Thread from '@/models/Thread'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id },
        body,
        method,
    } = req

    if (method === 'PUT') {
        const { commentId, isAnswer } = body

        try {
            const thread = await Thread.findById(id)

            if (!thread) {
                return res.status(404).json({ error: 'Thread not found' })
            }

            const comment = thread.comments.id(commentId)

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' })
            }

            comment.isAnswer = isAnswer

            if (isAnswer) {
                thread.comments.forEach((otherComment: typeof thread.comments[0]) => {
                    if (otherComment._id.toString() !== commentId) {
                        otherComment.isAnswer = false
                    }
                })
            }

            await thread.save()

            return res.status(200).json(thread.comments)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Failed to mark comment as answer' })
        }
    } else {
        res.setHeader('Allow', ['PUT'])
        return res.status(405).end(`Method ${method} Not Allowed`)
    }
}