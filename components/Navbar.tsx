'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FaBars, FaTimes } from 'react-icons/fa'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { navLinks } from '@/constants/navLinks'

const Navbar = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 font-semibold">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-colors duration-300"
          >
            OnlineForum
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                href={link.path}
                key={link.name}
                className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-700 hover:text-gray-900 transition-colors duration-300">
                  Logga in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </SignedIn>
          </nav>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden bg-gray-100 py-4">
          <div className="container mx-auto px-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                href={link.path}
                key={link.name}
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition-colors duration-300"
                onClick={toggleMobileMenu}
              >
                {link.name}
              </Link>
            ))}
            <div>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="block w-full py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition-colors duration-300 text-left">
                    Logga in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-2 px-4">
                  <span className="text-gray-700">Min profil</span>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-8 h-8',
                      },
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
