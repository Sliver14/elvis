'use client'

import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  Download, 
  Clock, 
  BookOpen, 
  Plus, 
  Minus,
  CheckCircle2,
  Tv,
  ArrowRight
} from 'lucide-react'
import { getStoredProducts, Product, getStoredLaunches } from '@/lib/data-store'
import { useCart } from '@/lib/cart-context'
import TestimonialsSection from '@/components/testimonials-section'
import Footer from '@/components/footer'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function StoreProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const productId = resolvedParams.id

  const [product, setProduct] = useState<Product | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [addedNotice, setAddedNotice] = useState(false)
  const { addToCart, setShowCart } = useCart()

  useEffect(() => {
    const products = getStoredProducts()
    setAllProducts(products)
    const found = products.find(p => p.id === productId) || products[0]
    setProduct(found)
  }, [productId])

  if (!product) {
    return (
      <main className="bg-[#f8f5ef] text-[#1d1b18] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c79a68] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 3000)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setShowCart(true)
  }

  // Find other formats of the same book
  const otherFormats = allProducts.filter(p => p.book === product.book && p.id !== product.id)
  
  // Recommended other titles
  const relatedTitles = allProducts.filter(p => p.book !== product.book)

  const isDigital = product.type === 'digital' || product.name.toLowerCase().includes('ebook') || product.name.toLowerCase().includes('audio')

  return (
    <main className="bg-[#f8f5ef] text-[#1d1b18] min-h-screen selection:bg-[#f1ece3]">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-[#f1ece3]/70 border-b border-[rgba(80,60,40,0.08)] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#77716a]">
            <Link href="/store" className="hover:text-[#1d1b18] transition-colors font-sans flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Bookstore
            </Link>
            <span>/</span>
            <span className="text-[#77716a]">{product.book}</span>
            <span>/</span>
            <span className="font-serif font-bold text-[#1d1b18] truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>

          <Link href="/store" className="text-[10px] font-semibold text-[#c79a68] uppercase tracking-wider hover:underline font-sans hidden sm:block">
            ← Browse All Bookstore Titles
          </Link>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <section className="pt-10 pb-16 md:pt-14 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: 3D Floating Book Showcase (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col items-center justify-start space-y-6"
          >
            {/* Book Presentation Container */}
            <div className="relative p-8 sm:p-12 rounded-3xl bg-[#f1ece3]/60 border border-[rgba(80,60,40,0.08)] w-full flex flex-col items-center justify-center">
              
              {/* Category Pill */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-[#2a211c] text-[#f8f5ef] text-[9px] font-bold rounded-full uppercase tracking-widest font-sans">
                  {product.category || 'Official Release'}
                </span>
              </div>

              {/* Format Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2.5 py-1 bg-white/90 text-[#c79a68] text-[9px] font-bold uppercase tracking-wider rounded-md border border-[rgba(80,60,40,0.1)] font-sans shadow-2xs">
                  {isDigital ? 'Instant Digital Download' : 'Deluxe Print Edition'}
                </span>
              </div>

              {/* 3D Floating Book */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotateY: [-2, 2, -2],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-52 h-76 sm:w-64 sm:h-92 rounded-r-xl overflow-hidden shadow-[25px_30px_50px_-8px_rgba(42,33,28,0.3)] border-y border-r border-white/50 bg-white my-4"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-gradient-to-r from-black/25 via-transparent to-white/10 z-20 pointer-events-none" />
                <Image
                  src={product.image || '/book.jpeg'}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>

              <div className="w-48 sm:w-56 h-4 bg-[#2a211c]/10 rounded-full blur-sm mx-auto mt-2" />
            </div>

            {/* Guarantee / Security strip */}
            <div className="grid grid-cols-2 gap-3 w-full text-left">
              <div className="p-3.5 rounded-xl bg-white border border-[rgba(80,60,40,0.08)] flex items-start gap-2.5 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[#c79a68] shrink-0 mt-0.5" />
                <div>
                  <p className="font-serif font-bold text-xs text-[#1d1b18]">SSL Encrypted</p>
                  <p className="text-[10px] text-[#77716a] font-sans">256-bit secure checkout</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[rgba(80,60,40,0.08)] flex items-start gap-2.5 shadow-2xs">
                {isDigital ? (
                  <Download className="w-5 h-5 text-[#c79a68] shrink-0 mt-0.5" />
                ) : (
                  <Truck className="w-5 h-5 text-[#c79a68] shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-serif font-bold text-xs text-[#1d1b18]">
                    {isDigital ? 'Instant Fulfillment' : 'Global Dispatch'}
                  </p>
                  <p className="text-[10px] text-[#77716a] font-sans">
                    {isDigital ? 'Direct EPUB/PDF/MP3' : 'Tracked courier delivery'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Title, Pricing, Quantity & Add to Cart (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
                  Official Edition
                </span>
                <span className="text-xs text-[#77716a]">&bull;</span>
                <span className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">
                  Dr. Elvis Justice Bedi
                </span>
              </div>

              <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
                {product.name}
              </h1>

              {/* Star review badge */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1d1b18] font-sans">4.9 / 5.0</span>
                <span className="text-xs text-[#77716a] font-sans">&bull; (2,400+ Verified Readers)</span>
              </div>
            </div>

            {/* Price block */}
            <div className="p-5 rounded-2xl bg-[#f1ece3]/50 border border-[rgba(80,60,40,0.08)] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#77716a] font-semibold block font-sans">Bookstore Price</span>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#1d1b18]">
                  ${product.price.toFixed(2)} <span className="text-xs text-[#77716a] font-normal font-sans">USD</span>
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-sans border border-green-200">
                  <Check className="w-3.5 h-3.5" /> In Stock &amp; Ready
                </span>
                <p className="text-[10px] text-[#77716a] mt-1 font-sans">
                  {isDigital ? 'Instant download link after payment' : 'Ships within 1-2 business days'}
                </p>
              </div>
            </div>

            {/* Other Available Formats for this title */}
            {otherFormats.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans block">
                  Other Available Formats for this Title:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {otherFormats.map((fmt, index) => (
                    <Link
                      key={`${fmt.id}-${index}`}
                      href={`/store/${fmt.id}`}
                      className="p-3 rounded-xl border border-[rgba(80,60,40,0.12)] bg-white hover:border-[#c79a68] transition-all text-left shadow-2xs group"
                    >
                      <p className="text-[10px] text-[#c79a68] font-bold uppercase tracking-wider font-sans">{fmt.type}</p>
                      <p className="text-xs font-serif font-bold text-[#1d1b18] group-hover:text-[#c79a68] line-clamp-1">{fmt.name.replace(fmt.book, '').trim() || fmt.name}</p>
                      <p className="text-xs font-mono font-bold text-[#1d1b18] mt-1">${fmt.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3 pt-2">
              <span className="eyebrow">Edition Overview</span>
              <p className="body-text text-[#77716a] text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>
              <p className="body-text text-[#77716a] text-sm sm:text-base leading-relaxed">
                Authored by Dr. Elvis Justice Bedi, this volume provides structured mental frameworks, habit calibration models, and sovereign execution strategies to break internal constraints and lead with uncompromised clarity.
              </p>
            </div>

            {/* Quantity Selector & Purchase Actions */}
            <div className="pt-4 space-y-4 border-t border-[rgba(80,60,40,0.10)]">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#77716a] font-sans block">Quantity</span>
                  <div className="flex items-center border border-[rgba(80,60,40,0.15)] bg-white rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 hover:bg-[#f8f5ef] text-[#1d1b18] transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-mono font-bold text-[#1d1b18]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 hover:bg-[#f8f5ef] text-[#1d1b18] transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row gap-3 pt-4 sm:pt-0 items-end">
                  <button
                    onClick={handleAddToCart}
                    className="editorial-btn-secondary flex-1 py-3 text-xs font-semibold cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#c79a68]" /> Add to Bag (${(product.price * quantity).toFixed(2)})
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="editorial-btn-primary flex-1 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    Instant Checkout
                  </button>
                </div>
              </div>

              {addedNotice && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs font-semibold flex items-center justify-between font-sans"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Added {quantity} item(s) to your shopping bag!
                  </span>
                  <button onClick={() => setShowCart(true)} className="underline font-bold hover:opacity-80 cursor-pointer">
                    View Bag
                  </button>
                </motion.div>
              )}
            </div>

            {/* Included in this edition details */}
            <div className="p-5 rounded-2xl bg-white border border-[rgba(80,60,40,0.08)] space-y-3 shadow-2xs mt-6">
              <span className="text-[10px] uppercase font-bold text-[#c79a68] tracking-widest font-sans">
                What&apos;s Included with this Order:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#1d1b18]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#c79a68] shrink-0" />
                  <span>{isDigital ? 'High-Res PDF & EPUB Downloads' : 'Deluxe Print Edition with Gold Foil'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#c79a68] shrink-0" />
                  <span>Complimentary Author Launch Reading Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#c79a68] shrink-0" />
                  <span>Interactive Workbook &amp; Habit Templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#c79a68] shrink-0" />
                  <span>30-Day Unconditional Satisfaction Guarantee</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Recommended Titles Carousel / Grid */}
      {relatedTitles.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[rgba(80,60,40,0.10)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <span className="editorial-script text-2xl text-[#c79a68]">Complete Your Library</span>
              <h3 className="editorial-heading text-2xl sm:text-3xl text-[#1d1b18]">
                More Titles by Dr. Elvis
              </h3>
            </div>
            <Link href="/store" className="editorial-btn-secondary py-2 px-5 text-xs">
              View All Bookstore Titles
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTitles.slice(0, 3).map((rel, index) => (
              <div key={`${rel.id}-${index}`} className="editorial-card p-6 flex flex-col justify-between space-y-4 hover:border-[#c79a68]/40">
                <div className="flex gap-4 items-start">
                  <div className="relative w-16 h-24 rounded overflow-hidden bg-white shadow-md shrink-0 border border-[rgba(80,60,40,0.1)]">
                    <Image src={rel.image} alt={rel.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#c79a68] font-sans">{rel.category}</span>
                    <h4 className="font-serif font-bold text-base text-[#1d1b18] leading-tight">{rel.name}</h4>
                    <p className="text-[11px] text-[#77716a] line-clamp-2">{rel.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[rgba(80,60,40,0.06)]">
                  <span className="font-serif font-bold text-base text-[#1d1b18]">${rel.price.toFixed(2)}</span>
                  <Link href={`/store/${rel.id}`} className="editorial-btn-primary py-1.5 px-3.5 text-xs font-semibold">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <TestimonialsSection />

      <Footer />
    </main>
  )
}
