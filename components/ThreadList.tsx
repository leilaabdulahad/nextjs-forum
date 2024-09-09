import Link from 'next/link'
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { checkInappropriateWords } from '@/utils/utils'

type ThreadListProps = {
  threads: Thread[]
  onToggleLock: (threadId: string) => void;
}

const ThreadList = ({ threads, onToggleLock }: ThreadListProps): JSX.Element => {
  const { user } = useUser()

  if (threads.length === 0) {
    return <p>No threads available.</p>
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => {
        const [censoredTitle, titleIsCensored] = checkInappropriateWords(thread.title)
        const [censoredDescription, descriptionIsCensored] = checkInappropriateWords(thread.description)
        thread.isCensored = titleIsCensored || descriptionIsCensored;
        return (
          <div key={thread._id} className="border p-4 rounded shadow-sm">
            <Link href={`/detailpage/${thread._id}`}>
              <h2 className="text-xl font-bold cursor-pointer">
                {censoredTitle}
              </h2>
            </Link>
            <p>{censoredDescription}</p>
            <p className="text-sm text-gray-500 mt-2">
              {thread.username} 
            </p>  
            <p className="text-sm text-gray-500 mb-4">
              {new Date(thread.creationDate).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
            </p>
            {user?.username === thread.username && (
              <button
                onClick={() => onToggleLock(thread._id)}
                className={`mt-2 px-4 py-2 rounded ${thread.isLocked ? 'bg-red-600' : 'bg-green-600'} text-white`}
              >
                {thread.isLocked ? 'Unlock Thread' : 'Lock Thread'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ThreadList