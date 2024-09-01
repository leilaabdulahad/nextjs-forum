'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Detailpage from './_components/detail-page'
import { Thread, Comment } from '@/types'
import { useUser } from '@clerk/nextjs'

function DetailsPage(): JSX.Element {
  const params = useParams<{ id: string }>() || { id: '' }
  const id = params.id
  const [thread, setThread] = useState<Thread | null>(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchThread = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/threads/${id}`)
          if (!response.ok) {
            throw new Error('Failed to fetch thread')
          }
          const data: Thread = await response.json()
          setThread(data)
        } catch (error) {
          console.error('Error fetching thread:', error)
        }
      }
    };

    fetchThread()
  }, [id])

  const handleCommentCreate = async (newComment: Comment) => {
    if (!thread) return

    console.log('Creating comment for thread:', newComment)

    try {
      const response = await fetch(`/api/threads/${thread._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment), 
      })

      if (!response.ok) {
        throw new Error('Failed to create comment')
      }

      //fetches the updated thread after creating a new comment
      const responseThread = await fetch(`/api/threads/${thread._id}`)
      const updatedThread: Thread = await responseThread.json()

      setThread(updatedThread);
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleThreadUpdate = (updatedThread: Thread) => {
    setThread(updatedThread)
  }

  const handleCommentMarkAsAnswer = async (commentId: string) => {
    if (!thread || thread.category !== 'QNA') return; // Only allow marking in Q&A threads

    try {
      // Find the comment that needs to be marked/unmarked as answer
      const commentToMark = thread.comments.find(comment => comment._id === commentId);
      if (!commentToMark) return;

      // Toggle the isAnswer status of the comment
      const newIsAnswerStatus = !commentToMark.isAnswer;

      const response = await fetch(`/api/threads/${thread._id}/comments/markAsAnswer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, isAnswer: newIsAnswerStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark comment as answer');
      }

      // Update the local state to reflect the change
      setThread(prevThread => {
        if (!prevThread) return null;

        // Map through the comments and update the isAnswer status of the marked comment
        const updatedComments = prevThread.comments.map(comment =>
          comment._id === commentId ? { ...comment, isAnswer: newIsAnswerStatus } : comment
        );

        return { ...prevThread, comments: updatedComments };
      });
    } catch (error) {
      console.error('Error marking comment as answer:', error);
    }
  };
  

  const userUsername = user?.username || ''

  return thread ? (
    <Detailpage 
      thread={thread}
      onThreadUpdate={handleThreadUpdate} 
      userUsername={userUsername} 
    />
  ) : (
    <p>Loading...</p>
  )
}

export default DetailsPage
