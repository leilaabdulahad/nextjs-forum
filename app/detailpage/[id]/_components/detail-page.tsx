import { Thread, Comment } from '../../../../types'
import CreateComment from '../../../../components/CreateComment' 

type DetailpageProps = {
  thread: Thread | null
  onCommentCreate: (comment: Comment) => void
}

const Detailpage: React.FC<DetailpageProps> = ({ thread, onCommentCreate }) => {
  if (!thread) {
    return <p>Thread not found.</p>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
      <p>{thread.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Skapad {new Date(thread.creationDate).toLocaleDateString()}
      </p>

      {/* Create Comment Component */}
      <CreateComment threadId={thread.id} onCommentCreate={onCommentCreate} />

      {/* Comments List */}
      <h2 className="text-xl font-semibold mt-8">Kommentarer</h2>
      {thread.comments.length === 0 ? (
        <p>Inga kommentarer ännu.</p>
      ) : (
        <ul>
          {thread.comments.map((comment) => (
            <li key={comment.id} className="border-b py-2">
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500">
                Skapad {new Date(comment.creationDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Detailpage
