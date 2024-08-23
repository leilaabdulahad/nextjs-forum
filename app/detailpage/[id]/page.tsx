'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Thread } from '../../../types'
import Detailpage from './_components/detail-page'

function DetailsPage() {
  const { id } = useParams()
  const [thread, setThread] = useState<Thread | null>(null)

  useEffect(() => {
    if (id) {
      const storedThreads = localStorage.getItem('threads')
      if (storedThreads && storedThreads !== "") {
        const threads: Thread[] = JSON.parse(storedThreads)
        const foundThread = threads.find((t) => t.id === Number(id))
        setThread(foundThread || null)
      }
    }
  }, [id])

  if (!thread) {
    return <p>Thread not found.</p>
  }

  return <Detailpage thread={thread} />
}

export default DetailsPage