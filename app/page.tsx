'use client'
import { useEffect, useState } from 'react'
import CreateThread from '../components/CreateThread'
import ThreadList from '../components/ThreadList'
import { useUser, useAuth } from '@clerk/nextjs'
import React from 'react'

const Home = () => {
  const [threads, setThreads] = useState<Thread[]>([])
  const { user } = useUser()
  const { isSignedIn } = useAuth()

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/threads')
        if (!response.ok) {
          throw new Error('Failed to fetch threads')
        }
        let data: Thread[] = await response.json()
        data = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        setThreads(data)
      } catch (error) {
        console.error('Error fetching threads:', error)
      }
    }

    fetchThreads()
  }, [])

  const handleCreateThread = (newThread: Thread) => {
    const updatedThreads = [newThread, ...threads]
    setThreads(updatedThreads);
  }


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

useEffect(() => {
  if (isSignedIn && user) {
    fetch('/api/users/saveUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerkId: user.id,
        username: user.username || user.emailAddresses[0]?.emailAddress,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Saved user:', data);
      })
      .catch((error) => console.error('Error saving user:', error))
  }
}, [isSignedIn, user])


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Skapa tråd</h1>
      <CreateThread onCreate={handleCreateThread} />
      <h2 className="text-xl font-semibold mt-8 mb-4">Alla trådar</h2>
      <ThreadList 
        threads={threads} 
        onToggleLock={toggleThreadLock} 
         />

    </div>
  )
}

export default Home
