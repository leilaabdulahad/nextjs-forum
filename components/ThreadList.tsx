import Link from 'next/link'
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { checkInappropriateWords } from '@/utils/utils'
import { useState, useEffect } from 'react'

type ThreadListProps = {
  threads: Thread[]
  onToggleLock: (threadId: string) => void
}

const ThreadList = ({ threads, onToggleLock }: ThreadListProps): JSX.Element => {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (threads.length > 0) {
      setIsLoading(false);
    }
  }, [threads])

  if (isLoading) {
    return (
      <div className="flex flex-row gap-2 justify-center items-center mt-20">
      <div className="w-4 h-4 rounded-full bg-black animate-bounce" style={{animationDelay: '.7s'}}></div>
      <div className="w-4 h-4 rounded-full bg-black animate-bounce" style={{animationDelay: '.3s'}}></div>
      <div className="w-4 h-4 rounded-full bg-black animate-bounce" style={{animationDelay: '.7s'}}></div>
    </div>
    )
  }

  if (threads.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No threads available.</p>
  }

  return (
    <div className="space-y-6">
      {threads.map((thread) => {
        const censoredDescription: string = checkInappropriateWords(thread.description as string)
        const censoredTitle: string = checkInappropriateWords(thread.title as string)
        return (
          <div key={thread._id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <Link href={`/detailpage/${thread._id}`}>
                <h2 className="text-2xl font-semibold text-gray-800 transition-colors duration-300 cursor-pointer">{censoredTitle}</h2>
              </Link>
              <p className="mt-2 text-gray-600">{censoredDescription}</p>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{thread.username}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(thread.creationDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                {(user?.username === thread.username || user?.publicMetadata?.isModerator === 'true') && (
                  <button
                    onClick={() => onToggleLock(thread._id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                      thread.isLocked 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {thread.isLocked ? 'Lås upp' : 'Lås tråden'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ThreadList