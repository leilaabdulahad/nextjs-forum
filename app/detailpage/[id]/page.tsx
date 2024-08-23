'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Thread, Comment } from '../../../types'
import Detailpage from './_components/detail-page'

function DetailsPage() {
  const { id } = useParams()
  const [thread, setThread] = useState<Thread | null>(null)

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
      const updatedThread = {
        ...thread,
        comments: [...thread.comments, newComment],
      }
      setThread(updatedThread);
      // Update localStorage
      const storedThreads = localStorage.getItem('threads')
      if (storedThreads) {
        const threads: Thread[] = JSON.parse(storedThreads)
        const updatedThreads = threads.map(t => t.id === updatedThread.id ? updatedThread : t)
        localStorage.setItem('threads', JSON.stringify(updatedThreads))
      }
    }
  }

  if (!thread) {
    return <p>Thread not found.</p>
  }

  return <Detailpage thread={thread} onCommentCreate={handleCommentCreate} />
}

export default DetailsPage
