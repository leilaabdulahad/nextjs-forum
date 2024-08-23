import { Thread } from '../../../../types'

type DetailpageProps = {
  thread: Thread | null
}

const Detailpage: React.FC<DetailpageProps> = ({ thread }) => {
  if (!thread) {
    return <p>Thread not found.</p>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Skapad {new Date(thread.creationDate).toLocaleDateString()}
      </p>
      <p>{thread.description}</p>
    </div>
  )
}

export default Detailpage