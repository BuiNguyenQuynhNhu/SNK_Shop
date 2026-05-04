'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingCartIcon, UserIcon, HeartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { api, clearToken } from '@/lib/api'

/** Shape returned by GET /auth/me */
interface Me {
  id: number
  name: string
  email: string
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<Me | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [favCount, setFavCount] = useState(0)

  // Fetch current user on mount (only if a token exists)
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) return

    api.auth.me()
      .then(data => setUser(data as Me))
      .catch(() => {
        clearToken()
        setUser(null)
      })

    // Fetch cart count
    api.cart.get()
      .then((cart: unknown) => {
        const c = cart as { items?: unknown[] }
        setCartCount(c?.items?.length ?? 0)
      })
      .catch(() => {})

    // Fetch favourites count
    api.favourites.get()
      .then((favs: unknown[]) => setFavCount(favs.length))
      .catch(() => {})
  }, [])

  function handleLogout() {
    clearToken()
    setUser(null)
    setCartCount(0)
    setFavCount(0)
  }

  return (
    <nav className="bg-white shadow-md py-2 px-4 flex items-center justify-between">

      {/* LEFT - LOGO */}
      <div className="flex items-center">
        <Image src="/logo.svg" alt="SNK Shop logo" width={60} height={15} className="object-contain" />
      </div>

      {/* CENTER - MENU */}
      <div className="flex-1 flex items-center justify-center space-x-6">
        <ul className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6 text-sm font-medium">
          <li className="hover:text-blue-500 cursor-pointer">Home</li>
          <li className="hover:text-blue-500 cursor-pointer">Products</li>
          <li className="hover:text-blue-500 cursor-pointer">Brands</li>
          <li className="hover:text-blue-500 cursor-pointer">About</li>
        </ul>
      </div>

      {/* RIGHT - SEARCH + ICONS + AUTH */}
      <div className="flex items-center space-x-4 md:space-x-5">

        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1 w-64 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search shoes..."
            className="bg-transparent outline-none px-2 text-sm w-full"
          />
        </div>

        {/* CART */}
        <div className="relative cursor-pointer hover:text-blue-500 transition-colors duration-200">
          <ShoppingCartIcon className="h-6 w-6 text-gray-800" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        {/* HEART */}
        <div className="relative cursor-pointer hover:text-red-500 transition-colors duration-200">
          <HeartIcon className="h-6 w-6 text-gray-800" />
          {favCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {favCount}
            </span>
          )}
        </div>

        {/* AUTH */}
        {!user ? (
          <div className="hidden md:flex space-x-2 text-sm">
            <button className="hover:text-blue-500">Login</button>
            <span>/</span>
            <button className="hover:text-blue-500">Register</button>
          </div>
        ) : (
          <div className="relative group">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-500 transition-colors duration-200">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                <UserIcon className="h-5 w-5 text-gray-700" />
              </div>
              {/* user.name is typed from the /auth/me response */}
              <span className="text-sm font-medium text-gray-800 leading-none">{user.name}</span>
            </div>

            <div className="absolute right-0 top-10 hidden group-hover:block bg-white shadow-md rounded-md w-32 z-50">
              <div
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 text-sm text-red-500 cursor-pointer"
              >
                Logout
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar