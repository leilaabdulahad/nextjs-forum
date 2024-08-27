'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Detailpage from './_components/detail-page'
import { Thread, Comment } from '../../../types'
import { useUser } from '@clerk/nextjs'

const DetailsPage = () => {
  const params = useParams<{ _id: string }>()
  const _id = params ? params._id : undefined
  const [thread, setThread] = useState<Thread | null>(null)
  const { user } = useUser()

  useEffect(() => {
    if (_id) {
      fetch(`/api/threads/${_id}`)
        .then(response => response.json())
        .then(data => setThread(data))
        .catch(error => console.error('Error fetching thread:', error))
    }
  }, [_id])



  const handleCommentCreate = (newComment: Comment) => {
    if (thread) {
      const commentWithAnswerFlag = { ...newComment, isAnswer: false }
      const updatedThread = {
        ...thread,
        comments: [...thread.comments, commentWithAnswerFlag],
      }
      setThread(updatedThread)
    }
  }

  const handleThreadUpdate = (updatedThread: Thread) => {
    setThread(updatedThread)
  }

  const handleCommentMarkAsAnswer = (commentId: string) => {
    if (!thread) return

    const updatedComments = thread.comments.map(comment =>
      comment._id === commentId
        ? { ...comment, isAnswer: !comment.isAnswer }
        : { ...comment, isAnswer: false }
    )

    const updatedThread = {
      ...thread,
      comments: updatedComments,
    }

    handleThreadUpdate(updatedThread)
  }

  const userUsername = user?.username || undefined

  return (
    <Detailpage 
      thread={thread}
      onCommentCreate={handleCommentCreate} 
      onThreadUpdate={handleThreadUpdate} 
      onCommentMarkAsAnswer={handleCommentMarkAsAnswer} 
      userUsername={userUsername} 
    />
  )
}

export default DetailsPage
