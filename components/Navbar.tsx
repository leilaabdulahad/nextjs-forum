'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FaSearch, FaBars } from 'react-icons/fa'
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
    <header className="bg-gray-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        
        <div className="flex items-center">
          <Link href="/">
            <div className="text-2xl font-bold">OnlineForum</div>
          </Link>
        </div>

    <nav className="hidden md:flex space-x-8 font-sans font-bold">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      {navLinks.map((link) => (
        <Link href={link.path} key={link.name}>
          <div className="flex items-center space-x-1">
            <div>{link.name}</div>
            {link.isSearch && <FaSearch className="text-gray-400" size={14} />}
          </div>
        </Link>
      ))}
    </nav>

        <div className="md:hidden flex items-center">
          <FaBars className="text-2xl cursor-pointer" onClick={toggleMobileMenu} />
        </div>
      </div>
      
        {isMobileMenuOpen && (
          <nav className="md:hidden text-center p-4 space-y-2 text-white rounded-lg shadow-lg font-sans font-bold">
          <SignedOut>
            <SignInButton>Logga in</SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {navLinks.map((link) => (
            <Link href={link.path} key={link.name}>
              <div onClick={toggleMobileMenu} className="p-2 hover:bg-gray-700 rounded">
                {link.name}
                {link.isSearch && <FaSearch className="text-gray-400" size={14} />}
              </div>
            </Link>
          ))}
        </nav>
        )}
        </header>
        )
      }

export default Navbar
