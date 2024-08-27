'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Thread, Comment } from '../../../../types'
import CreateComment from '@/components/CreateComment'
import CommentList from '@/components/CommentList'
import { useUser } from '@clerk/nextjs'
import EditThread from '@/components/EditThread'

type DetailpageProps = {
  thread: Thread | null;
  onCommentCreate: (comment: Comment) => void;
  onThreadUpdate: (updatedThread: Thread) => void;
  onCommentMarkAsAnswer: (commentId: string) => void;
  userUsername?: string; 
}

const Detailpage: React.FC<DetailpageProps> = ({
  thread: threadProp,
  onCommentCreate,
  onThreadUpdate,
  onCommentMarkAsAnswer,
  userUsername, 
}) => {
  const [thread, setThread] = useState<Thread | null>(null);

  const params = useParams<{ id: string }>();
  const id = params ? params.id : undefined;

  useEffect(() => {
    if (id) {
      fetch(`/api/threads/${id}`)
        .then(response => response.json())
        .then(data => setThread(data))
        .catch(error => console.error('Error fetching thread:', error))
    }
  }, [id])

  if (!thread) {
    return <p>Thread not found.</p>
  }

  const toggleLockThread = async () => {
    const updatedThread = { ...thread, isLocked: !thread.isLocked };
    try {
      const response = await fetch(`/api/threads/${thread?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLocked: updatedThread.isLocked }),
      });
      if (!response.ok) {
        throw new Error('Response not OK');
      }
      const updatedThreadFromServer = await response.json();
      // Update the thread in the state
      setThread(updatedThreadFromServer);
    } catch (error) {
      console.error('Error updating thread:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
      <p>{thread.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Created by {thread.username} on {new Date(thread.creationDate).toLocaleDateString()}
      </p>

      {thread.username === userUsername && (
        <button 
          onClick={toggleLockThread} 
          className={`mt-2 px-4 py-2 rounded ${thread.isLocked ? 'bg-red-600' : 'bg-green-600'} text-white`}>
          {thread.isLocked ? 'Unlock Thread' : 'Lock Thread'}
        </button>
      )}

      <EditThread 
        thread={thread} 
        userUsername={userUsername} 
        onUpdateThread={onThreadUpdate} 
      />

      <CreateComment 
        threadId={thread ? thread._id : undefined}  
        onCommentCreate={onCommentCreate} 
        isLocked={thread ? thread.isLocked : false} 
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
