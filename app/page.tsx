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
  

  const toggleThreadLock = (threadId: number) => {
    const updatedThreads = threads.map(thread => {
      if (thread.id === threadId && thread.username === user?.username) {
        return { ...thread, isLocked: !thread.isLocked }
      }
      return thread
    })

    setThreads(updatedThreads)
    localStorage.setItem('threads', JSON.stringify(updatedThreads))
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
