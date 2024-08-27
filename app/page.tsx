'use client'
import { useEffect, useState } from 'react'
import CreateThread from '../components/CreateThread'
import ThreadList from '../components/ThreadList'
import { Thread } from '../types'
import { useUser } from '@clerk/nextjs'

const Home = () => {
  const [threads, setThreads] = useState<Thread[]>([])
  const { user } = useUser()

  useEffect(() => {
    const storedThreads = localStorage.getItem('threads')
    if (storedThreads) {
      setThreads(JSON.parse(storedThreads))
    }
  }, [])

  const handleCreateThread = (newThread: Thread) => {
    const updatedThreads = [...threads, newThread]
    setThreads(updatedThreads)
    localStorage.setItem('threads', JSON.stringify(updatedThreads))
  }
  

  const toggleThreadLock = async (threadId: string) => {
    const thread = threads.find(thread => thread._id === threadId)
    if (thread) {
      const updatedThread = { ...thread, isLocked: !thread.isLocked }
      try {
        const response = await fetch(`/api/threads/${threadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isLocked: updatedThread.isLocked }),
        })
        if (!response.ok) {
          throw new Error('Response not OK')
        }
        const updatedThreadFromServer = await response.json()
        //updates the thread in the state
        setThreads(threads.map(thread => thread._id === threadId ? updatedThreadFromServer : thread))
      } catch (error) {
        console.error('Error updating thread:', error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Forum</h1>
      <CreateThread onCreate={handleCreateThread} />
      <h2 className="text-xl font-semibold mt-8 mb-4">Alla trådar</h2>
      <ThreadList threads={threads} onToggleLock={toggleThreadLock} /> 
    </div>
  )
}

export default Home
