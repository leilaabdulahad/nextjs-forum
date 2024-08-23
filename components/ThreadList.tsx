import Link from 'next/link'
import React from 'react'
import { Thread } from '../types'

type ThreadListProps = {
  threads: Thread[]
}

const ThreadList: React.FC<ThreadListProps> = ({ threads }) => {
  if (threads.length === 0) {
    return <p>No threads available.</p>;
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <div key={thread.id} className="border p-4 rounded shadow-sm">
          <h2 className="text-xl font-bold">
            <Link href={`/detailpage/${thread.id}`}>
              {thread.title}
            </Link>
          </h2>
          <p>{thread.description}</p>
          <p className="text-sm text-gray-500">
            Created by {thread.username} on {new Date(thread.creationDate).toLocaleDateString()}
          </p>

          {thread.comments && thread.comments.length > 0 && (
            <div className="mt-4 border-t pt-2">
              <h3 className="font-semibold">Comments:</h3>
              {thread.comments.map((comment) => (
                <div key={comment.id} className="border-b py-2">
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
