import ReplyForm from './ReplyForm'
import { checkInappropriateWords } from '@/utils/utils'
import { useUser } from '@clerk/nextjs'

function CommentList({
  comments,
  onMarkAsAnswer,
  isQna,
  threadId, 
  username, 
  isLocked,
  onReplyCreated,
}: CommentListProps) {
  const { user } = useUser()

  return (
    <ul className="space-y-4">
      {comments.map((comment) => {
        checkInappropriateWords(comment);
        
        const canMarkAsAnswer = (username === comment.username || (user && user.isModerator)); 
        
        return (
          <li key={comment._id} className={`p-4 border rounded-lg ${comment.isAnswer ? 'bg-green-200' : ''}`}>
            <p className="text-lg font-semibold">{comment.isCensored ? 'This comment has been censored.' : comment.content}</p>
            <p className="text-sm text-gray-500">{comment.username}</p>
            <p className="text-sm text-gray-400">
              {new Date(comment.creationDate).toLocaleDateString()}
            </p>
            {isQna && canMarkAsAnswer && ( 
                onClick={() => onMarkAsAnswer(comment._id, !comment.isAnswer)}
                className="mt-2 px-4 py-2 rounded bg-black text-white hover:bg-gray-900"
              >
                {comment.isAnswer ? 'Unmark as answer' : 'Mark as answer'}
              </button>
            )}

            <ReplyForm
              threadId={threadId}
              username={username}
              parentCommentId={comment._id}
              onReplyCreated={onReplyCreated} 
              isLocked={isLocked}
            />

            {comment.replies && comment.replies.length > 0 && (
              <ul className="ml-4 mt-2">
                {comment.replies.map((reply) => {
                  checkInappropriateWords(reply);
                  return (
                    <li key={reply._id} className="p-2 border-l-2 border-gray-300">
                      <p>{reply.isCensored ? 'This comment has been censored.' : reply.content}</p>
                      <p className="text-sm text-gray-500">{reply.username}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(reply.creationDate).toLocaleDateString()}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default CommentList
