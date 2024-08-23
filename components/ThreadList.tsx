import Link from 'next/link'
import { Thread } from '../types'

type ThreadListProps = {
  threads: Thread[]
}

const ThreadList: React.FC<ThreadListProps> = ({ threads }) => {
  if (threads.length === 0) {
    return <p>No threads available.</p>
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <div key={thread.id} className="border p-4 rounded shadow-sm">
          <h2 className="text-xl font-bold">
            <Link key={thread.id} href={`/detailpage/${thread.id}`}>
           
              {thread.title}
            </Link>
          </h2>
          <p>{thread.description}</p>
          <p className="text-sm text-gray-500">
            Created on {new Date(thread.creationDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ThreadList
