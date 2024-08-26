'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Thread, Comment } from '../../../types'
import Detailpage from './_components/detail-page'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'


const DetailsPage = () => {
  const router = useRouter()
  const { id } = router.query 
  const [thread, setThread] = useState<Thread | null>(null)
  const { user } = useUser()

  useEffect(() => {
    if (id) {
      const storedThreads = localStorage.getItem('threads')
      if (storedThreads) {
        const threads: Thread[] = JSON.parse(storedThreads)
        const foundThread = threads.find((t) => t.id === Number(id))
        setThread(foundThread || null)
      }
    }
  }, [id])

  const handleCommentCreate = (newComment: Comment) => {
    if (thread) {
      const commentWithAnswerFlag = { ...newComment, isAnswer: false }
      const updatedThread = {
        ...thread,
        comments: [...thread.comments, commentWithAnswerFlag],
      }
      setThread(updatedThread);

      const storedThreads = localStorage.getItem('threads')
      if (storedThreads) {
        const threads: Thread[] = JSON.parse(storedThreads)
        const updatedThreads = threads.map(t =>
          t.id === updatedThread.id ? updatedThread : t
        );
        localStorage.setItem('threads', JSON.stringify(updatedThreads))
      }
    }
  }

  const handleThreadUpdate = (updatedThread: Thread) => {
    setThread(updatedThread)

    const storedThreads = localStorage.getItem('threads')
    if (storedThreads) {
      const threads: Thread[] = JSON.parse(storedThreads)
      const updatedThreads = threads.map(t =>
        t.id === updatedThread.id ? updatedThread : t
      )
      localStorage.setItem('threads', JSON.stringify(updatedThreads))
    }
  }

  const handleCommentMarkAsAnswer = (commentId: number) => {
    if (!thread) return
  
    const updatedComments = thread.comments.map(comment =>
      comment.id === commentId
        ? { ...comment, isAnswer: !comment.isAnswer } 
        : { ...comment, isAnswer: false }
    )
  
    const updatedThread = {
      ...thread,
      comments: updatedComments,
    }
  
    console.log('Updated Thread:', updatedThread)
  
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
