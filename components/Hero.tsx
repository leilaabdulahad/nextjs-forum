import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { motion } from "framer-motion"

const Hero = () => {
  const { isSignedIn } = useAuth()

  return (
    <div className="bg-gradient-to-b  min-h-screen flex items-center justify-center py-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            Ditt Forum för Gemenskap
          </motion.h1>
          <motion.img 
            src="/hero1.png" 
            alt="Hero" 
            className="animate-bounce-smooth w-64 h-64 object-cover mx-auto mb-8 "
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          <motion.div 
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isSignedIn ? (
              <Link href='/create'>
                <button className="bg-hero-btns font-semibold py-3 px-6 rounded-lg transition duration-300 hover:bg-purple-100 hover:shadow-md">
                  Skapa ny tråd
                </button>
              </Link>
            ) : (
              <button className="bg-hero-btns flex items-center justify-center bg-transparent border-2 font-semibold py-3 px-6 rounded-lg hover:bg-white transition duration-300">
                <LogIn className="mr-2" size={20} />
                Logga in för att skapa tråd
              </button>
            )}
            <button className="bg-hero-btns font-semibold py-3 px-6 rounded-lg transition duration-300 hover:bg-purple-100 hover:shadow-md">
              Utforska forum
            </button>
          </motion.div>
          <motion.p 
            className="text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}>
            Anslut, dela och väx tillsammans i vår livliga gemenskap. Upptäck nya perspektiv och skapa meningsfulla kopplingar.
          </motion.p>
        </div>
      </div>
    </div>
  )
}

export default Hero