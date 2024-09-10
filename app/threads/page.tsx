'use client'
import React, { useEffect, useState } from 'react'
import ThreadList from '@/components/ThreadList'
import { useUser } from '@clerk/nextjs'

const AllThreads = () => {
  const [threads, setThreads] = useState<Thread[]>([])
  const { user } = useUser()

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/threads')
        if (!response.ok) {
          throw new Error('Failed to fetch threads')
        }
        let data: Thread[] = await response.json()
        data = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        setThreads(data);
      } catch (error) {
        console.error('Error fetching threads:', error)
      }
    }

    fetchThreads()
  }, [])

  const toggleThreadLock = async (threadId: string) => {
    const thread = threads.find((thread) => thread._id === threadId)
    if (thread) {
      const updatedLockState = !thread.isLocked
      try {
        const response = await fetch(`/api/threads/${threadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id, 
            isLocked: updatedLockState, 
          }),
        })
        if (!response.ok) {
          throw new Error('Response not OK')
        }
        const updatedThreadFromServer = await response.json();
        setThreads(threads.map((thread) => (thread._id === threadId ? updatedThreadFromServer : thread)))
      } catch (error) {
        console.error('Error updating thread:', error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mt-8 mb-4">Alla trådar</h2>
      <ThreadList threads={threads} onToggleLock={toggleThreadLock} />
    </div>
  )
}

export default AllThreads