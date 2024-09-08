'use client'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

type CreateThreadPayload = Omit<Thread, '_id'> & { comments: [] }

type CreateThreadProps = {
  onCreate: (thread: Thread) => void
}

const CreateThread = ({ onCreate }: CreateThreadProps): JSX.Element => {
  const { user } = useUser()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ThreadCategory>('THREAD')

  const handleSubmit = async () => {
    if (!user) return
    const newThread: CreateThreadPayload = {
      title,
      description,
      creationDate: new Date().toISOString(),
      category,
      username: user.username || `${user.firstName} ${user.lastName}`,
      isLocked: false,
      comments: []
    }
    try {
      const response = await fetch('/api/threads/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newThread),
      })
      if (!response.ok) {
        console.error(`Response status: ${response.status}, status text: '${response.statusText}'`)
        throw new Error('Failed to create thread')
      }
      const createdThread: Thread = await response.json()
      onCreate(createdThread)
      setTitle('')
      setDescription('')
      setCategory('THREAD')
    } catch (error) {
      console.error(error)
    }
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
      <div className="mb-4">
        <label className="mr-4">Kategori:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ThreadCategory)}
          className="p-2 border rounded"
        >
          <option value="THREAD">Diskussionstråd</option>
          <option value="QNA">Fråga och Svar</option>
        </select>
      </div>
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