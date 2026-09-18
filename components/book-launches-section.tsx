'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingBag, 
  Star, 
  Layers,
  Check,
  Compass,
  Download
} from 'lucide-react'
import { 
  getStoredLaunches, 
  defaultBookLaunches, 
  BookLaunch, 
  saveRSVP 
} from '@/lib/data-store'

export default function BookLaunchesSection() {
  const [launches, setLaunches] = useState<BookLaunch[]>(defaultBookLaunches)
  const [selectedLaunch, setSelectedLaunch] = useState<BookLaunch>(defaultBookLaunches[0])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpEmail, setRsvpEmail] = useState('')
  const [isRsvpSuccess, setIsRsvpSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const stored = getStoredLaunches()
    setLaunches(stored)
    const initial = stored.find(l => l.isFeatured) || stored[0] || defaultBookLaunches[0]
    setSelectedLaunch(initial)
  }, [])

  // Live countdown timer for the selected launch
  useEffect(() => {
    const targetDate = new Date(selectedLaunch.launchDate || '2026-07-21T18:00:00')

    const updateCountdown = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0 || selectedLaunch.status === 'completed') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [selectedLaunch])

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpName || !rsvpEmail) return
    saveRSVP(selectedLaunch, rsvpName, rsvpEmail)
    setIsRsvpSuccess(true)
  }

  const isUpcoming = selectedLaunch.status === 'upcoming' && new Date(selectedLaunch.launchDate).getTime() > Date.now()

  return (
    <section id="launches" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#f1ece3]/40 border-y border-[rgba(80,60,40,0.08)] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#c79a68]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-white/60 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
            Literary Catalog &amp; Premieres
          </span>
          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
            New Books &amp; Upcoming Launches
          </h2>
          <p className="body-text text-sm sm:text-base text-[#77716a] max-w-2xl mx-auto leading-relaxed">
            Explore newly authored volumes, high-performance blueprints, and official virtual launch premieres by Dr. Elvis Justice Bedi.
          </p>
        </div>

        {/* Interactive Launch Selector Capsule Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center p-1.5 bg-[#f1ece3] rounded-full border border-[rgba(80,60,40,0.12)] shadow-xs gap-1.5 max-w-full">
            {launches.map((launch) => {
              const isSelected = launch.id === selectedLaunch.id
              return (
                <button
                  key={launch.id}
                  onClick={() => {
                    setSelectedLaunch(launch)
                    setIsRsvpSuccess(false)
                  }}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#2a211c] text-[#f8f5ef] shadow-md'
                      : 'text-[#77716a] hover:text-[#1d1b18] hover:bg-white/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    launch.status === 'upcoming' 
                      ? 'bg-[#c79a68]' 
                      : launch.status === 'live' 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-emerald-600'
                  }`} />
                  <span className="truncate max-w-[160px] sm:max-w-[200px]">{launch.title}</span>
                  {launch.isFeatured && (
                    <span className="text-[9px] uppercase tracking-widest bg-[#c79a68]/20 text-[#c79a68] px-1.5 py-0.5 rounded-full font-sans font-bold">
                      Featured
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Launch Spotlight Presentation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLaunch.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
            className="editorial-card p-6 sm:p-10 lg:p-12 rounded-3xl bg-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            {/* Left: 3D Book Cover Presentation (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative">
                {/* Gold Seal Badge */}
                <div className="gold-seal-badge -top-3 -right-3 sm:-top-4 sm:-right-4 shadow-xl z-20">
                  <span>{selectedLaunch.status === 'upcoming' ? 'OFFICIAL' : 'AVAILABLE'}</span>
                  <span className="text-[10px] tracking-widest font-bold">
                    {selectedLaunch.status === 'upcoming' ? 'PREMIERE' : 'IN STORE'}
                  </span>
                  <span className="text-[7px] text-[#f8f5ef]/90">★ 2026 ★</span>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02, rotateY: 3 }}
                  className="relative w-52 h-76 sm:w-60 sm:h-88 rounded-r-2xl overflow-hidden shadow-[24px_30px_50px_-8px_rgba(42,33,28,0.3)] border border-[#ffffff]/60 bg-white"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-r from-black/25 via-transparent to-white/10 z-20 pointer-events-none" />
                  <Image
                    src={selectedLaunch.coverImage || '/book.jpeg'}
                    alt={`${selectedLaunch.title} by ${selectedLaunch.author}`}
                    fill
                    priority
                    className="object-cover"
                  />
                </motion.div>
              </div>

              {/* Status Ribbon below mockup */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-sans ${
                  selectedLaunch.status === 'upcoming'
                    ? 'bg-[#c79a68]/15 text-[#c79a68] border border-[#c79a68]/30'
                    : selectedLaunch.status === 'live'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {selectedLaunch.status === 'upcoming'
                    ? `Upcoming Launch: ${selectedLaunch.launchDateFormatted}`
                    : selectedLaunch.status === 'live'
                    ? 'Live Premiere Active'
                    : 'Released • Now Available in Store'}
                </span>
              </div>
            </div>

            {/* Right: Launch Details & Interactive Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="editorial-script text-xl text-[#c79a68]">
                    {selectedLaunch.genre}
                  </span>
                  <span className="text-xs text-[#77716a]">&bull;</span>
                  <span className="text-xs uppercase font-bold text-[#77716a] tracking-wider font-sans">
                    {selectedLaunch.pagesCount} Pages &bull; By {selectedLaunch.author}
                  </span>
                </div>

                <h3 className="editorial-heading text-3xl sm:text-4xl text-[#1d1b18] leading-tight">
                  {selectedLaunch.title}
                </h3>

                <p className="editorial-subheading text-lg text-[#c79a68]">
                  &ldquo;{selectedLaunch.subtitle}&rdquo;
                </p>
              </div>

              <p className="body-text text-sm sm:text-base text-[#77716a] leading-relaxed">
                {selectedLaunch.synopsis?.[0] || selectedLaunch.tagline}
              </p>

              {/* Countdown or Release Badge Panel */}
              {isUpcoming ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#f8f5ef] border border-[rgba(80,60,40,0.10)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-[#c79a68] tracking-widest font-sans flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Launch Countdown
                    </span>
                    <span className="text-[11px] text-[#77716a] font-sans">
                      {selectedLaunch.launchDateFormatted} &bull; {selectedLaunch.launchTimeFormatted}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Minutes', value: timeLeft.minutes },
                      { label: 'Seconds', value: timeLeft.seconds }
                    ].map(u => (
                      <div key={u.label} className="p-2 bg-white rounded-xl border border-[rgba(80,60,40,0.08)] shadow-2xs">
                        <span className="text-lg sm:text-xl font-mono font-bold text-[#1d1b18]">
                          {String(u.value).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider text-[#c79a68] font-bold block">
                          {u.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#f8f5ef] border border-[rgba(80,60,40,0.10)] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider font-sans block">
                      Officially Published
                    </span>
                    <p className="font-serif font-bold text-sm text-[#1d1b18]">
                      Available for Worldwide Dispatch &amp; Instant Digital Delivery
                    </p>
                  </div>
                  <Link
                    href="/store"
                    className="editorial-btn-secondary py-2 px-4 text-xs font-semibold shrink-0"
                  >
                    View in Store
                  </Link>
                </div>
              )}

              {/* Available Editions / Formats */}
              {selectedLaunch.formats && selectedLaunch.formats.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#77716a] font-semibold block font-sans">
                    Available Editions &amp; Formats
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedLaunch.formats.map((fmt) => (
                      <div
                        key={fmt.id}
                        className="px-3.5 py-1.5 rounded-xl bg-[#f1ece3]/70 border border-[rgba(80,60,40,0.10)] flex items-center gap-2 text-xs"
                      >
                        <span className="font-semibold text-[#1d1b18]">{fmt.name}</span>
                        <span className="font-bold text-[#c79a68]">${fmt.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                {isUpcoming ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="editorial-btn-primary group cursor-pointer"
                  >
                    <span>Reserve Priority Seat (RSVP)</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <Link
                    href="/store"
                    className="editorial-btn-primary group"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    <span>Purchase Official Edition</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}

                <Link
                  href="/store"
                  className="editorial-btn-secondary"
                >
                  Explore Bookstore
                </Link>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Grid Catalog Showcase of all other titles */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-[rgba(80,60,40,0.10)] pb-4">
            <div>
              <span className="editorial-script text-xl text-[#c79a68]">Complete Catalog</span>
              <h3 className="font-serif text-2xl font-bold text-[#1d1b18]">All Releases &amp; Launch Titles</h3>
            </div>
            <Link
              href="/store"
              className="text-xs font-bold text-[#c79a68] hover:underline flex items-center gap-1 font-sans"
            >
              Browse Full Bookstore <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {launches.map((launch) => (
              <div
                key={launch.id}
                onClick={() => setSelectedLaunch(launch)}
                className={`editorial-card p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  launch.id === selectedLaunch.id
                    ? 'border-[#c79a68] ring-2 ring-[#c79a68]/20 bg-white'
                    : 'hover:border-[#c79a68]/40 bg-white/80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex gap-4 items-start">
                    <div className="relative w-16 h-24 rounded-lg overflow-hidden bg-white shadow-md shrink-0 border border-[rgba(80,60,40,0.1)]">
                      <Image 
                        src={launch.coverImage || '/book.jpeg'} 
                        alt={launch.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-[#c79a68] font-sans">
                        {launch.genre}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#1d1b18] leading-tight line-clamp-2">
                        {launch.title}
                      </h4>
                      <p className="text-[11px] text-[#77716a] line-clamp-2">
                        {launch.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[rgba(80,60,40,0.08)]">
                  <span className="text-[10px] uppercase font-semibold text-[#77716a] font-sans">
                    {launch.status === 'upcoming' ? launch.launchDateFormatted : 'In Bookstore'}
                  </span>
                  <span className="text-xs font-bold text-[#c79a68] flex items-center gap-1">
                    {launch.id === selectedLaunch.id ? 'Selected' : 'View Spotlight'} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Launch RSVP Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1d1b18]/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] p-8 rounded-3xl max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f1ece3] text-[#77716a] hover:text-[#1d1b18] flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>

              {!isRsvpSuccess ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="editorial-script text-2xl text-[#c79a68]">
                      Priority Launch Seat
                    </span>
                    <h3 className="editorial-heading text-2xl text-[#1d1b18]">
                      Reserve Launch Access
                    </h3>
                    <p className="body-text text-xs leading-relaxed">
                      Register complimentary access for <strong>{selectedLaunch.title}</strong> to receive calendar reminder credentials and early bird download links.
                    </p>
                  </div>

                  <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="e.g. Elvis Reader"
                        className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-[#77716a] uppercase tracking-wider block font-sans">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={rsvpEmail}
                        onChange={(e) => setRsvpEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-2.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="editorial-btn-primary w-full py-3 text-xs font-semibold tracking-wider cursor-pointer shadow-md mt-2"
                    >
                      Confirm Launch RSVP
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6 space-y-6">
                  <div className="w-14 h-14 rounded-full bg-[#c79a68]/15 text-[#c79a68] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="editorial-heading text-2xl text-[#1d1b18]">RSVP Confirmed</h3>
                    <p className="body-text text-xs max-w-xs mx-auto leading-relaxed">
                      Your credentials for <strong>{selectedLaunch.title}</strong> have been saved. Confirmation dispatched to <span className="font-semibold text-[#1d1b18]">{rsvpEmail}</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      setIsRsvpSuccess(false)
                      setRsvpName('')
                      setRsvpEmail('')
                    }}
                    className="editorial-btn-secondary text-xs"
                  >
                    Return to Showcase
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
