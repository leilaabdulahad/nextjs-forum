import React from 'react';
import { Search, LogIn } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

const Hero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Välkommen till Diskussionsforumet</h1>
          <p className="text-xl mb-8">Upptäck, diskutera och dela kunskap med vår växande gemenskap.</p>
          
          <div className="flex justify-center space-x-4 mb-8">
            {isSignedIn ? (
              <button className="flex items-center bg-green-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 transition duration-300">
                Skapa ny tråd
              </button>
            ) : (
              <button className="flex items-center bg-white text-blue-600 font-semibold py-2 px-4 rounded-full hover:bg-blue-100 transition duration-300">
                <LogIn className="mr-2" size={20} />
                Logga in för att skapa tråd
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;