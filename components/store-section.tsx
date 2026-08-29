'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, CreditCard, Heart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { getStoredProducts, Product } from '@/lib/data-store'

export default function StoreSection() {
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
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

  const [productsList, setProductsList] = useState<Product[]>([])

  useEffect(() => {
    setProductsList(getStoredProducts())
  }, [])

  // Determine if cart has physical items requiring shipping details
  const hasPhysicalItems = cart.some(item => {
    const matchedProduct = productsList.find(p => p.id === item.id)
    return matchedProduct?.type === 'physical'
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

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
    <section id="store" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-16"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
              Official Bookstore
            </h2>
            <p className="text-lg text-muted-foreground">
              Select your preferred formats. Print editions include free digital copies!
            </p>
          </div>

          {/* Cart Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCheckoutStep('cart')
              setShowCart(!showCart)
            }}
            className="relative p-3 rounded-lg border border-border hover:border-accent transition-all group cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {productsList.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="relative bg-card border border-border rounded-lg overflow-hidden transition-all hover:border-accent flex flex-col h-full">
                {/* Badge */}
                {product.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative h-64 bg-muted overflow-hidden shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4 flex flex-col justify-between flex-grow">
                  <div className="space-y-2">
                    <h3 className="text-base font-serif font-bold text-foreground line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-xl font-bold text-[#b08d57]">${product.price}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      className="px-3 py-1.5 bg-accent text-accent-foreground rounded-md font-medium text-xs hover:shadow-lg transition-all cursor-pointer"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>


      </div>
    </section>
  )
}
