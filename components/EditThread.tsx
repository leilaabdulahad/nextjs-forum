import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Save, X } from 'lucide-react'

type EditThreadProps = {
  thread: Thread
  userUsername: string | undefined
  onUpdateThread: (updatedThread: Thread) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

const isUser = (user: unknown): user is { publicMetadata?: { isModerator?: boolean }; username?: string } => {
  return (
    typeof user === 'object' &&
    user !== null &&
    'publicMetadata' in user &&
    typeof (user as { publicMetadata?: { isModerator?: boolean } }).publicMetadata === 'object' &&
    'username' in user
  )
}

function EditThread({
  thread,
  userUsername,
  onUpdateThread,
  isEditing,
  setIsEditing,
}: EditThreadProps): JSX.Element {
  const { user } = useUser()
  const [title, setTitle] = useState(thread.title)
  const [description, setDescription] = useState(thread.description)

  const canEdit = thread.username === userUsername || (isUser(user) && user.publicMetadata?.isModerator)

  const handleSave = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const updatedData = { userId: user.id, updates: { title, description } };
    console.log('Updating thread with ID:', thread._id);
    console.log('Updated data:', updatedData);



    try {
      const response = await fetch(`/api/threads/${thread._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, updates: { title, description } }), // Use user.id safely
      });
      
      if (!response.ok) {
        throw new Error('Failed to update thread');
      }
      
      const updatedThreadFromServer = await response.json();
      onUpdateThread(updatedThreadFromServer);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating thread:', error);
    }
  }

  

  if (!canEdit || !isEditing) {
    return <></>; // Return an empty fragment instead of null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskrivning"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        />
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            Spara
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            <X className="w-4 h-4 mr-2" />
            Avbryt
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditThread