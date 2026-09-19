'use client'

import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react'
import { Book } from '@/lib/types'
import { Cover } from './book-cover'

export function CartDrawer({
  items,
  isOpen,
  onClose,
  onRemove,
  onChange,
}: {
  items: { book: Book; quantity: number }[]
  isOpen: boolean
  onClose: () => void
  onRemove: (id: string) => void
  onChange: (id: string, quantity: number) => void
}) {
  const [checkingOut, setCheckingOut] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const total = items.reduce((sum, item) => {
    const p = Number(item.book.price.replace(/[^0-9.]/g, '')) || 0
    return sum + p * item.quantity
  }, 0)

  useEffect(() => {
    if (!isOpen) {
      setCheckingOut(false)
      setCheckoutError('')
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerEmail) return
    setLoading(true)
    setCheckoutError('')

    try {
      const res = await fetch('/api/checkout/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          name: customerName,
          items: items.map((i) => ({
            id: i.book.id,
            title: i.book.title,
            author: i.book.author,
            price: i.book.price,
            pdf_url: i.book.pdf_url || '',
            quantity: i.quantity,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment initiation failed')
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url
      }
    } catch (err: any) {
      console.error(err)
      setCheckoutError(err.message || 'Payment service is connecting...')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="cart-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="cart-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="cart-header">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2>Shopping bag</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close shopping bag">
            <X />
          </button>
        </div>

        {items.length ? (
          <>
            <div className="cart-items">
              {items.map(({ book, quantity }) => (
                <div className="cart-item" key={book.id}>
                  <Cover book={book} />
                  <div>
                    <h3>{book.title}</h3>
                    <p>{book.price}</p>
                    <div className="quantity-control">
                      <button
                        onClick={() => onChange(book.id, quantity - 1)}
                        aria-label={`Decrease ${book.title} quantity`}
                      >
                        <Minus />
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => onChange(book.id, quantity + 1)}
                        aria-label={`Increase ${book.title} quantity`}
                      >
                        <Plus />
                      </button>
                    </div>
                  </div>
                  <button
                    className="icon-button"
                    onClick={() => onRemove(book.id)}
                    aria-label={`Remove ${book.title}`}
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>

            {checkingOut ? (
              <form className="cart-checkout-form" onSubmit={handlePaystackCheckout}>
                <p className="checkout-title">
                  <CreditCard /> Complete with Paystack
                </p>
                <label>
                  Your Email (for book delivery)
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Full Name (optional)
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>
                {checkoutError && <p className="checkout-error">{checkoutError}</p>}
                <div className="cart-footer">
                  <div>
                    <span>Total Amount</span>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                  <button className="button button-dark" type="submit" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <>Pay with Paystack <ArrowRight /></>}
                  </button>
                  <button type="button" className="text-button" onClick={() => setCheckingOut(false)}>
                    <ArrowLeft /> Back to bag
                  </button>
                </div>
              </form>
            ) : (
              <div className="cart-footer">
                <div>
                  <span>Total</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>
                <button className="button button-dark" onClick={() => setCheckingOut(true)}>
                  Proceed to Checkout <ArrowRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="cart-empty">
            <ShoppingBag />
            <p>Your bag is waiting for a good story.</p>
          </div>
        )}
      </div>
    </>
  )
}
