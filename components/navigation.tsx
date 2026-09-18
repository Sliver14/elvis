'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingBag, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Author', href: '/author' },
  { name: 'Store', href: '/store' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { itemCount, setShowCart } = useCart()
  const { user, setIsAuthModalOpen, setIsProfileModalOpen } = useAuth()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-[#f8f5ef]/90 backdrop-blur-md border-b border-[rgba(80,60,40,0.08)] py-3 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          {/* Logo stamp */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center gap-3 text-foreground group">
              <span className="w-8 h-8 rounded-full bg-[#2a211c] text-[#f8f5ef] flex items-center justify-center font-serif font-bold text-xs tracking-wider shadow-sm transition-transform group-hover:scale-105">
                EJ
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#1d1b18] leading-none">
                  Dr. Elvis Justice
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#c79a68] font-sans font-semibold mt-0.5">
                  Official Book Launch &amp; Store
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Capsule Navigation */}
          <div className="hidden md:flex items-center bg-[#f1ece3] rounded-full p-1 border border-[rgba(80,60,40,0.08)] shadow-[0_2px_8px_rgba(50,35,20,0.03)]">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === '/store' && pathname.startsWith('/store/')) || (item.href === '/event' && pathname.startsWith('/event/'))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[11px] tracking-wider uppercase px-4 py-1.5 rounded-full font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2a211c] text-[#f8f5ef] shadow-sm'
                      : 'text-[#77716a] hover:text-[#1d1b18] hover:bg-black/5'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Right Status Capsule */}
          <div className="hidden md:flex items-center gap-2 bg-[#f1ece3] rounded-full p-1 border border-[rgba(80,60,40,0.08)] shadow-[0_2px_8px_rgba(50,35,20,0.03)] px-3">
            {/* Cart icon */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-1.5 rounded-full hover:bg-black/5 text-[#77716a] hover:text-[#1d1b18] transition-colors cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c79a68] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Splitter Line */}
            <div className="w-px h-4 bg-[rgba(80,60,40,0.12)] mx-1" />

            {/* User Profile widget or Sign In button */}
            {user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 hover:opacity-85 transition-opacity pl-0.5 cursor-pointer"
                title="User Profile & Account"
              >
                <div className="w-6 h-6 rounded-full bg-[#2a211c] text-[#c79a68] flex items-center justify-center font-serif font-bold text-[10px] border border-[#c79a68]/40">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left pr-1">
                  <p className="text-[10px] font-bold text-[#1d1b18] leading-none font-sans truncate max-w-[85px]">
                    {user.name.split(' ')[0]}
                  </p>
                  <p className="text-[8px] uppercase tracking-wider text-[#c79a68] font-sans font-semibold mt-0.5">
                    {user.role === 'author' || user.role === 'admin' ? 'Author' : 'Profile'}
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#1d1b18] hover:text-[#c79a68] transition-colors cursor-pointer font-sans"
                title="Sign In to Reader Profile"
              >
                <User className="w-3.5 h-3.5 text-[#c79a68]" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 rounded-full text-[#1d1b18] hover:bg-[#f1ece3] transition-colors cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#c79a68] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-[#1d1b18] hover:bg-[#f1ece3] transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 space-y-1.5 border-t border-[rgba(80,60,40,0.08)] mt-3 pt-3"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href === '/store' && pathname.startsWith('/store/')) || (item.href === '/event' && pathname.startsWith('/event/'))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2.5 text-xs uppercase tracking-wider rounded-xl font-medium transition-colors ${
                      isActive ? 'bg-[#2a211c] text-[#f8f5ef]' : 'text-[#77716a] hover:bg-[#f1ece3] hover:text-[#1d1b18]'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setShowCart(true)
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[rgba(80,60,40,0.15)] rounded-xl text-[#1d1b18] w-1/2 text-xs font-medium hover:bg-[#f1ece3] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#c79a68]" />
                  Cart ({itemCount})
                </button>
                <Link
                  href="/store"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-[#c79a68] text-white rounded-xl font-medium text-xs text-center flex items-center justify-center cursor-pointer shadow-sm"
                >
                  Bookstore
                </Link>
              </div>

              {/* Mobile Account / Sign In Trigger */}
              <div className="border-t border-[rgba(80,60,40,0.08)] pt-3 mt-3 px-2">
                {user ? (
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setIsProfileModalOpen(true)
                    }}
                    className="flex items-center gap-3 hover:opacity-85 transition-opacity w-full text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2a211c] text-[#c79a68] flex items-center justify-center font-serif font-bold text-xs border border-[#c79a68]/40">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#1d1b18] leading-none">{user.name}</p>
                      <p className="text-[10px] text-[#c79a68] leading-none mt-1 font-semibold uppercase tracking-wider">
                        {user.role === 'author' || user.role === 'admin' ? 'Author Profile' : 'User Profile'}
                      </p>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setIsAuthModalOpen(true)
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2a211c] text-[#f8f5ef] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    <User className="w-4 h-4 text-[#c79a68]" />
                    <span>Sign In / Reader Profile</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
