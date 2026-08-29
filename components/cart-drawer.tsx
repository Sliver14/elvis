'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react'
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
          className="fixed inset-0 bg-black/40 z-50 flex justify-end"
          onClick={() => setShowCart(false)}
        >
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fbf9f6] w-full max-w-md shadow-2xl overflow-y-auto flex flex-col h-full border-l border-border"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-card shrink-0">
              <div className="flex items-center gap-2">
                {checkoutStep !== 'cart' && (
                  <button
                    onClick={() => {
                      if (checkoutStep === 'payment') setCheckoutStep('info')
                      else if (checkoutStep === 'info') setCheckoutStep('cart')
                    }}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-foreground" />
                  </button>
                )}
                <h3 className="text-lg font-serif font-bold text-foreground">
                  {checkoutStep === 'cart' && 'Shopping Cart'}
                  {checkoutStep === 'info' && 'Customer Information'}
                  {checkoutStep === 'payment' && 'Simulated Payment'}
                </h3>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="text-[#2b221a]/60 hover:text-foreground text-lg cursor-pointer"
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
                      <ShoppingCart className="w-12 h-12 text-[#bda06d]/30 mx-auto" />
                      <p className="text-muted-foreground text-sm">Your shopping cart is empty.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex gap-4 p-4 border border-border rounded-lg bg-card"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 rounded bg-muted overflow-hidden border border-border/50">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-semibold text-foreground text-sm leading-snug line-clamp-1">{item.name}</h4>
                            <p className="text-accent font-bold text-sm mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-muted border border-border rounded transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-mono">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-muted border border-border rounded transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-auto p-1 text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
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
                    <label className="text-xs font-semibold text-muted-foreground uppercase block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      placeholder="Elvis Reader"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="elvis@reader.com"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>

                  {hasPhysicalItems ? (
                    <div className="space-y-4 pt-4 border-t border-border mt-4">
                      <p className="text-xs font-bold text-accent uppercase tracking-wider">Shipping Address (Required for print books)</p>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase block">Street Address</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="123 Book Lover St."
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase block">City</label>
                          <input
                            type="text"
                            required
                            value={shippingCity}
                            onChange={(e) => setShippingCity(e.target.value)}
                            placeholder="New York"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase block">ZIP Code</label>
                          <input
                            type="text"
                            required
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            placeholder="10001"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-card border border-border rounded-lg text-xs text-muted-foreground leading-relaxed">
                      <strong>Note:</strong> All items in your cart are digital. Secure download links will be delivered instantly to your email delivery address.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#2b221a] hover:bg-[#bda06d] text-white rounded-lg text-sm font-semibold transition-all mt-6 cursor-pointer"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {checkoutStep === 'payment' && (
                <form onSubmit={handleCompletePayment} className="space-y-6">
                  
                  {/* Payment Tabs */}
                  <div className="grid grid-cols-2 gap-2 border-b border-border pb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`py-2 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'stripe'
                          ? 'bg-[#2b221a] border-[#2b221a] text-white'
                          : 'border-border hover:bg-muted text-foreground bg-card'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" /> Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`py-2 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'paypal'
                          ? 'bg-[#003087] border-[#003087] text-white font-bold italic'
                          : 'border-border hover:bg-muted text-foreground bg-card'
                      }`}
                    >
                      PayPal
                    </button>
                  </div>

                  {paymentMethod === 'stripe' ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase block">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase block">Expiry Date</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase block">CVC</label>
                          <input
                            type="text"
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border border-[#003087]/20 rounded-xl bg-[#003087]/5 text-center space-y-4">
                      <span className="text-xl font-bold text-[#003087] italic block">PayPal Express</span>
                      <p className="text-xs text-muted-foreground">
                        Secure express checkout with PayPal account balance or linked credit lines.
                      </p>
                    </div>
                  )}

                  {/* Final Payment Trigger */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#2b221a] hover:bg-[#bda06d] text-white rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" /> Pay ${total.toFixed(2)}
                  </button>
                </form>
              )}
            </div>

            {/* Drawer Footer Summary */}
            {cart.length > 0 && checkoutStep === 'cart' && (
              <div className="p-6 border-t border-border bg-card space-y-4 shrink-0">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Price:</span>
                  <span className="text-[#2b221a] font-mono">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setCheckoutStep('info')}
                  className="w-full py-3 bg-[#2b221a] text-white hover:bg-[#bda06d] rounded-lg font-semibold transition-all text-center block text-sm cursor-pointer"
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
