'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import BookTrailer from '@/components/book-trailer'
import TestimonialsSection from '@/components/testimonials-section'
import Footer from '@/components/footer'
import { BookOpen, Star, Sparkles, CheckCircle2 } from 'lucide-react'

export default function BookPage() {
  const specs = [
    { label: 'Title', value: "JUST ELVIS JUSTICE" },
    { label: 'Author', value: 'Dr. Elvis Justice Bedi' },
    { label: 'Genre', value: 'Personal Development / Mindset Strategy' },
    { label: 'Formats Available', value: 'eBook (PDF, EPUB), Audiobook, Print (Hardcover, Paperback)' },
    { label: 'Print Price', value: '$19.99 (Paperback) / $29.99 (Hardcover)' },
    { label: 'Digital Price', value: '$9.99 (eBook) / $14.99 (Audiobook)' },
    { label: 'Release Date', value: 'July 21, 2026' },
  ]

  return (
    <main className="bg-background text-foreground min-h-screen">

      {/* Main Book Info Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left Column: Cover Image & Formats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-start space-y-8"
          >
            {/* Custom Luxury 3D Floating Book Mockup container */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotateY: [-5, 5, -5],
                rotateX: [8, 12, 8]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-56 h-80 sm:w-64 sm:h-96 md:w-72 md:h-[430px] rounded-r-xl overflow-hidden shadow-[25px_30px_55px_-10px_rgba(43,34,26,0.35)] border-y border-r border-[#ffffff]/30 bg-white group"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {/* Premium Book Spine simulation edge highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-r from-black/20 via-transparent to-white/10 z-20 pointer-events-none" />
              <Image
                src="/book.jpeg"
                alt="JUST ELVIS JUSTICE Cover"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* Format Options Display */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {['eBook', 'Audiobook', 'Print'].map((fmt) => (
                <div key={fmt} className="text-center p-3 rounded-lg border border-border bg-card">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#b08d57] mb-1">{fmt}</p>
                  <p className="text-sm font-bold text-foreground">Available</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Title, Subtitle, Just, Specs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#eaddcd] text-foreground text-xs font-semibold rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#b08d57]" /> Bestselling Mindset Development
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight leading-[1.05] uppercase text-[#2b221a]">
                JUST ELVIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2b221a] via-[#bda06d] to-[#2b221a]">JUSTICE</span>
              </h1>
              <p className="text-xl md:text-2xl font-serif italic text-[#b08d57]">
                A transformative journey of mindset, strategy, and excellence.
              </p>
            </div>

            <div className="space-y-4 text-[#7d7265] leading-relaxed text-base md:text-lg">
              <p>
                *JUST ELVIS JUSTICE* is an extraordinary manual of personal development, mindset optimization, and structural leadership. Through practical execution models, readers are invited to dismantle self-limiting mindsets and unlock their true performance potential.
              </p>
              <p>
                Dr. Elvis Justice Bedi weaves a captivating blueprint that blends strategy, habit design, and elite performance. Designed to inspire immediate action long after the final page is read.
              </p>
            </div>

            {/* Book Specifications */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-lg font-serif font-bold">Book Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {specs.map((spec) => (
                  <div key={spec.label} className="border-b border-border/50 pb-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">{spec.label}</span>
                    <span className="text-foreground font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy / CTA Button */}
            <div className="pt-6">
              <Link href="/store" className="inline-block px-8 py-3.5 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105">
                Buy the Book Now
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Book Trailer video player */}
      <BookTrailer />

      {/* Reviews/Endorsements Section */}
      <TestimonialsSection />

      <Footer />
    </main>
  )
}
