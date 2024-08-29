'use client'

import React, { useState } from 'react'
import { Thread } from '../types'

type EditThreadProps = {
  thread: Thread;
  userUsername: string | undefined;
  onUpdateThread: (updatedThread: Thread) => void;
}

const EditThread: React.FC<EditThreadProps> = ({
  thread,
  userUsername,
  onUpdateThread,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(thread.title)
  const [description, setDescription] = useState(thread.description)

  if (thread.username !== userUsername) {
    return <p>Du har inte rätt att redigera denna tråd.</p>
  }

  const handleSave = async () => {
    const updatedThread = { ...thread, title, description }

    try {
      const response = await fetch(`/api/threads/${thread._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) {
        throw new Error('Failed to update thread')
      }

      const updatedThreadFromServer = await response.json()
      onUpdateThread(updatedThreadFromServer)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating thread:', error)
    }
  }

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel"
            className="border rounded p-2 mb-2 w-full"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beskrivning"
            className="border rounded p-2 mb-2 w-full"
          />
          <button onClick={handleSave} className="bg-green-500 text-white rounded p-2">
            Spara
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white rounded p-2 ml-2">
            Avbryt
          </button>
        </div>
      ) : (
        <div>
          <h2>{thread.title}</h2>
          <p>{thread.description}</p>
          <button onClick={() => setIsEditing(true)} className="text-blue-500">
            Redigera tråd
          </button>
        </div>
      )}
    </div>
  )
}

export default EditThread
