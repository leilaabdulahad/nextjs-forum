'use client'
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface CreateCommentProps {
  threadId: string;  
  onCommentCreate: (newComment: any) => void;
  isLocked: boolean;
}

const CreateComment: React.FC<CreateCommentProps> = ({ threadId, onCommentCreate, isLocked }) => {
  const { user } = useUser()
  const router = useRouter()
  const [content, setContent] = useState('')

  const handleSubmit = async () => {
    const userName = user?.fullName || user?.username || 'Anonymous'

    try {
      const response = await fetch(`/api/threads/${threadId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, username: userName }),
      })

      if (!response.ok) {
        throw new Error('Failed to create comment')
      }

      const updatedThread = await response.json()
      onCommentCreate(updatedThread)
      setContent('')
    } catch (error) {
      console.error('Error creating comment:', error)
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
        <p>You need to be logged in to comment.</p>
        <button
          onClick={() => router.push('/sign-in')}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Log in
        </button>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="border p-4 rounded shadow-sm">
        <p>This thread is locked and cannot be commented on.</p>
      </div>
    )
  }

  return (
    <div className="border p-4 rounded shadow-sm space-y-4">
      <textarea
        placeholder="Write your comment here..."
        className="w-full p-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Comment
      </button>
    </div>
  )
}

export default CreateComment
