'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  Tv, 
  Check, 
  Compass, 
  Target, 
  Feather,
  Filter
} from 'lucide-react'
import { getStoredLaunches, BookLaunch } from '@/lib/data-store'
import TestimonialsSection from '@/components/testimonials-section'
import FAQSection from '@/components/faq-section'
import Footer from '@/components/footer'

export default function BooksDirectoryPage() {
  const [launches, setLaunches] = useState<BookLaunch[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed' | 'store'>('all')

  useEffect(() => {
    setLaunches(getStoredLaunches())
  }, [])

  const filteredLaunches = launches.filter((l) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'upcoming') return l.status === 'upcoming' || l.status === 'live'
    if (activeFilter === 'completed') return l.status === 'completed'
    if (activeFilter === 'store') return l.inStore === true
    return true
  })

  const featuredLaunch = launches.find(l => l.isFeatured) || launches[0]

  return (
    <main className="bg-[#f8f5ef] text-[#1d1b18] min-h-screen selection:bg-[#f1ece3]">
      
      {/* Header Banner */}
      <section className="pt-16 pb-12 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
            The Literary Archive
          </span>
          <h1 className="editorial-display text-4xl sm:text-5xl md:text-6xl text-[#1d1b18]">
            Books &amp; Launch Premieres
          </h1>
          <p className="body-text text-base sm:text-lg text-[#77716a] max-w-2xl mx-auto">
            Explore dedicated volumes and upcoming virtual launch premieres by Dr. Elvis Justice Bedi. Each launch features an exclusive virtual mainstage event, keynote readings, and limited edition releases.
          </p>
        </motion.div>
      </section>

      {/* Featured Book Launch Banner (Hero Spotlight) */}
      {featuredLaunch && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-12 rounded-3xl bg-[#2a211c] text-[#f8f5ef] relative overflow-hidden shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#c79a68]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="editorial-script text-xl sm:text-2xl text-[#c79a68]">
                    Featured Premiere
                  </span>
                  <span className="h-px w-8 bg-[#c79a68]/40" />
                  <span className="text-xs text-[#f8f5ef]/70 font-sans">
                    ★ Global Broadcast &bull; {featuredLaunch.launchDateFormatted}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                    {featuredLaunch.title}
                  </h2>
                  <p className="font-serif italic text-lg sm:text-xl text-[#c79a68]">
                    &ldquo;{featuredLaunch.subtitle}&rdquo;
                  </p>
                </div>

                <p className="body-text text-[#f8f5ef]/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {featuredLaunch.synopsis[0]}
                </p>

                <div className="flex flex-wrap gap-4 pt-2 items-center">
                  <Link
                    href={`/book/${featuredLaunch.slug}`}
                    className="editorial-btn-primary group"
                  >
                    <span>Enter Dedicated Launch Room</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/event"
                    className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs font-semibold font-sans transition-colors inline-flex items-center gap-2"
                  >
                    <Tv className="w-4 h-4 text-[#c79a68]" /> Reserve Free Mainstage Seat
                  </Link>
                </div>
              </div>

              {/* Right Column: 3D Book Presentation */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-48 h-72 sm:w-56 sm:h-80 rounded-r-xl overflow-hidden shadow-[20px_25px_50px_rgba(0,0,0,0.5)] border-y border-r border-white/20 bg-white group">
                  <Image
                    src={featuredLaunch.coverImage || '/book.jpeg'}
                    alt={featuredLaunch.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

            </div>
          </motion.div>
        </section>
      )}

      {/* Directory Filter Bar */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[rgba(80,60,40,0.10)]">
          <div>
            <span className="eyebrow">Catalog Directory</span>
            <h3 className="editorial-heading text-2xl font-bold text-[#1d1b18]">
              All Publications &amp; Launches ({filteredLaunches.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#f1ece3] p-1.5 rounded-full border border-[rgba(80,60,40,0.08)]">
            {[
              { id: 'all', label: 'All Launches' },
              { id: 'upcoming', label: 'Upcoming Premieres' },
              { id: 'completed', label: 'Replays & Past' },
              { id: 'store', label: 'In Bookstore' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-sans uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#2a211c] text-white shadow-sm'
                    : 'text-[#77716a] hover:text-[#1d1b18]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Launches Catalog Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLaunches.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="editorial-card group overflow-hidden flex flex-col justify-between hover:border-[#c79a68]/50"
            >
              <div>
                {/* Book Cover Banner */}
                <div className="relative h-64 bg-[#f1ece3]/60 p-6 flex items-center justify-center border-b border-[rgba(80,60,40,0.06)]">
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest font-sans ${
                      item.status === 'upcoming'
                        ? 'bg-[#c79a68] text-white'
                        : item.status === 'live'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-[#2a211c] text-[#f8f5ef]'
                    }`}>
                      {item.status === 'upcoming' 
                        ? 'Upcoming Launch' 
                        : item.status === 'live' 
                        ? 'Live Premiere' 
                        : 'Recorded Replay'}
                    </span>
                  </div>

                  {item.inStore && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-2.5 py-1 bg-white/90 text-[#1d1b18] text-[9px] font-bold uppercase tracking-wider rounded-md border border-[rgba(80,60,40,0.1)] font-sans flex items-center gap-1 shadow-2xs">
                        <ShoppingBag className="w-3 h-3 text-[#c79a68]" /> In Bookstore
                      </span>
                    </div>
                  )}

                  {/* 3D Book Preview */}
                  <div className="relative w-36 h-52 rounded-r-md overflow-hidden shadow-[15px_18px_30px_-6px_rgba(42,33,28,0.25)] border border-white/60 bg-white group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500">
                    <Image
                      src={item.coverImage || '/book.jpeg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#77716a] font-semibold font-sans">
                    <span className="text-[#c79a68]">{item.genre}</span>
                    <span>{item.pagesCount} Pages</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1d1b18] group-hover:text-[#c79a68] transition-colors leading-tight">
                    {item.title}
                  </h3>

                  <p className="body-text text-xs text-[#77716a] line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>

                  {/* Formats Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.formats.map((fmt) => (
                      <span 
                        key={fmt.name} 
                        className="text-[9px] font-sans px-2 py-0.5 rounded bg-[#f1ece3] text-[#1d1b18]/80 font-medium"
                      >
                        {fmt.name.split('(')[0]} (${fmt.price})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-[rgba(80,60,40,0.06)] mt-4 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-[#77716a] block font-sans">Launch Date</span>
                  <p className="font-serif font-bold text-xs text-[#1d1b18]">
                    {item.launchDateFormatted}
                  </p>
                </div>

                <Link
                  href={`/book/${item.slug}`}
                  className="editorial-btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Launch Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      {/* Literary Pillars / Why Our Book Launches Are Unique */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f1ece3]/40 border-t border-[rgba(80,60,40,0.08)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
              The Author&apos;s Standard
            </span>
            <h2 className="editorial-heading text-3xl sm:text-4xl text-[#1d1b18]">
              Why Every Book Launch Matters
            </h2>
            <p className="body-text text-sm sm:text-base text-[#77716a]">
              Each publication represents years of synthesized venture leadership, clinical habit calibration, and sovereign execution models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="editorial-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f1ece3] text-[#c79a68] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#1d1b18]">Architectural Mindset</h4>
              <p className="body-text text-xs leading-relaxed text-[#77716a]">
                Every book is engineered not merely to inform, but to construct permanent cognitive operating loops that enhance daily performance and endurance.
              </p>
            </div>

            <div className="editorial-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f1ece3] text-[#c79a68] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#1d1b18]">Global Virtual Mainstages</h4>
              <p className="body-text text-xs leading-relaxed text-[#77716a]">
                Our book launches unite thousands of ambitious leaders worldwide through interactive live streams, panel discussions, and direct audience dialogues.
              </p>
            </div>

            <div className="editorial-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f1ece3] text-[#c79a68] flex items-center justify-center">
                <Feather className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#1d1b18]">Collector Grade Quality</h4>
              <p className="body-text text-xs leading-relaxed text-[#77716a]">
                From gold-foiled hardcovers to masterclass audiobook recordings, all editions are produced to an uncompromising international luxury standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials and FAQ */}
      <TestimonialsSection />
      <FAQSection />

      <Footer />
    </main>
  )
}
