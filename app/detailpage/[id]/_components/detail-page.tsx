import { Thread, Comment } from '../../../../types'
import CreateComment from '@/components/CreateComment'

type DetailpageProps = {
  thread: Thread | null
  onCommentCreate: (comment: Comment) => void
  onThreadUpdate: (updatedThread: Thread) => void
};

const Detailpage: React.FC<DetailpageProps> = ({ thread, onCommentCreate, onThreadUpdate }) => {
  if (!thread) {
    return <p>Thread not found.</p>
  }

  const toggleLockThread = () => {
    const updatedThread = { ...thread, isLocked: !thread.isLocked };
    onThreadUpdate(updatedThread)
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
      <p>{thread.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Skapad av {thread.username} den {new Date(thread.creationDate).toLocaleDateString()}
      </p>

      {thread.username === 'YOUR_LOGGED_IN_USERNAME' && ( 
        <button onClick={toggleLockThread} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
          {thread.isLocked ? 'Unlock Thread' : 'Lock Thread'}
        </button>
      )}

      <CreateComment 
        threadId={thread.id} 
        onCommentCreate={onCommentCreate} 
        isLocked={thread.isLocked} 
      />

      <h2 className="text-xl font-semibold mt-8">Kommentarer</h2>
      {thread.comments.length === 0 ? (
        <p>Inga kommentarer ännu.</p>
      ) : (
        <ul>
          {thread.comments.map((comment) => (
            <li key={comment.id} className="border-b py-2">
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500">
                Skapad av {comment.username} den {new Date(comment.creationDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Detailpage
