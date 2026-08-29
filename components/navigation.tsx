'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About the Book', href: '/book' },
  { name: 'Author', href: '/author' },
  { name: 'Event', href: '/event' },
  { name: 'Store', href: '/store' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { itemCount, setShowCart } = useCart()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 py-3"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          {/* Logo stamp */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center gap-2 text-lg font-serif font-bold text-foreground">
              <span className="w-8 h-8 rounded-lg bg-[#7d6342] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                EB
              </span>
              <span className="tracking-wide">Elvis Bedi</span>
            </Link>
          </motion.div>

          {/* Desktop Capsule Navigation */}
          <div className="hidden md:flex items-center bg-[#eae0d0] rounded-full p-1 border border-border/40 shadow-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[10px] tracking-wider uppercase px-4 py-1.5 rounded-full font-semibold transition-all duration-300 ${isActive
                      ? 'bg-[#2b221a] text-white shadow-sm'
                      : 'text-[#7d6a57] hover:text-[#2b221a]'
                    }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Right Status Capsule */}
          <div className="hidden md:flex items-center gap-2 bg-[#eae0d0] rounded-full p-1 border border-border/40 shadow-sm px-3">
            {/* Cart bell-style icon */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-1.5 rounded-full hover:bg-white/20 text-[#7d6a57] hover:text-[#2b221a] transition-colors cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2b221a] text-white text-[8px] font-bold flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Splitter Line */}
            <div className="w-px h-5 bg-[#2b221a]/15 mx-1" />

            {/* Author Profile widget link */}
            <Link href="/admin" className="flex items-center gap-2 hover:opacity-85 transition-opacity pl-0.5">
              <div className="w-6.5 h-6.5 rounded-full bg-[#2b221a] text-white flex items-center justify-center font-bold text-[10px]">
                E
              </div>
              <div className="text-left pr-1">
                <p className="text-[9px] font-bold text-[#2b221a] leading-none">Dr. Elvis</p>
                {/* <p className="text-[7px] text-[#7d6a57] leading-none mt-0.5">Author Account</p> */}
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-foreground hover:bg-muted transition-colors cursor-pointer"
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
              className="md:hidden pb-4 space-y-2 border-t border-border/40 mt-3 pt-3"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${isActive ? 'bg-[#f3ebd9] text-[#7d6342]' : 'text-foreground hover:bg-muted'
                      }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowCart(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground w-1/2 text-xs font-semibold hover:bg-muted cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-accent" />
                  Cart ({itemCount})
                </button>
                <Link
                  href="/store"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold text-xs text-center flex items-center justify-center cursor-pointer"
                >
                  Buy Book
                </Link>
              </div>

              {/* Mobile Author Account Link */}
              <div className="border-t border-[#2b221a]/10 pt-3 mt-3 px-2">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 hover:opacity-85 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2b221a] text-white flex items-center justify-center font-bold text-xs">
                    E
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#2b221a] leading-none">Dr. Elvis</p>
                    <p className="text-[10px] text-[#7d6a57] leading-none mt-1">Author Account</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
