'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Pause,
  Play,
  Calendar,
  Layers,
  BookOpen
} from 'lucide-react'
import { getStoredLaunches, defaultBookLaunches, BookLaunch, saveRSVP } from '@/lib/data-store'

export default function HeroSection() {
  const [launches, setLaunches] = useState<BookLaunch[]>(defaultBookLaunches)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = next, -1 = prev
  const [isPaused, setIsPaused] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpEmail, setRsvpEmail] = useState('')
  const [isRsvpSuccess, setIsRsvpSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const autoScrollInterval = 14000 // 14 seconds per slide (generous reading pace)

  useEffect(() => {
    const list = getStoredLaunches()
    if (list && list.length > 0) {
      setLaunches(list)
    }
  }, [])

  const currentLaunch = launches[currentIndex] || defaultBookLaunches[0]

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % launches.length)
    setIsRsvpSuccess(false)
  }, [launches.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + launches.length) % launches.length)
    setIsRsvpSuccess(false)
  }, [launches.length])

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
    setIsRsvpSuccess(false)
  }

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused || isModalOpen || launches.length <= 1) return

    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % launches.length)
      setIsRsvpSuccess(false)
    }, autoScrollInterval)

    return () => clearInterval(timer)
  }, [isPaused, isModalOpen, launches.length, currentIndex])

  // Live countdown calculation for the currently active launch
  useEffect(() => {
    const targetDate = new Date(currentLaunch.launchDate || '2026-07-21T18:00:00')

    const updateCountdown = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0 || currentLaunch.status === 'completed') {
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
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [currentLaunch])

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpName || !rsvpEmail) return
    saveRSVP(currentLaunch, rsvpName, rsvpEmail)
    setIsRsvpSuccess(true)
  }

  const isUpcoming = currentLaunch.status === 'upcoming' && new Date(currentLaunch.launchDate).getTime() > Date.now()

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 45 : -45,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -45 : 45,
      opacity: 0,
    }),
  }

  return (
    <section
      id="launches"
      className="relative min-h-[calc(100dvh-4.75rem)] lg:h-[calc(100dvh-4.75rem)] bg-[#f8f5ef] py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-center select-none"
    >
      {/* Background Lighting Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-[#c79a68]/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#f1ece3] rounded-full blur-[90px]" />
        <div className="absolute inset-0 bg-paper-texture opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full z-10 my-auto flex flex-col justify-between h-full max-h-[860px] gap-3 sm:gap-4">

        {/* Top Book Switcher Navigation & Playback Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[rgba(80,60,40,0.08)] pb-2.5">
          {/* Capsule Switcher */}
          {/* <div className="inline-flex flex-wrap items-center p-1 bg-[#f1ece3] rounded-full border border-[rgba(80,60,40,0.10)] gap-1 shadow-2xs max-w-full overflow-x-auto">
            {launches.map((l, index) => {
              const isActive = index === currentIndex
              return (
                <button
                  key={l.id}
                  onClick={() => goToSlide(index)}
                  className={`px-3 sm:px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#2a211c] text-[#f8f5ef] shadow-xs'
                      : 'text-[#77716a] hover:text-[#1d1b18] hover:bg-white/60'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    l.status === 'upcoming' 
                      ? 'bg-[#c79a68]' 
                      : l.status === 'live' 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-emerald-500'
                  }`} />
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">{l.title}</span>
                </button>
              )
            })}
          </div> */}

          {/* Slide Controls & Counter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-semibold text-[#77716a] mr-1">
              0{currentIndex + 1} <span className="text-[#77716a]/40">/ 0{launches.length}</span>
            </span>

            <button
              onClick={prevSlide}
              aria-label="Previous Book Launch"
              className="p-1 rounded-full bg-white border border-[rgba(80,60,40,0.12)] hover:border-[#c79a68] text-[#1d1b18] hover:text-[#c79a68] shadow-2xs transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Resume Auto-Scroll" : "Pause Auto-Scroll"}
              className="p-1 rounded-full bg-white border border-[rgba(80,60,40,0.12)] text-[#77716a] hover:text-[#1d1b18] shadow-2xs transition-all cursor-pointer"
              title={isPaused ? "Resume Auto-Scroll" : "Pause Auto-Scroll"}
            >
              {isPaused ? <Play className="w-3 h-3 text-[#c79a68]" /> : <Pause className="w-3 h-3" />}
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next Book Launch"
              className="p-1 rounded-full bg-white border border-[rgba(80,60,40,0.12)] hover:border-[#c79a68] text-[#1d1b18] hover:text-[#c79a68] shadow-2xs transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Animated Active Book Presentation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentLaunch.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center my-auto"
          >
            {/* Left Column: Literary Typography & Actions (7 cols) */}
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="lg:col-span-7 space-y-2.5 sm:space-y-3"
            >

              {/* Eyebrow & Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-[#2a211c] text-[#f8f5ef] flex items-center gap-1.5 shadow-2xs font-sans">
                  <span className={`w-1.5 h-1.5 rounded-full ${currentLaunch.status === 'upcoming'
                      ? 'bg-[#c79a68]'
                      : currentLaunch.status === 'live'
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-emerald-500'
                    }`} />
                  {currentLaunch.status === 'upcoming' ? 'Featured Premiere' : 'In Bookstore'}
                </span>
                <span className="h-px w-5 bg-[#c79a68]/40" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#77716a]">
                  {currentLaunch.status === 'upcoming'
                    ? `Global Launch: ${currentLaunch.launchDateFormatted}`
                    : 'Published Edition • Instant Delivery'}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="editorial-display text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] text-[#1d1b18] tracking-tight leading-[1.12]">
                {currentLaunch.title}
              </h1>

              {/* Subtitle Quote */}
              <p className="editorial-subheading text-sm sm:text-base text-[#c79a68] font-serif italic line-clamp-1">
                &ldquo;{currentLaunch.subtitle}&rdquo;
              </p>

              {/* Author & Specs line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#77716a]">
                <span className="font-sans text-[11px] uppercase tracking-wider text-[#c79a68] font-semibold">Written by</span>
                <span className="font-serif font-bold text-[#1d1b18] text-sm">{currentLaunch.author}</span>
                <span className="text-[#77716a]/50">&bull;</span>
                <span className="font-sans text-[11px] text-[#77716a]">{currentLaunch.pagesCount} Pages &bull; {currentLaunch.genre}</span>
              </div>

              {/* Synopsis Paragraph */}
              <p className="body-text text-[#77716a] max-w-xl text-xs sm:text-sm leading-relaxed line-clamp-2">
                {currentLaunch.synopsis?.[0] || currentLaunch.tagline}
              </p>

              {/* Countdown or Store Status Ribbon */}
              {isUpcoming ? (
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#f1ece3]/80 border border-[rgba(80,60,40,0.10)] max-w-lg space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-sans font-bold text-[#c79a68] uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5" /> Launch Countdown
                    </span>
                    <span className="text-[#77716a] font-sans text-[11px]">
                      {currentLaunch.launchDateFormatted} &bull; {currentLaunch.launchTimeFormatted}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Mins', value: timeLeft.minutes },
                      { label: 'Secs', value: timeLeft.seconds }
                    ].map(unit => (
                      <div key={unit.label} className="p-1 sm:p-1.5 bg-white rounded-lg border border-[rgba(80,60,40,0.08)] shadow-2xs">
                        <span className="text-sm sm:text-base font-mono font-bold text-[#1d1b18] leading-tight block">
                          {String(unit.value).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider text-[#c79a68] font-bold block">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 px-3.5 rounded-xl bg-[#f1ece3]/80 border border-[rgba(80,60,40,0.10)] max-w-lg flex items-center justify-between text-xs shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>In Stock • Instant Worldwide Dispatch</span>
                  </div>
                  <Link href="/store" className="text-xs font-bold text-[#c79a68] hover:underline font-sans">
                    Browse Editions &rarr;
                  </Link>
                </div>
              )}

              {/* Format pills */}
              {currentLaunch.formats && currentLaunch.formats.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {currentLaunch.formats.map((fmt) => (
                    <div
                      key={fmt.id}
                      className="px-2.5 py-0.5 rounded-md bg-white border border-[rgba(80,60,40,0.10)] flex items-center gap-1.5 text-xs shadow-2xs"
                    >
                      <span className="text-[#1d1b18] font-medium text-[11px]">{fmt.name}</span>
                      <span className="font-bold text-[#c79a68] text-[11px]">${fmt.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                {isUpcoming ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="editorial-btn-primary group cursor-pointer text-xs py-2 px-4.5"
                  >
                    <span>Reserve Priority Seat (RSVP)</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <Link
                    href="/store"
                    className="editorial-btn-primary group text-xs py-2 px-4.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                    <span>Purchase Official Edition</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}

                <Link
                  href="/store"
                  className="editorial-btn-secondary text-xs py-2 px-4.5"
                >
                  Visit Bookstore Catalog
                </Link>
              </div>

            </div>

            {/* Right Column: 3D Floating Book Mockup (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative">
                {/* Gold Seal Badge */}
                <div className="gold-seal-badge -top-2.5 -right-2.5 sm:-top-3 sm:-right-3 shadow-lg z-20 scale-90 sm:scale-95">
                  <span>{isUpcoming ? 'OFFICIAL' : 'AVAILABLE'}</span>
                  <span className="text-[9px] tracking-widest font-bold">
                    {isUpcoming ? 'PREMIERE' : 'IN STORE'}
                  </span>
                  <span className="text-[7px] text-[#f8f5ef]/90">★ 2026 ★</span>
                </div>

                {/* 3D Floating Book */}
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                    rotateY: [-2.5, 2.5, -2.5],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-40 h-58 sm:w-48 sm:h-70 lg:w-52 lg:h-76 xl:w-56 xl:h-80 rounded-r-2xl overflow-hidden shadow-[20px_24px_45px_-8px_rgba(42,33,28,0.30)] border border-[#ffffff]/70 bg-white group cursor-pointer"
                  onClick={() => {
                    if (isUpcoming) setIsModalOpen(true)
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-r from-black/25 via-transparent to-white/10 z-20 pointer-events-none" />
                  <Image
                    src={currentLaunch.coverImage || '/book.jpeg'}
                    alt={`${currentLaunch.title} Cover Mockup`}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                </motion.div>
              </div>

              {/* Interactive Book Info Strip */}
              <div className="mt-2.5 flex items-center justify-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#77716a] font-sans">
                  {currentLaunch.genre}
                </span>
                <span className="text-[#c79a68]">&bull;</span>
                <span className="text-[11px] font-semibold text-[#1d1b18] font-sans">
                  By {currentLaunch.author}
                </span>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Bottom Slide Progress Indicator Bar */}
        <div className="flex items-center justify-center gap-2 pt-1 border-t border-[rgba(80,60,40,0.06)]">
          {launches.map((l, index) => {
            const isActive = index === currentIndex
            return (
              <button
                key={l.id}
                onClick={() => goToSlide(index)}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${isActive
                    ? 'w-8 sm:w-10 bg-[rgba(80,60,40,0.15)]'
                    : 'w-2 sm:w-2.5 bg-[rgba(80,60,40,0.15)] hover:bg-[#c79a68]/40'
                  }`}
                aria-label={`Go to slide ${index + 1}: ${l.title}`}
                title={l.title}
              >
                {isActive && (
                  <motion.div
                    key={`progress-${currentIndex}-${isPaused}`}
                    initial={{ width: '0%' }}
                    animate={{ width: isPaused ? '0%' : '100%' }}
                    transition={{
                      duration: isPaused ? 0 : autoScrollInterval / 1000,
                      ease: 'linear'
                    }}
                    className="h-full bg-[#c79a68] rounded-full"
                  />
                )}
              </button>
            )
          })}
        </div>

      </div>

      {/* RSVP Modal */}
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
                      Register complimentary access for <strong>{currentLaunch.title}</strong> to receive calendar reminder credentials and early bird download links.
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
                      Your credentials for <strong>{currentLaunch.title}</strong> have been saved. Confirmation dispatched to <span className="font-semibold text-[#1d1b18]">{rsvpEmail}</span>.
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
