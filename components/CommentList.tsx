import { useUser } from '@clerk/nextjs'
import { checkInappropriateWords } from '@/utils/utils'
import ReplyForm from './ReplyForm'

type CommentListProps = {
  comments: CommentType[]
  onMarkAsAnswer: (commentId: string, isAnswer: boolean) => void
  isQna: boolean
  threadId: string
  username: string
  isLocked: boolean
  onReplyCreated: (newReply: CommentType, parentCommentId: string) => void
}

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
    <ul className="space-y-4">
      {comments.map((comment: CommentType) => {
        const censoredContent: string = checkInappropriateWords(comment.content as string)

        const canMarkAsAnswer =
          user?.username === username || user?.publicMetadata?.isModerator

        return (
          <li key={comment._id} className={`p-4 border rounded-lg ${comment.isAnswer ? 'bg-green-200' : ''}`}>
            <p className="text-lg font-semibold">
              {comment.isCensored ? 'This comment has been censored.' : censoredContent}
            </p>
            <p className="text-sm text-gray-500">{comment.username}</p>
            <p className="text-sm text-gray-400">{new Date(comment.creationDate).toLocaleDateString()}</p>

            {isQna && canMarkAsAnswer && comment._id && typeof comment.isAnswer === 'boolean' ? (
              <button
                onClick={() => onMarkAsAnswer(comment._id, !comment.isAnswer)}
                className="mt-2 px-4 py-2 rounded bg-black text-white">
                {comment.isAnswer ? 'Unmark as Answer' : 'Mark as Answer'}
              </button>
                ) : null}


            <ReplyForm
              threadId={threadId}
              username={username}
              parentCommentId={comment._id}
              onReplyCreated={onReplyCreated}
              isLocked={isLocked}
            />

            {comment.replies && comment.replies.length > 0 && (
              <ul className="ml-4 mt-2">
                {comment.replies.map((reply) => (
                  <li key={reply._id} className="p-2 border-l-2 border-gray-300">
                    <p>{reply.isCensored ? 'This comment has been censored.' : String(reply.content)}</p>
                    <p className="text-sm text-gray-500">{reply.username}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(reply.creationDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default CommentList
