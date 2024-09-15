import { useState } from 'react'
import { Send } from 'lucide-react'

type CommentFormProps = {
  threadId: string
  username: string
  onCommentCreated?: (newComment: CommentType) => void
  isLocked: boolean
  hasAnswer: boolean
}

const CommentForm = ({
  threadId,
  username,
  onCommentCreated,
  isLocked,
}: CommentFormProps): JSX.Element => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    const newComment = {
      content,
      username,
      isAnswer: false,
    }

    try {
      const response = await fetch(`/api/threads/${threadId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

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
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <label htmlFor="comment" className="text-lg font-medium text-gray-700">
          Lägg till en kommentar
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={4}
          placeholder="Skriv din kommentar här..."
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || content.trim() === ''}
          className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out">
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Skickar...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Kommentera
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default CommentForm