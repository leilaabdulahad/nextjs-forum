import { useState, useEffect } from 'react'
import { Thread, Comment } from '../../../../types'
import { useUser } from '@clerk/nextjs'
import EditThread from '@/components/EditThread'
import CommentForm from '../../../../components/CommentForm'
import CommentList from '@/components/CommentList'

type DetailpageProps = {
  thread: Thread;
  onThreadUpdate: (updatedThread: Thread) => void;
  userUsername?: string;
};

function Detailpage({
  thread,
  onThreadUpdate,
  userUsername,
}: DetailpageProps): JSX.Element {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/threads/${thread._id}/comments`);
      const fetchedComments: Comment[] = await response.json();
      setComments(fetchedComments);
    };

    fetchComments();
  }, [thread._id]);

  const handleCommentCreated = (newComment: Comment) => {
    setComments((prevComments) => [...prevComments, newComment])
  }

  const handleCommentMarkAsAnswer = async (commentId: string, isAnswer: boolean) => {
    // Check if the thread is of type Q&A
    if (thread.category !== 'QNA') return;

    try {
      const response = await fetch(`/api/threads/${thread._id}/comments/markAsAnswer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, isAnswer: !isAnswer }), 
      })

      if (!response.ok) {
        throw new Error('Failed to mark comment as answer')
      }

      const updatedCommentsResponse = await fetch(`/api/threads/${thread._id}/comments`);
      const updatedComments: Comment[] = await updatedCommentsResponse.json();
      setComments(updatedComments)
    } catch (error) {
      console.error('Error marking comment as answer:', error)
    }
  }
  

  if (!user || !user.username) {
    return <p>Please log in to view this page</p>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
      <p>{thread.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Created by {thread.username} on {new Date(thread.creationDate).toLocaleDateString()}
      </p>

      {thread.username === userUsername && (
        <EditThread
          thread={thread}
          userUsername={userUsername}
          onUpdateThread={onThreadUpdate}
        />
      )}

      <CommentList 
        comments={comments} 
        onMarkAsAnswer={handleCommentMarkAsAnswer} 
        isQna={thread.category === 'QNA'} 
      />
      <CommentForm
        threadId={thread._id}
        username={user.username}
        onCommentCreated={handleCommentCreated}
      />
    </div>
  )
}

export default Detailpage