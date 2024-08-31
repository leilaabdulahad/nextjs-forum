import React from 'react'
import { Comment, ThreadCategory } from '../types'

type CommentListProps = {
  comments: Comment[]
  threadCategory: ThreadCategory
  threadOwner: string;
  userUsername?: string;
  onMarkAsAnswer: (commentId: string) => void;
};

const CommentList: React.FC<CommentListProps> = ({
  comments = [], 
  threadCategory,
  threadOwner,
  userUsername, 
  onMarkAsAnswer,
}) => {
  if (comments.length === 0) {
    return <p>Inga kommentarer ännu.</p>
  }

  console.log('Category:', threadCategory)
  console.log('Owner:', threadOwner)
  console.log('Username:', userUsername)

  return (
    <ul>
      {comments.map((comment) => {
  console.log("Comment ID:", comment._id);
  return (
    <li key={comment._id} className={`border-b py-2 ${comment.isAnswer ? 'bg-green-100' : ''}`}>
      <p>{comment.content}</p>
      <p className="text-sm text-gray-500">
        Skapad av {comment.username} den {new Date(comment.creationDate).toLocaleDateString()}
      </p>
      {threadCategory === 'QNA' && threadOwner === userUsername && (
        <button 
          onClick={() => onMarkAsAnswer(comment._id)} 
          className="text-blue-500"
        >
          {comment.isAnswer ? 'Avmarkera som svar' : 'Markera som svar'}
        </button>
      )}
      {comment.isAnswer && <p className="text-green-500">Svar</p>}
    </li>
  );
})}

    </ul>
  )
}

export default CommentList
