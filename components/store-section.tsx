'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Sparkles, Check, ArrowRight, Eye } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { getStoredProducts, Product } from '@/lib/data-store'

export default function StoreSection() {
  const { addToCart, itemCount, setShowCart } = useCart()
  const [productsList, setProductsList] = useState<Product[]>([])

  useEffect(() => {
    setProductsList(getStoredProducts())
  }, [])

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
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section id="store" className="pt-8 sm:pt-10 md:pt-12 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 bg-[#f8f5ef]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Store Header */}
        <div className="pb-6 border-b border-[rgba(80,60,40,0.10)]">
          <div className="space-y-2 max-w-2xl">
            <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
              The Bookstore
            </span>
            <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
              Official Editions &amp; Publications
            </h2>
            <p className="body-text text-sm sm:text-base text-[#77716a]">
              Select your preferred edition. Click on any title to view full chapter breakdown, specifications, and instant digital delivery details.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {productsList.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              variants={itemVariants}
              className="editorial-card group overflow-hidden flex flex-col justify-between hover:border-[#c79a68]/50"
            >
              <div>
                {/* Book Cover Showcase */}
                <Link href={`/store/${product.id}`} className="block">
                  <div className="relative h-72 sm:h-80 bg-[#f1ece3]/50 p-6 flex items-center justify-center overflow-hidden border-b border-[rgba(80,60,40,0.06)] cursor-pointer">
                    
                    {/* Category Pill */}
                    {product.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-[#2a211c] text-[#f8f5ef] text-[9px] font-bold rounded-full uppercase tracking-widest font-sans">
                          {product.category}
                        </span>
                      </div>
                    )}

                    {/* 3D Book Presentation Container */}
                    <div className="relative w-40 h-56 sm:w-44 sm:h-64 rounded-r-md overflow-hidden shadow-[18px_20px_35px_-8px_rgba(42,33,28,0.25)] border-y border-r border-[#ffffff]/50 bg-white group-hover:scale-104 group-hover:-translate-y-1 transition-all duration-500">
                      <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-r from-black/25 via-transparent to-white/10 z-20 pointer-events-none" />
                      <Image
                        src={product.image || '/book.jpeg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Format tag badge */}
                    <div className="absolute bottom-3 right-4">
                      <span className="text-[10px] uppercase font-semibold text-[#c79a68] tracking-wider font-sans bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[rgba(80,60,40,0.08)]">
                        {product.type === 'digital' ? 'Instant Digital' : 'Collector Print'}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Info Container */}
                <div className="p-6 space-y-3">
                  <Link href={`/store/${product.id}`} className="block group-hover:text-[#c79a68] transition-colors">
                    <h3 className="font-serif text-xl font-bold text-[#1d1b18] leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="body-text text-xs text-[#77716a] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Bottom Price & Button Bar */}
              <div className="p-6 pt-0 border-t border-[rgba(80,60,40,0.06)] mt-2 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#77716a] font-semibold block font-sans">Price</span>
                  <p className="font-serif text-2xl font-bold text-[#1d1b18]">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/store/${product.id}`}
                    className="editorial-btn-secondary py-2 px-3 text-xs font-semibold"
                    title="View Book Details"
                  >
                    Details
                  </Link>

                  <button
                    onClick={() => addToCart(product)}
                    className="editorial-btn-primary py-2 px-4 text-xs font-semibold cursor-pointer"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Guarantee Banner */}
        <div className="p-6 rounded-2xl bg-[#f1ece3]/70 border border-[rgba(80,60,40,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#c79a68] shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-[#1d1b18] text-sm">Secure Global Dispatch &amp; Instant Fulfillment</p>
              <p className="text-xs text-[#77716a]">All transactions are encrypted with 256-bit SSL technology. Free global delivery options available.</p>
            </div>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="editorial-btn-secondary py-2 px-5 text-xs whitespace-nowrap"
          >
            Checkout ({itemCount})
          </button>
        </div>

      </div>
    </section>
  )
}
