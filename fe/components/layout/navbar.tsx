'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { api, clearToken } from '@/lib/api'

/** Shape returned by GET /auth/me */
interface Me {
  id: number
  name: string
  email: string
}

const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Brands',   href: '/brands' },
]

const Navbar: React.FC = () => {
  const router   = useRouter()
  const pathname = usePathname()

  const [user,      setUser]      = useState<Me | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [favCount,  setFavCount]  = useState(0)
  const [search,    setSearch]    = useState('')
  const [menuOpen,  setMenuOpen]  = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  // ── Fetch user + counts on mount ──────────────────────────────────────────
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) return

    api.auth.me()
      .then(data => setUser(data as Me))
      .catch(() => { clearToken(); setUser(null) })

    api.cart.get()
      .then((cart: unknown) => {
        const c = cart as { items?: unknown[] }
        setCartCount(c?.items?.length ?? 0)
      })
      .catch(() => {})

    api.favourites.get()
      .then((favs: unknown[]) => setFavCount(favs.length))
      .catch(() => {})
  }, [pathname])   // re-run after route changes so counts stay fresh

  // ── Close user dropdown on outside click ─────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleLogout() {
    clearToken()
    setUser(null)
    setCartCount(0)
    setFavCount(0)
    router.push('/')
    router.refresh()
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <nav className="bg-white shadow-md py-2 px-4 flex items-center justify-between sticky top-0 z-40">

      {/* LEFT – LOGO */}
      <Link href="/" className="flex items-center shrink-0">
        <Image src="/logo.svg" alt="SNK Shop logo" width={60} height={15} className="object-contain" />
      </Link>

      {/* CENTER – MENU */}
      <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-6 text-sm font-medium">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className={`transition-colors duration-150 ${
                pathname === href
                  ? 'text-blue-600 font-semibold'
                  : 'hover:text-blue-500 text-gray-700'
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* RIGHT – SEARCH + ICONS + AUTH */}
      <div className="flex items-center space-x-4 md:space-x-5">

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1 w-56 focus-within:ring-2 focus-within:ring-blue-400 transition"
        >
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search shoes..."
            className="bg-transparent outline-none px-2 text-sm w-full"
          />
        </form>

        {/* CART */}
        <Link
          href="/cart"
          className="relative cursor-pointer hover:text-blue-500 transition-colors duration-200"
          aria-label="Cart"
        >
          <ShoppingCartIcon className="h-6 w-6 text-gray-800" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* FAVOURITES */}
        <Link
          href="/favourites"
          className="relative cursor-pointer hover:text-red-500 transition-colors duration-200"
          aria-label="Favourites"
        >
          <HeartIcon className="h-6 w-6 text-gray-800" />
          {favCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {favCount}
            </span>
          )}
        </Link>

        {/* AUTH */}
        {!user ? (
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <Link
              href="/login"
              className="px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-3 py-1 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
            >
              Register
            </Link>
          </div>
        ) : (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center space-x-2 cursor-pointer hover:text-blue-500 transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                <UserIcon className="h-5 w-5 text-gray-700" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-800 leading-none">
                {user.name}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 bg-white shadow-lg rounded-xl w-40 py-1 border border-gray-100">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  My Orders
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar