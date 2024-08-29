'use client'
import { Thread, Comment } from '../../../../types'
import CreateComment from '@/components/CreateComment'
import CommentList from '@/components/CommentList'
import { useUser } from '@clerk/nextjs'
import EditThread from '@/components/EditThread'

type DetailpageProps = {
  thread: Thread;
  onCommentCreate: (comment: Comment) => void;
  onThreadUpdate: (updatedThread: Thread) => void;
  onCommentMarkAsAnswer: (commentId: string) => void;
  userUsername?: string;
}

function Detailpage({
  thread,
  onCommentCreate,
  onThreadUpdate,
  onCommentMarkAsAnswer,
  userUsername,
}: DetailpageProps): JSX.Element {
  const { user } = useUser()

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

      <CreateComment 
        threadId={thread._id}  
        onCommentCreate={onCommentCreate} 
        isLocked={thread.isLocked} 
      />

      <h2 className="text-xl font-semibold mt-8">Comments</h2>
      <CommentList 
        comments={thread.comments} 
        threadCategory={thread.category} 
        threadOwner={thread.username} 
        userUsername={userUsername} 
        onMarkAsAnswer={onCommentMarkAsAnswer} 
      />
    </div>
  )
}

export default Detailpage
