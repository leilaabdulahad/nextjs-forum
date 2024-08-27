'use client'
import React, { useState } from 'react'
import { Comment } from '../types'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface CreateCommentProps {
  threadId?: string;  
  onCommentCreate: (newComment: Comment) => void;
  isLocked: boolean;
}

const CreateComment: React.FC<CreateCommentProps> = ({ threadId, onCommentCreate, isLocked }) => {
  const { user } = useUser()
  const router = useRouter()
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    const userName = user?.fullName || user?.username || 'Anonymous'
    const newComment: Comment = {
      _id: Date.now().toString(), 
      threadId,
      content,
      creationDate: new Date().toISOString(),
      username: userName,
    }
    onCommentCreate(newComment)
    setContent('')
  }

  const handleClick = () => {
    if (!user) {
      router.push('/sign-in')
    } else {
      handleSubmit()
    }
  };

  if (!user) {
    return (
      <div className="border p-4 rounded shadow-sm">
        <p>Du måste vara inloggad för att kunna kommentera.</p>
        <button
          onClick={() => router.push('/sign-in')}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Logga in
        </button>
      </div>
    )
  }

  //prevents commenting if the threads locked
  if (isLocked) {
    return (
      <div className="border p-4 rounded shadow-sm">
        <p>Denna tråd är låst och kan inte kommenteras.</p>
      </div>
    )
  }

  return (
    <div className="border p-4 rounded shadow-sm space-y-4">
      <textarea
        placeholder="Skriv din kommentar här..."
        className="w-full p-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Kommentera
      </button>
    </div>
  )
}

export default CreateComment
