'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { BookLaunch, getStoredLaunches, defaultBookLaunches, saveRSVP } from '@/lib/data-store'

interface PrelaunchScreenProps {
  onComplete: () => void
  launch?: BookLaunch
  showEnterButton?: boolean
}

export default function PrelaunchScreen({ 
  onComplete, 
  launch,
  showEnterButton = true 
}: PrelaunchScreenProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpEmail, setRsvpEmail] = useState('')
  const [isRsvpSuccess, setIsRsvpSuccess] = useState(false)

  // Resolve current active launch
  const [activeLaunch, setActiveLaunch] = useState<BookLaunch>(() => {
    if (launch) return launch
    if (typeof window !== 'undefined') {
      const launches = getStoredLaunches()
      return launches.find(l => l.isFeatured) || launches[0] || defaultBookLaunches[0]
    }
    return defaultBookLaunches[0]
  })

  useEffect(() => {
    if (launch) {
      setActiveLaunch(launch)
    } else {
      const launches = getStoredLaunches()
      const found = launches.find(l => l.isFeatured) || launches[0] || defaultBookLaunches[0]
      setActiveLaunch(found)
    }
  }, [launch])

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDateStr = activeLaunch.launchDate || '2026-07-21T18:00:00'
    const targetDate = new Date(targetDateStr)

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      if (difference <= 0 || activeLaunch.status === 'completed') {
        onComplete()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [activeLaunch, onComplete])

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpName || !rsvpEmail) return
    saveRSVP(activeLaunch, rsvpName, rsvpEmail)
    setIsRsvpSuccess(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f5ef] overflow-y-auto selection:bg-[#f1ece3] flex flex-col">
      <div className="w-full min-h-screen flex flex-col items-center justify-between pt-4 px-4 pb-6 md:pt-6 md:px-8 md:pb-8 relative overflow-hidden text-[#1d1b18] shrink-0">

        {/* Subtle Background Lighting */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[15%] -left-[10%] w-[80vw] h-[80vw] max-w-[700px] rounded-full bg-[#c79a68]/10 blur-[130px]" />
          <div className="absolute -bottom-[15%] -right-[10%] w-[80vw] h-[80vw] max-w-[800px] rounded-full bg-[#f1ece3] blur-[120px]" />
        </div>

        {/* Editorial Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl flex justify-between items-center z-10 border-b border-[rgba(80,60,40,0.08)] pb-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#2a211c] text-[#f8f5ef] font-serif font-bold text-[10px] flex items-center justify-center">
              EJ
            </span>
            <span className="font-serif text-sm tracking-wide font-bold text-[#1d1b18]">
              {activeLaunch.author || 'Dr. Elvis Justice Bedi'}
            </span>
            <span className="text-xs text-[#c79a68] hidden sm:inline">&bull;</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#c79a68] font-sans font-semibold hidden sm:inline">
              Launch Premiere Portal
            </span>
          </div>

          {showEnterButton && (
            <button
              onClick={onComplete}
              className="editorial-btn-secondary py-1.5 px-4 text-xs tracking-wider uppercase font-semibold cursor-pointer"
            >
              Enter Launch Room
            </button>
          )}
        </motion.div>

        {/* Main Editorial Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto z-10 py-6">

          {/* Left Text Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 space-y-6 lg:pr-4"
          >
            <div className="space-y-2">
              <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
                Global Release Countdown
              </span>

              <h1 className="editorial-display text-4xl sm:text-5xl md:text-6xl text-[#1d1b18] leading-[1.05]">
                {activeLaunch.title}
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-[#c79a68]">
                &ldquo;{activeLaunch.quote || activeLaunch.subtitle}&rdquo;
              </p>
            </div>

            <p className="body-text text-sm sm:text-base text-[#77716a] max-w-xl leading-relaxed">
              {activeLaunch.synopsis?.[0] || activeLaunch.tagline || 'Experience an enduring literary and personal performance production by Dr. Elvis Justice Bedi. Featuring deluxe print editions, interactive eBook downloads, and companion masterclass audiobooks.'}
            </p>

            <div className="p-4 bg-white border border-[rgba(80,60,40,0.10)] rounded-2xl max-w-xl flex items-start gap-3 shadow-xs">
              <Sparkles className="w-5 h-5 text-[#c79a68] shrink-0 mt-0.5" />
              <p className="text-xs text-[#77716a] leading-relaxed">
                <strong className="text-[#1d1b18] font-semibold">Worldwide Virtual Premiere:</strong> {activeLaunch.launchDateFormatted || 'Coming Soon'}. Register your credentials below to unlock streaming access and receive early bird download certificates.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="editorial-btn-primary group cursor-pointer"
              >
                <span>Reserve Priority Launch Seat</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>

              {showEnterButton && (
                <button
                  onClick={onComplete}
                  className="editorial-btn-secondary cursor-pointer"
                >
                  Preview Launch Room
                </button>
              )}
            </div>
          </motion.div>

          {/* Right Media & Countdown Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center justify-center space-y-6"
          >
            {/* 3D Book Showcase */}
            <div className="relative">
              {/* Starburst badge */}
              <div className="gold-seal-badge -top-4 -right-4 shadow-xl">
                <span>OFFICIAL</span>
                <span className="text-[10px] tracking-widest font-bold">PREMIERE</span>
                <span className="text-[7px] text-[#f8f5ef]/90">★ 2026 ★</span>
              </div>

              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotateY: [-3, 3, -3],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-48 h-72 sm:w-56 sm:h-80 rounded-r-xl overflow-hidden shadow-[24px_30px_50px_-8px_rgba(42,33,28,0.3)] border border-[#ffffff]/50 bg-white"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-r from-black/25 via-transparent to-white/10 z-20 pointer-events-none" />
                <Image
                  src={activeLaunch.coverImage || '/book.jpeg'}
                  alt={`${activeLaunch.title} by ${activeLaunch.author}`}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Countdown Clock Grid */}
            <div className="text-center space-y-3 w-full max-w-sm">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="p-3 bg-white border border-[rgba(80,60,40,0.10)] rounded-2xl shadow-xs text-center"
                  >
                    <span className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-[#1d1b18]">
                      {String(unit.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#c79a68] font-bold block mt-1">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-[#77716a] font-semibold">
                {activeLaunch.launchDateFormatted} &bull; {activeLaunch.launchTimeFormatted}
              </p>
            </div>

          </motion.div>
        </div>

        {/* Modal RSVP */}
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
                        Priority Registry
                      </span>
                      <h3 className="editorial-heading text-2xl text-[#1d1b18]">
                        Reserve Launch Access
                      </h3>
                      <p className="body-text text-xs leading-relaxed">
                        Register for <strong>{activeLaunch.title}</strong> to unlock virtual livestream credentials and early bird downloads on launch day.
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
                          Email Delivery Address
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
                        Your credentials for <strong>{activeLaunch.title}</strong> have been recorded. Confirmation dispatched to <span className="font-semibold text-[#1d1b18]">{rsvpEmail}</span>.
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
                      Return to Countdown
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="w-full text-center text-[10px] tracking-widest uppercase text-[#77716a] pt-4 border-t border-[rgba(80,60,40,0.08)]">
          &copy; {new Date().getFullYear()} {activeLaunch.author || 'Dr. Elvis Justice Bedi'} &bull; Official Virtual Premiere Portal
        </div>

      </div>
    </div>
  )
}