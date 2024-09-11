'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import CreateThread from '@/components/CreateThread'

const CreatePage = () => {
  const [threads, setThreads] = useState<Thread[]>([])
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const { isSignedIn } = useAuth()

  const handleCreateThread = (newThread: Thread) => {
    const updatedThreads = [newThread, ...threads]
    setThreads(updatedThreads)
    setConfirmation('Inlägget har skapats')

    setTimeout(() => setConfirmation(null), 100000000)
  }

  return (
    <div className='container mx-auto p-4'>
      {isSignedIn && (
        <div className="mt-12">
          {confirmation && (
            <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
              {confirmation}
            </div>
          )}
          <h2 className="text-2xl font-bold mb-4">Skapa ny tråd</h2>
          <CreateThread onCreate={handleCreateThread} clearConfirmation={() => setConfirmation(null)} />
        </div>
      )}
    </div>
  )
}

export default CreatePage
