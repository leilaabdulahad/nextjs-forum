'use client'

import React, { useState } from 'react'
import { Comment } from '../types'

type CreateCommentProps = {
  threadId: number;
  onCommentCreate: (comment: Comment) => void
}

const CreateComment: React.FC<CreateCommentProps> = ({ threadId, onCommentCreate }) => {
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    const newComment: Comment = {
      id: Date.now(),
      threadId,
      content,
      creationDate: new Date().toISOString(),
    }
    onCommentCreate(newComment)
    setContent('')
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
        onClick={handleSubmit}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Kommentera
      </button>
    </div>
  )
}

export default CreateComment
