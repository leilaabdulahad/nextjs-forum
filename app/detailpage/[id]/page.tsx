'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Detailpage from './_components/detail-page'
import { Thread, Comment } from '@/types'
import { useUser } from '@clerk/nextjs'

function DetailsPage(): JSX.Element {
  const params = useParams<{ id: string }>()
  const id = params ? params.id : undefined
  const [thread, setThread] = useState<Thread | null>(null)
  const { user } = useUser()

  useEffect(() => {
    if (id) {
      fetch(`/api/threads/${id}`)
        .then(response => response.json())
        .then(data => setThread(data))
        .catch(error => console.error('Error fetching thread:', error))
    }
  }, [id])

  const handleCommentCreate = async (newComment: Comment) => {
    try {
      const response = await fetch(`/api/threads/${thread?._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      })

      if (!response.ok) {
        throw new Error('Failed to create comment')
      }

      const updatedThread = await response.json()
      setThread(updatedThread)
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleThreadUpdate = (updatedThread: Thread) => {
    setThread(updatedThread)
  }

  const handleCommentMarkAsAnswer = async (commentId: string) => {
    if (!thread) return

    const updatedComments = thread.comments.map(comment =>
      comment._id === commentId
        ? { ...comment, isAnswer: !comment.isAnswer }
        : { ...comment, isAnswer: false }
    )

    const updatedThread = { ...thread, comments: updatedComments }

    try {
      const response = await fetch(`/api/threads/${thread._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comments: updatedThread.comments }),
      })

      if (!response.ok) {
        throw new Error('Failed to update thread')
      }

      const data = await response.json()
      setThread(data)
    } catch (error) {
      console.error('Error marking comment as answer:', error)
    }
  }

  const userUsername = user?.username || undefined

  return thread ? (
    <Detailpage 
      thread={thread}
      onCommentCreate={handleCommentCreate} 
      onThreadUpdate={handleThreadUpdate} 
      onCommentMarkAsAnswer={handleCommentMarkAsAnswer} 
      userUsername={userUsername} 
    />
  ) : (
    <p>Loading...</p>
  )
}

export default DetailsPage
