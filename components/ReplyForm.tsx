import { useState } from 'react'
import { Send } from 'lucide-react'

type ReplyFormProps = {
  threadId: string
  username: string
  parentCommentId: string
  onReplyCreated: (newReply: CommentType, parentCommentId: string) => void
  isLocked: boolean
}

const ReplyForm = ({
  threadId,
  username,
  parentCommentId,
  onReplyCreated,
  isLocked,
}: ReplyFormProps): JSX.Element => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const newReply: CommentType = {
      _id: Math.random().toString(36).substring(7),
      threadId,
      parentCommentId,
      content,
      username,
      creationDate: new Date().toISOString(),
      isAnswer: false,
      replies: [],
      isCensored: false,
    }

    try {
      const response = await fetch(`/api/threads/${threadId}/comments/${parentCommentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, username, parentCommentId }),
      })
      if (response.ok) {
        onReplyCreated(newReply, parentCommentId)
        setContent('')
      } else {
        const errorResponse = await response.json()
        setError(errorResponse.message || 'Failed to post reply')
      }
    } catch (error) {
      setError('An error occurred while posting the reply. Try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLocked) {
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm font-medium">Inlägget är låst. Nya svar kan inte läggas till.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="reply" className="text-sm font-medium text-gray-700">
          Lägg till ett svar
        </label>
        <textarea
          id="reply"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
          placeholder="Skriv ditt svar här..."
        />
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || content.trim() === ''}
          className="inline-flex items-center px-3 py-2 bg-black text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Skickar...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-1" />
              Svara
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ReplyForm
