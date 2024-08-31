import Link from 'next/link'
import React from 'react'
import { Thread } from '../types'
import { useUser } from '@clerk/nextjs'

type ThreadListProps = {
  threads: Thread[]
  onToggleLock: (threadId: string) => void;
};

const ThreadList: React.FC<ThreadListProps> = ({ threads, onToggleLock }) => {
  const { user } = useUser()

  if (threads.length === 0) {
    return <p>No threads available.</p>
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <div key={thread._id} className="border p-4 rounded shadow-sm">
          <Link href={`/detailpage/${thread._id}`}>
            <h2 className="text-xl font-bold cursor-pointer">
              {thread.title}
            </h2>
          </Link>
          <p>{thread.description}</p>
          <p className="text-sm text-gray-500">
            Created by {thread.username} on {new Date(thread.creationDate).toLocaleDateString()}
          </p>

          {user?.username === thread.username && (
            <button
              onClick={() => onToggleLock(thread._id)}
              className={`mt-2 px-4 py-2 rounded ${thread.isLocked ? 'bg-red-600' : 'bg-green-600'} text-white`}>
              {thread.isLocked ? 'Unlock Thread' : 'Lock Thread'}
            </button>
          )}

          {thread.comments && thread.comments.length > 0 && (
            <div className="mt-4 border-t pt-2">
              <h3 className="font-semibold">Comments:</h3>
              {thread.comments.map((comment, index) => (
                <div key={index} className="border-b py-2">
                  <p>{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    Commented by {comment.username} on {new Date(comment.creationDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ThreadList
