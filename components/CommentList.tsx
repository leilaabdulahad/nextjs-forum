import { Comment } from '../types'
import ReplyForm from './ReplyForm'

type CommentListProps = {
    comments: Comment[]
    onMarkAsAnswer: (commentId: string, isAnswer: boolean) => void
    onReplyCreated: (newReply: Comment, parentCommentId: string) => void
    isQna: boolean
    threadId: string
    username: string
    isLocked: boolean
};

function CommentList({
    comments,
    onMarkAsAnswer,
    isQna,
    threadId,
    username,
    isLocked,
    onReplyCreated,
}: CommentListProps) {
    return (
        <ul className="space-y-4">
            {comments.map((comment) => (
                <li key={comment._id} className={`p-4 border rounded-lg ${comment.isAnswer ? 'bg-green-200' : ''}`}>
                    <p className="text-lg font-semibold">{comment.content}</p>
                    <p className="text-sm text-gray-500">{comment.username}</p>
                    <p className="text-sm text-gray-400">
                        {new Date(comment.creationDate).toLocaleDateString()}
                    </p>
                    {isQna && (
                        <button
                            onClick={() => onMarkAsAnswer(comment._id, !comment.isAnswer)}
                            className="mt-2 px-4 py-2 rounded bg-black text-white hover:bg-gray-900"
                        >
                            {comment.isAnswer ? 'Avmarkera' : 'Markera som svar'}
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
                            {comment.replies.map((reply) => (
                                <li key={reply._id} className="p-2 border-l-2 border-gray-300">
                                    <p>{reply.content}</p>
                                    <p className="text-sm text-gray-500">{reply.username}</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(reply.creationDate).toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default CommentList
