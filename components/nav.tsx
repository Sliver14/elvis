'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useStore } from './store-provider'

export function Nav() {
  const pathname = usePathname()
  const { cartCount, setCartOpen } = useStore()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  // Don't render customer nav on admin page if desired, or let it render
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0
    let ticking = false

    const updateHeader = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)

      if (open) {
        setVisible(true)
      } else if (currentScrollY <= 84) {
        setVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 84) {
        setVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setVisible(true)
      }
      lastScrollY = Math.max(0, currentScrollY)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  if (isAdmin) return null

  const getActiveTab = () => {
    if (pathname === '/') return 'home'
    if (pathname?.startsWith('/books')) return 'books'
    if (pathname === '/launch') return 'launch'
    if (pathname === '/about') return 'about'
    if (pathname === '/contact') return 'contact'
    return ''
  }

  const activeTab = getActiveTab()

  const navItems = [
    { href: '/', id: 'home', label: 'Home' },
    { href: '/books', id: 'books', label: 'Books' },
    { href: '/launch', id: 'launch', label: 'Book launch' },
    { href: '/about', id: 'about', label: 'About' },
    { href: '/contact', id: 'contact', label: 'Contact' },
  ]

  const headerClass = `site-header ${visible ? 'is-visible' : 'is-hidden'} ${
    scrolled ? 'is-scrolled' : ''
  }`

  return (
    <header className={headerClass}>
      <div className="header-inner">
        <Link href="/" className="wordmark" onClick={() => setOpen(false)} aria-label="Go home">
          <span className="wordmark-mark">S</span>
          <span>SERENDIPITY / <em>ELVIS</em></span>
        </Link>

        <nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={activeTab === item.id ? 'is-active' : ''}
              aria-current={activeTab === item.id ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/books" className="icon-button" aria-label="Search">
            <Search />
          </Link>
          <button
            className="icon-button bag-button"
            onClick={() => setCartOpen(true)}
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <ShoppingBag />
            <span>{cartCount}</span>
          </button>
          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  )
}
