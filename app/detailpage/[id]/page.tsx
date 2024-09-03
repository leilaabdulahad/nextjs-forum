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
  const [comments, setComments] = useState<Comment[]>([])
  const { user } = useUser()

  useEffect(() => {
    const fetchThreadAndComments = async () => {
      if (id) {
        try {
          const threadResponse = await fetch(`/api/threads/${id}`)
          if (!threadResponse.ok) {
            throw new Error('Failed to fetch thread');
          }
          const threadData: Thread = await threadResponse.json()
          setThread(threadData)

          const commentsResponse = await fetch(`/api/threads/${id}/comments`)
          if (!commentsResponse.ok) {
            throw new Error('Failed to fetch comments')
          }
          const commentsData: Comment[] = await commentsResponse.json()
          setComments(commentsData);
        } catch (error) {
          console.error('Error fetching thread or comments:', error)
        }
      }
    }
    fetchThreadAndComments()
  }, [id])

  const handleCommentCreate = async (newComment: Comment) => {
    if (!thread) return;
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

      const createdComment: Comment = await response.json()

      setComments(prevComments => [...prevComments, createdComment])
      setThread(prevThread => {
        if (!prevThread) return null
        return {
          ...prevThread,
          comments: [...prevThread.comments, createdComment],
        }
      })
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleThreadUpdate = (updatedThread: Thread) => {
    setThread(updatedThread)
  }

  const handleCommentMarkAsAnswer = async (commentId: string) => {
    if (!thread || thread.category !== 'QNA') return

    try {
      const commentToMark = thread.comments.find(comment => comment._id === commentId);
      if (!commentToMark) return

      const newIsAnswerStatus = !commentToMark.isAnswer

      const response = await fetch(`/api/threads/${thread._id}/comments/markAsAnswer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, isAnswer: newIsAnswerStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark comment as answer')
      }

      setThread(prevThread => {
        if (!prevThread) return null;

        const updatedComments = prevThread.comments.map(comment =>
          comment._id === commentId ? { ...comment, isAnswer: newIsAnswerStatus } : comment
        );

        return { ...prevThread, comments: updatedComments }
      });
    } catch (error) {
      console.error('Error marking comment as answer:', error)
    }
  }

  const userUsername = user?.username || ''

  return thread ? (
    <Detailpage
      thread={thread}
      onThreadUpdate={handleThreadUpdate}
      onCommentCreate={handleCommentCreate}
      userUsername={userUsername}
      onCommentMarkAsAnswer={handleCommentMarkAsAnswer}
    />
  ) : (
    <p>Loading...</p>
  )
}

export default DetailsPage
