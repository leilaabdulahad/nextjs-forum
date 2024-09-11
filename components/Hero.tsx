import { LogIn } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'

const Hero = () => {
  const { isSignedIn } = useAuth()

  return (
    <div className="bg-black text-gray-900 py-16">
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Välkommen till Diskussionsforumet</h1>
          <p className="text-xl mb-8">Upptäck, diskutera och dela kunskap med vår växande gemenskap.</p>
          
          <div className="flex justify-center space-x-4 mb-8">
            {isSignedIn ? (
              <Link href='/create'>

              <button className="flex items-center bg-white text-black font-semibold py-2 px-4 rounded-lg  transition duration-300">
                Skapa ny tråd
              </button>
              </Link>
            ) : (
              <button className="flex items-center bg-white text-black font-semibold py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300">
                <LogIn className="mr-2" size={20} />
                Logga in för att skapa tråd
              </button>
            )}
          </div>
        </div>
      </div>
     </div>
  )
}

export default Hero