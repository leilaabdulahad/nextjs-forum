'use client'
import React, { useState } from 'react'
import { Thread } from '../types'

type CreateThreadProps = {
  onCreate: (thread: Thread) => void
}

const CreateThread: React.FC<CreateThreadProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    const newThread: Thread = {
      id: Date.now(),
      title,
      description,
      creationDate: new Date().toISOString(),
      category: 'THREAD',
    }
    onCreate(newThread)
    setTitle('')
    setDescription('')
  }

  return (
    <div className="border p-4 rounded shadow-sm space-y-4">
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Beskrvning"
        className="w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Skapa tråd
      </button>
    </div>
  )
}

export default CreateThread
