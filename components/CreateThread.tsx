'use client'
import React, { useState } from 'react'
import { Thread } from '../types'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

type CreateThreadProps = {
  onCreate: (thread: Thread) => void
}

const CreateThread: React.FC<CreateThreadProps> = ({ onCreate }) => {
  const { user } = useUser()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (!user) return

    const newThread: Thread = {
      id: Date.now(),
      title,
      description,
      creationDate: new Date().toISOString(),
      category: 'THREAD',
      comments: [],
      username: user.username || `${user.firstName} ${user.lastName}`,
    }

    const existingThreads = JSON.parse(localStorage.getItem('threads') || '[]')
    const updatedThreads = [...existingThreads, newThread]
    localStorage.setItem('threads', JSON.stringify(updatedThreads))

    onCreate(newThread)
    setTitle('')
    setDescription('')
  }

  const handleClick = () => {
    if (!user) {
      router.push('/sign-in')
    } else {
      handleSubmit()
    }
  }

  if (!user) {
    return (
      <div className="border p-4 rounded shadow-sm">
        <p>Du måste vara inloggad för att skapa en tråd.</p>
        <button
          onClick={() => router.push('/sign-in')}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Logga in
        </button>
      </div>
    )
  }

  return (
    <div className="border p-4 rounded shadow-sm space-y-4">
      <input
        type="text"
        placeholder="Titel"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Beskrivning"
        className="w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Skapa tråd
      </button>
    </div>
  )
}

export default CreateThread
