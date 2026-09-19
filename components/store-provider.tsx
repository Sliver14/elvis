'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { CheckCircle2, X, ShoppingBag } from 'lucide-react'
import { Book, BookLaunch, DEFAULT_BOOKS, DEFAULT_LAUNCH } from '@/lib/types'
import { CartDrawer } from './cart-drawer'

interface StoreContextType {
  cart: { book: Book; quantity: number }[]
  addToCart: (book: Book) => void
  updateQuantity: (id: string, quantity: number) => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  cartCount: number
  booksList: Book[]
  setBooksList: React.Dispatch<React.SetStateAction<Book[]>>
  activeLaunch: BookLaunch
  setActiveLaunch: React.Dispatch<React.SetStateAction<BookLaunch>>
  refreshBooks: () => Promise<void>
  refreshLaunch: () => Promise<void>
  orderSuccessRef: string
  setOrderSuccessRef: (ref: string) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{ book: Book; quantity: number }[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [booksList, setBooksList] = useState<Book[]>(DEFAULT_BOOKS)
  const [activeLaunch, setActiveLaunch] = useState<BookLaunch>(DEFAULT_LAUNCH)
  const [orderSuccessRef, setOrderSuccessRef] = useState('')

  const refreshBooks = async () => {
    try {
      const res = await fetch('/api/books')
      const data = await res.json()
      if (data.success && Array.isArray(data.books)) {
        setBooksList(data.books)
      }
    } catch {
      // Keep existing list
    }
  }

  const refreshLaunch = async () => {
    try {
      const res = await fetch('/api/launch/active')
      const data = await res.json()
      if (data.success && data.launch) {
        setActiveLaunch(data.launch)
      }
    } catch {
      // Keep existing launch
    }
  }

  useEffect(() => {
    refreshBooks()
    refreshLaunch()

    // Initialize database in background
    fetch('/api/init').catch(() => {})

    // Check payment return params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref') || params.get('reference')
      if (params.get('payment_success') || params.get('paystack_mock_success')) {
        if (ref) {
          setOrderSuccessRef(ref)
          setCart([])
        }
      }
    }

    // Global image protection
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.closest(
            'img, .book-cover, .hero-banner-frame, .author-photo-frame, .card-cover-wrap, .author-launch-photo-frame, .author-bio-photo-frame, .author-detail-photo-frame, .table-book-thumb, .active-launch-thumb'
          ))
      ) {
        e.preventDefault()
        return false
      }
    }

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.closest(
            'img, .book-cover, .hero-banner-frame, .author-photo-frame, .card-cover-wrap, .author-launch-photo-frame, .author-bio-photo-frame, .author-detail-photo-frame, .table-book-thumb, .active-launch-thumb'
          ))
      ) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('contextmenu', handleContextMenu, { capture: true })
    document.addEventListener('dragstart', handleDragStart, { capture: true })

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      document.removeEventListener('dragstart', handleDragStart, { capture: true })
    }
  }, [])

  const addToCart = (book: Book) => {
    setCart((current) => {
      const existing = current.find((item) => item.book.id === book.id)
      return existing
        ? current.map((item) =>
            item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...current, { book, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((current) =>
      quantity < 1
        ? current.filter((item) => item.book.id !== id)
        : current.map((item) => (item.book.id === id ? { ...item, quantity } : item))
    )
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        cartOpen,
        setCartOpen,
        cartCount,
        booksList,
        setBooksList,
        activeLaunch,
        setActiveLaunch,
        refreshBooks,
        refreshLaunch,
        orderSuccessRef,
        setOrderSuccessRef,
      }}
    >
      {orderSuccessRef && (
        <div className="payment-success-banner">
          <div className="section-shell success-inner">
            <CheckCircle2 />
            <div>
              <strong>Payment Successful! Order #{orderSuccessRef}</strong>
              <p>Your digital books and download links have been delivered to your email address via Resend.</p>
            </div>
            <button className="icon-button" onClick={() => setOrderSuccessRef('')}>
              <X />
            </button>
          </div>
        </div>
      )}

      {children}

      <div className="cart-trigger">
        <button
          className="icon-button bag-button"
          onClick={() => setCartOpen(true)}
          aria-label={`Shopping bag, ${cartCount} items`}
        >
          <ShoppingBag />
          <span>{cartCount}</span>
        </button>
      </div>

      <CartDrawer
        items={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={(id) => updateQuantity(id, 0)}
        onChange={updateQuantity}
      />
    </StoreContext.Provider>
  )
}
