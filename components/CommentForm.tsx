import { useState } from 'react'

type CommentFormProps = {
  threadId: string
  username: string
  onCommentCreated?: (newComment: Comment) => void
  isLocked: boolean
  hasAnswer: boolean 
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
    <div className="mt-4">
        {isLocked ? (
            <p className="text-red-500">Tråden är låst.</p>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
                >
                    Kommentera
                </button>
            </form>
        )}
    </div>
)
}

export default CommentForm