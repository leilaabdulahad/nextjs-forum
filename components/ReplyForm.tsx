import React, { useState } from 'react';
import { Comment } from '../types';

type ReplyFormProps = {
  threadId: string;
  username: string;
  parentCommentId: string;
  onReplyCreated: (newReply: Comment, parentCommentId: string) => void; // Expecting two arguments
};

const ReplyForm: React.FC<ReplyFormProps> = ({ threadId, username, parentCommentId, onReplyCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newReply: Comment = {
      _id: Math.random().toString(36).substring(7), // Replace with your actual ID generation logic if needed
      content,
      username,
      creationDate: new Date().toISOString(),
      isAnswer: false,
      replies: [], // Assuming this is required for the structure
    };

    try {
      const response = await fetch(`/api/threads/${threadId}/comments/${parentCommentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, username, parentCommentId }),
      });

      if (response.ok) {
        // Call the callback with both arguments only if the response is OK
        onReplyCreated(newReply, parentCommentId);
        setContent(''); // Clear the input field after submitting
      } else {
        const errorResponse = await response.json();
        console.error('Failed to post reply:', errorResponse);
      }
    } catch (error) {
      console.error('Failed to post reply:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        placeholder="Write a reply..."
      />
      <button type="submit">Reply</button>
    </form>
  );
};

export default ReplyForm;
