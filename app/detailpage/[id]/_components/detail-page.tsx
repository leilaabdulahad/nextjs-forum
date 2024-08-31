import { useState, useEffect } from 'react'
import { Thread, Comment } from '../../../../types'
import { useUser } from '@clerk/nextjs'
import EditThread from '@/components/EditThread'
import CommentForm from '../../../../components/CommentForm'
import CommentList from '@/components/CommentList'

type DetailpageProps = {
  thread: Thread
  onThreadUpdate: (updatedThread: Thread) => void
  userUsername?: string
}

function Detailpage({
  thread,
  onThreadUpdate,
  userUsername,
}: DetailpageProps): JSX.Element {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch(`/api/threads/${thread._id}/comments`)
      .then(response => response.json())
      .then(setComments)
  }, [thread._id])

  const handleCommentCreated = (newComment: Comment) => {
    setComments(prevComments => [...prevComments, newComment])
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

      <CommentList comments={comments} /> 
      <CommentForm threadId={thread._id} username={user.username} onCommentCreated={handleCommentCreated} /> 
    </div>
  )
}

export default Detailpage