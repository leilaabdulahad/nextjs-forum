import { Comment } from '../types'

type CommentListProps = {
  comments: Comment[]
  onMarkAsAnswer: (commentId: string, isAnswer: boolean) => void
  isQna: boolean
}

function CommentList({ comments, onMarkAsAnswer, isQna }: CommentListProps) {
    return (
        <ul className="space-y-4">
            {comments.map((comment) => (
                <li key={comment._id} className={`p-4 border rounded-lg ${comment.isAnswer ? 'bg-green-200' : ''}`}>
                    <p className="text-lg font-semibold">{comment.content}</p>
                    <p className="text-sm text-gray-500">{comment.username}</p>
                    <p className="text-sm text-gray-400">{new Date(comment.creationDate).toLocaleDateString()}</p>
                    {isQna && (
                        <button 
                            className="mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                            onClick={() => onMarkAsAnswer(comment._id, comment.isAnswer || false)}
                        >
                            {comment.isAnswer ? 'Avmarkera som svar' : 'Markera som svar'}
                        </button>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default CommentList