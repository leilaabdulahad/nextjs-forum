import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import EditThread from '@/components/EditThread'
import CommentForm from '@/components/CommentForm'
import CommentList from '@/components/CommentList'
import { checkInappropriateWords } from '@/utils/utils'
import Link from 'next/link'
import { MessageCircle, Calendar, User, Pencil } from 'lucide-react'

type DetailpageProps = {
  thread: Thread
  onThreadUpdate: (updatedThread: Thread) => void
  onCommentCreate: (newComment: CommentType) => void
  userUsername?: string
  onCommentMarkAsAnswer: (commentId: string) => void
}

const Detailpage: NextPage<DetailpageProps> = ({
  thread,
  onThreadUpdate,
  onCommentCreate,
  userUsername,
  onCommentMarkAsAnswer,
}) => {
  const { user } = useUser()
  const [comments, setComments] = useState<CommentType[]>([])
  const [isEditing, setIsEditing] = useState(false)

  const censoredTitle = checkInappropriateWords(thread.title)
  const censoredDescription = checkInappropriateWords(thread.description)

  const titleIsCensored = censoredTitle !== thread.title;
  const descriptionIsCensored = censoredDescription !== thread.description

  thread.isCensored = titleIsCensored || descriptionIsCensored

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/threads/${thread._id}/comments`)
      const fetchedComments: CommentType[] = await response.json()
      setComments(fetchedComments)
    }
    fetchComments()
  }, [thread._id])

  const handleCommentCreated = (newComment: CommentType) => {
    setComments((prevComments) => [...prevComments, newComment])
  }

  const handleReplyCreated = (newReply: CommentType, parentCommentId: string) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment._id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          }
        }
        return comment;
      })
    })
  }
  const countTotalComments = (comments: CommentType[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? comment.replies.length : 0);
    }, 0);
  };
  
  const totalComments = countTotalComments(comments);
  

  const handleCommentMarkAsAnswer = async (commentId: string, isAnswer: boolean) => {
    if (thread.category !== 'QNA') return
    try {
      const response = await fetch(`/api/threads/${thread._id}/comments/markAsAnswer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, isAnswer }),
      })
      if (!response.ok) {
        throw new Error('Failed to mark comment as answer')
      }
      const updatedCommentsResponse = await fetch(`/api/threads/${thread._id}/comments`)
      const updatedComments: CommentType[] = await updatedCommentsResponse.json()
      setComments(updatedComments)
    } catch (error) {
      console.error('Error marking comment as answer:', error)
    }
  }

  const canEdit = thread.username === userUsername || (user?.publicMetadata?.isModerator === true)

  if (!user || !user.username) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-blue-700">
        <Link href='/sign-in' className="text-3xl font-semibold mb-2 hover:underline transition duration-300">
          Logga in
        </Link>
        <p className="text-lg">
          för att se sidan
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{censoredTitle}</h1>
            <p className="text-lg text-gray-600 mb-6">{censoredDescription}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{thread.username}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(thread.creationDate).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>{totalComments} comments</span>
                </div>

              </div>
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-blue-500 hover:text-blue-600 transition duration-300"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Redigera tråd
                </button>
              )}
            </div>
          </div>
        </div>

        <EditThread
          thread={thread}
          userUsername={userUsername}
          onUpdateThread={onThreadUpdate}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />

            {!thread.isLocked && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Add a Comment</h2>
                  <CommentForm
                    threadId={thread._id}
                    username={user.username}
                    onCommentCreated={handleCommentCreated}
                    isLocked={thread.isLocked}
                    hasAnswer={comments.some((comment) => comment.isAnswer)}
                  />
                </div>
              </div>
            )}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            <CommentList
              comments={comments}
              onMarkAsAnswer={handleCommentMarkAsAnswer}
              isQna={thread.category === 'QNA'}
              threadId={thread._id}
              username={thread.username}
              isLocked={thread.isLocked}
              onReplyCreated={handleReplyCreated}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Detailpage