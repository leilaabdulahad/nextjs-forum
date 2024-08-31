import React from 'react'
import { Comment, Thread } from '../types'

interface CommentListProps {
  comments: Comment[];
  thread: Thread;
  onMarkAsAnswer: (commentId: string) => void;
  userUsername: string;
}

function CommentList({ comments, thread, onMarkAsAnswer, userUsername }: CommentListProps): JSX.Element {
    const isThreadCreator = thread.username === userUsername;
    const isQnaThread = thread.category === 'QNA';
    
    return (
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment._id} className="border p-4 rounded shadow-sm">
            <p className="font-semibold">{comment.content}</p>
            <p className="text-sm text-gray-500">Posted by: {comment.username}</p>
            <p className="text-sm text-gray-500">
              {new Date(comment.creationDate).toLocaleDateString()}
            </p>
            {isQnaThread && isThreadCreator && !thread.isLocked && (
              <button
                onClick={() => onMarkAsAnswer(comment._id)}
                className={`mt-2 px-4 py-2 rounded ${
                  comment.isAnswer ? 'bg-green-600' : 'bg-gray-300'
                } text-white`}
                disabled={thread.isLocked}
              >
                {comment.isAnswer ? 'Avmarkera' : 'Markera'}
              </button>
            )}
            {comment.isAnswer && (
              <p className="mt-2 text-green-600 font-semibold">Den kommentar är markerat som svar</p>
            )}
          </li>
        ))}
      </ul>
    )
  }

export default CommentList