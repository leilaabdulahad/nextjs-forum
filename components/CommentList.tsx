import { Comment } from '../types'

type CommentListProps = {
    comments: Comment[]
};

function CommentList({ comments }: CommentListProps) {
    return (
        <ul>
            {comments.map((comment) => (
                <li key={comment._id}>
                    <p>{comment.content}</p>
                    <p>{comment.username}</p>
                    <p>{new Date(comment.creationDate).toLocaleDateString()}</p>
                </li>
            ))}
        </ul>
    )
}

export default CommentList