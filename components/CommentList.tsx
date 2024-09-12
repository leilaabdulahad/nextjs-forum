import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { checkInappropriateWords } from '@/utils/utils'
import ReplyForm from './ReplyForm'
import { MessageCircle, Award, ChevronDown, ChevronUp } from 'lucide-react'

type CommentListProps = {
  comments: CommentType[]
  onMarkAsAnswer: (commentId: string, isAnswer: boolean) => void
  isQna: boolean
  threadId: string
  username: string
  isLocked: boolean
  onReplyCreated: (newReply: CommentType, parentCommentId: string) => void
};

const CommentList = ({
  comments,
  onMarkAsAnswer,
  isQna,
  threadId,
  username,
  isLocked,
  onReplyCreated,
}: CommentListProps): JSX.Element => {
  const { user } = useUser()

  return (
    <ul className="space-y-6">
      {comments.map((comment: CommentType) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onMarkAsAnswer={onMarkAsAnswer}
          isQna={isQna}
          threadId={threadId}
          username={username}
          isLocked={isLocked}
          onReplyCreated={onReplyCreated}
          canMarkAsAnswer={user?.username === username || Boolean(user?.publicMetadata?.isModerator)}
        />
      ))}
    </ul>
  )
}

type CommentItemProps = {
  comment: CommentType
  onMarkAsAnswer: (commentId: string, isAnswer: boolean) => void
  isQna: boolean
  threadId: string
  username: string
  isLocked: boolean
  onReplyCreated: (newReply: CommentType, parentCommentId: string) => void
  canMarkAsAnswer: boolean
}

const CommentItem = ({
  comment,
  onMarkAsAnswer,
  isQna,
  threadId,
  username,
  isLocked,
  onReplyCreated,
  canMarkAsAnswer,
}: CommentItemProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false)
  const censoredContent: string = checkInappropriateWords(comment.content as string, comment)

  return (
    <li className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${comment.isAnswer ? 'ring-2 ring-green-500' : ''}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold">{comment.username[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold">{comment.username}</p>
              <p className="text-sm text-gray-500">{new Date(comment.creationDate).toLocaleString()}</p>
            </div>
          </div>
          {comment.isAnswer && (
            <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Answer
            </div>
          )}
        </div>
        <p className="mt-3 text-gray-700">
          {comment.isCensored ? 'This comment has been censored.' : censoredContent}
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <button 
            className="flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-200"
            onClick={() => setIsExpanded(!isExpanded)}>
            <MessageCircle className="w-5 h-5 mr-1" />
            <span>Svara</span>
          </button>
          {isQna && canMarkAsAnswer && comment._id && typeof comment.isAnswer === 'boolean' && (
            <button
              onClick={() => onMarkAsAnswer(comment._id, !comment.isAnswer)}
              className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                comment.isAnswer
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}>
              <Award className="w-4 h-4 mr-1" />
              {comment.isAnswer ? 'Unmark Answer' : 'Mark as Answer'}
            </button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <ReplyForm
            threadId={threadId}
            username={username}
            parentCommentId={comment._id}
            onReplyCreated={onReplyCreated}
            isLocked={isLocked}
          />
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <button
            className="flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200"
            onClick={() => setIsExpanded(!isExpanded)}>

            {isExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
            {isExpanded ? 'Göm' : 'Visa'} {comment.replies.length} {comment.replies.length === 1 ? 'svar' : 'svar'}

          </button>
          {isExpanded && (
            <ul className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <li key={reply._id} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">{reply.username[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{reply.username}</p>
                      <p className="text-xs text-gray-500">{new Date(reply.creationDate).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    {reply.isCensored ? 'This reply has been censored.' : (reply.content)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  )
}

export default CommentList
