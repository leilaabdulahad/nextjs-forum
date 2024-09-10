import { useState } from 'react'

type ReplyFormProps = {
  threadId: string
  username: string
  parentCommentId: string
  onReplyCreated: (newReply: CommentType, parentCommentId: string) => void
  isLocked: boolean
}

const ReplyForm = ({ threadId, username, parentCommentId, onReplyCreated, isLocked }: ReplyFormProps): JSX.Element => {
  const [content, setContent] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newReply: CommentType = {
      _id: Math.random().toString(36).substring(7), // Generate random ID for demo purposes
      threadId,
      parentCommentId,
      content,
      username,
      creationDate: new Date().toISOString(),
      isAnswer: false,
      replies: [], 
      isCensored: false,
    }

    try {
      const response = await fetch(`/api/threads/${threadId}/comments/${parentCommentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, username, parentCommentId }),
      });

      if (response.ok) {
        onReplyCreated(newReply, parentCommentId);
        setContent('');
      } else {
        const errorResponse = await response.json();
        console.error('Failed to post reply:', errorResponse);
      }
    } catch (error) {
      console.error('Failed to post reply:', error);
    }
  };

  if(isLocked){
    return <p className='text-red-500'>Tråden är låst.</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        placeholder=""
        className="w-full mt-6 p-2 border border-gray-300 rounded-md"

      />
      <button type="submit" className="mt-2 px-4 py-2 bg-black text-white rounded-md">Reply</button>
    </form>
  )
}

export default ReplyForm