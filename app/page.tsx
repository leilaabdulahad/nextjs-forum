'use client'
import { useEffect, useState } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import Hero from '../components/Hero'
import ThreadList from '../components/ThreadList'
import CreateThread from '../components/CreateThread'

const Home = () => {
  const [threads, setThreads] = useState<Thread[]>([])
  const { user } = useUser()
  const { isSignedIn } = useAuth()

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/threads')
        if (!response.ok) {
          throw new Error('Kunde inte hämta trådar')
        }
        let data: Thread[] = await response.json()
        data = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        setThreads(data)
      } catch (error) {
        console.error('Fel vid hämtning av trådar:', error)
      }
    }
    fetchThreads()
  }, [])

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
          console.log('Sparad användare:', data);
        })
        .catch((error) => console.error('Fel vid sparande av användare:', error))
    }
  }, [isSignedIn, user])

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
          throw new Error('Svar inte OK')
        }
        const updatedThreadFromServer = await response.json();
        setThreads(threads.map((thread) => (thread._id === threadId ? updatedThreadFromServer : thread)))
      } catch (error) {
        console.error('Fel vid uppdatering av tråd:', error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Hero />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Senaste trådarna</h2>
        <ThreadList
          threads={threads}
          onToggleLock={toggleThreadLock}
        />
      </div>
      {isSignedIn && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Skapa ny tråd</h2>
          <CreateThread onCreate={handleCreateThread} />
        </div>
      )}
    </div>
  )
}

export default Home