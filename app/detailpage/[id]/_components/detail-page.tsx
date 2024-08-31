import React from 'react'
import { Thread, Comment } from '../../../../types'
import { useUser } from '@clerk/nextjs'
import EditThread from '@/components/EditThread'
import CommentForm from '../../../../components/CommentForm'
import CommentList from '@/components/CommentList'

type DetailpageProps = {
  thread: Thread
  comments: Comment[]
  onThreadUpdate: (updatedThread: Thread) => void
  onCommentCreate: (newComment: Comment) => void
  userUsername?: string
  onCommentMarkAsAnswer: (commentId: string) => void
}

function Detailpage({
  thread,
  comments,
  onThreadUpdate,
  onCommentCreate,
  userUsername,
  onCommentMarkAsAnswer,
}: DetailpageProps): JSX.Element {
  const { user } = useUser();

  if (!user || !user.username) {
    return <p>Please log in to view this page</p>
  }

  const hasAnswer = comments.some(comment => comment.isAnswer);

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
        thread={thread}
        onMarkAsAnswer={onCommentMarkAsAnswer}
        userUsername={userUsername || ''}
      />
      <CommentForm 
        threadId={thread._id} 
        username={user.username} 
        onCommentCreated={onCommentCreate} 
        isLocked={thread.isLocked}
        hasAnswer={hasAnswer}  
      />
    </div>
  )
}

export default Detailpage
