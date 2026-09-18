'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CartDrawer() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    showCart,
    setShowCart,
  } = useCart()

  // Checkout state: 'cart' | 'info' | 'payment'
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'info' | 'payment'>('cart')
  const [billingName, setBillingName] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [shippingZip, setShippingZip] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  // Determine if cart has physical items requiring shipping details
  const hasPhysicalItems = cart.some(item => 
    item.id.includes('paperback') || item.id.includes('hardcover')
  )

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutStep('payment')
  }

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault()
    
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
    const newOrder = {
      orderId,
      customerName: billingName,
      customerEmail: billingEmail,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: total,
      date: new Date().toLocaleDateString(),
      status: hasPhysicalItems ? 'Processing' : 'Completed',
    }

    // Save order in localStorage for Admin dashboard
    const currentOrders = JSON.parse(localStorage.getItem('aurora_orders') || '[]')
    localStorage.setItem('aurora_orders', JSON.stringify([newOrder, ...currentOrders]))

    // Reset and redirect
    clearCart()
    setCheckoutStep('cart')
    setShowCart(false)
    window.location.href = `/order-confirmation?orderId=${orderId}`
  }

  return (
    <AnimatePresence>
      {showCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1d1b18]/50 backdrop-blur-xs z-50 flex justify-end"
          onClick={() => setShowCart(false)}
        >
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#f8f5ef] w-full max-w-md shadow-2xl overflow-y-auto flex flex-col h-full border-l border-[rgba(80,60,40,0.12)]"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[rgba(80,60,40,0.08)] flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-3">
                {checkoutStep !== 'cart' && (
                  <button
                    onClick={() => {
                      if (checkoutStep === 'payment') setCheckoutStep('info')
                      else if (checkoutStep === 'info') setCheckoutStep('cart')
                    }}
                    className="p-1.5 hover:bg-[#f1ece3] rounded-lg transition-colors cursor-pointer text-[#1d1b18]"
                    aria-label="Go Back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <span className="editorial-script text-lg text-[#c79a68] block leading-none">
                    {checkoutStep === 'cart' && 'Selected Titles'}
                    {checkoutStep === 'info' && 'Delivery Info'}
                    {checkoutStep === 'payment' && 'Secure Checkout'}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#1d1b18]">
                    {checkoutStep === 'cart' && 'Your Shopping Bag'}
                    {checkoutStep === 'info' && 'Customer Information'}
                    {checkoutStep === 'payment' && 'Payment Details'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="w-8 h-8 rounded-full bg-[#f1ece3] text-[#77716a] hover:text-[#1d1b18] flex items-center justify-center text-sm cursor-pointer transition-colors"
                aria-label="Close Bag"
              >
                ✕
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 flex-grow overflow-y-auto">
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-[#f1ece3] text-[#c79a68] flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-serif text-lg font-bold text-[#1d1b18]">Your bag is empty</p>
                        <p className="text-xs text-[#77716a]">Explore the bookstore to select your edition.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex gap-4 p-4 border border-[rgba(80,60,40,0.08)] rounded-2xl bg-white shadow-xs"
                        >
                          <div className="relative w-16 h-20 shrink-0 rounded-md bg-[#f1ece3] overflow-hidden border border-[rgba(80,60,40,0.08)]">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="font-serif font-bold text-[#1d1b18] text-sm leading-snug line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-xs font-semibold text-[#c79a68] mt-0.5">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-[rgba(80,60,40,0.15)] rounded-full bg-[#f8f5ef]">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-[#f1ece3] rounded-full transition-colors cursor-pointer text-[#1d1b18]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-sans font-bold text-[#1d1b18]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-[#f1ece3] rounded-full transition-colors cursor-pointer text-[#1d1b18]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-auto p-1.5 text-[#77716a] hover:text-[#a8422b] rounded-md transition-colors cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'info' && (
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      placeholder="e.g. Elvis Justice Reader"
                      className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                      Email Address (For instant digital receipts &amp; downloads)
                    </label>
                    <input
                      type="email"
                      required
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  {hasPhysicalItems ? (
                    <div className="space-y-4 pt-4 border-t border-[rgba(80,60,40,0.08)] mt-4">
                      <p className="text-xs font-bold text-[#c79a68] uppercase tracking-wider">
                        Shipping Address (Print Edition Dispatch)
                      </p>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                          Street Address
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="124 Fifth Avenue, Suite 400"
                          className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingCity}
                            onChange={(e) => setShippingCity(e.target.value)}
                            placeholder="New York"
                            className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            placeholder="10001"
                            className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#f1ece3]/70 border border-[rgba(80,60,40,0.08)] rounded-xl text-xs text-[#77716a] leading-relaxed">
                      <strong>Instant Fulfillment:</strong> Your items are digital files (eBook / Audiobook). Download links will be generated immediately after payment.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="editorial-btn-dark w-full py-3 text-xs font-semibold mt-4"
                  >
                    Proceed to Payment (${total.toFixed(2)})
                  </button>
                </form>
              )}

              {checkoutStep === 'payment' && (
                <form onSubmit={handleCompletePayment} className="space-y-6">
                  
                  {/* Payment Tabs */}
                  <div className="grid grid-cols-2 gap-2 border-b border-[rgba(80,60,40,0.08)] pb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'stripe'
                          ? 'bg-[#2a211c] text-[#f8f5ef]'
                          : 'border border-[rgba(80,60,40,0.15)] bg-white text-[#1d1b18]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" /> Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'paypal'
                          ? 'bg-[#003087] text-white font-bold italic'
                          : 'border border-[rgba(80,60,40,0.15)] bg-white text-[#1d1b18]'
                      }`}
                    >
                      PayPal
                    </button>
                  </div>

                  {paymentMethod === 'stripe' ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                          className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18] font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18] font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                            CVC Code
                          </label>
                          <input
                            type="text"
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border border-[#003087]/20 rounded-2xl bg-[#003087]/5 text-center space-y-3">
                      <span className="text-lg font-bold text-[#003087] italic block">PayPal Express Checkout</span>
                      <p className="text-xs text-[#77716a]">
                        One-click authorization via your linked PayPal account or balance.
                      </p>
                    </div>
                  )}

                  {/* Final Payment Button */}
                  <button
                    type="submit"
                    className="editorial-btn-primary w-full py-3.5 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <CreditCard className="w-4 h-4" /> Authorize &amp; Pay ${total.toFixed(2)}
                  </button>
                </form>
              )}
            </div>

            {/* Drawer Footer Summary */}
            {cart.length > 0 && checkoutStep === 'cart' && (
              <div className="p-6 border-t border-[rgba(80,60,40,0.08)] bg-white space-y-4 shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#77716a]">Subtotal:</span>
                  <span className="font-serif text-2xl font-bold text-[#1d1b18]">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setCheckoutStep('info')}
                  className="editorial-btn-primary w-full py-3.5 text-xs font-semibold tracking-wider text-center block cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
