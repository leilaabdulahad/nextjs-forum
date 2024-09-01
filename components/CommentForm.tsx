import React, { useState } from 'react'
import { Comment } from '../types'

type CommentFormProps = {
    threadId: string
    username: string
    onCommentCreated?: (newComment: Comment) => void
    isLocked: boolean
}

const CommentForm = ({ threadId, username, onCommentCreated, isLocked }: CommentFormProps): JSX.Element => {
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
      const errorData = await response.json()
      console.error('Failed to post comment:', errorData.message)
    }
  }

return (
    <div>
        {isLocked ? (
            <p className="text-red-500">Tråden är låst.</p>
        ) : (
            <form onSubmit={handleSubmit}>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                    <button type="submit">Post comment</button>
            </form>
        )}
    </div>
)
}

export default CommentForm
