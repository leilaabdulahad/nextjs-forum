import { Comment } from '../types'

type CommentListProps = {
  comments: Comment[]
  onMarkAsAnswer: (commentId: string, isAnswer: boolean) => void
  isQna: boolean
}

function CommentList({ comments, onMarkAsAnswer, isQna }: CommentListProps) {
    return (
        <ul>
            {comments.map((comment) => (
                <li key={comment._id}>
                    <p>{comment.content}</p>
                    <p>{comment.username}</p>
                    <p>{new Date(comment.creationDate).toLocaleDateString()}</p>
                    {isQna && (
                        <button onClick={() => onMarkAsAnswer(comment._id, comment.isAnswer || false)}>
                            {comment.isAnswer ? 'Avmarkera som svar' : 'Markera som svar'}
                        </button>
                    )}
                  
                </li>
            ))}
        </ul>
    )
}

export default CommentList