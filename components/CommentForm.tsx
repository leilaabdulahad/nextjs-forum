import { useState } from 'react'
import { Comment } from '../types'

type CommentFormProps = {
    threadId: string
    username: string
    onCommentCreated?: (newComment: Comment) => void
}

const CommentForm = ({ threadId, username, onCommentCreated }: CommentFormProps): JSX.Element => {
    const [content, setContent] = useState('')

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const newComment = {
            content,
            username,
            isAnswer: false, 
        }

        const response = await fetch(`/api/threads/${threadId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComment),
        })

        if (response.ok) {
            const createdComment = await response.json()
            if (onCommentCreated) {
                onCommentCreated(createdComment)
            }
            setContent('')
        } else {
            console.error('Failed to post comment')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            <button type="submit">Post comment</button>
        </form>
    )
}

export default CommentForm