'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { navLinks } from '@/constants/navLinks'

const Navbar = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-gray-800 tracking-tight hover:text-gray-600 transition duration-300">
            OnlineForum
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                href={link.path} 
                key={link.name}
                className="text-gray-600 hover:text-gray-800 transition duration-300"
              >
                {link.name}
              </Link>
            ))}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition duration-300">
                  Logga in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </SignedIn>
          </nav>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-600 focus:outline-none">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden bg-gray-50 py-4">
          <div className="container mx-auto px-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                href={link.path} 
                key={link.name} 
                className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded transition duration-300"
                onClick={toggleMobileMenu}
              >
                {link.name}
              </Link>
            ))}
            <div className="">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition duration-300">
                    Logga in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-2 px-4 ">
                  <span className="text-gray-600">Min profil</span>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar