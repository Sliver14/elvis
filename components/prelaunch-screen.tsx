'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, AlertCircle, ArrowRight, X, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

interface PrelaunchScreenProps {
  onComplete: () => void
}

export default function PrelaunchScreen({ onComplete }: PrelaunchScreenProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpEmail, setRsvpEmail] = useState('')
  const [isRsvpSuccess, setIsRsvpSuccess] = useState(false)

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date('2026-07-21T18:00:00')

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      if (difference <= 0) {
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
  }, [onComplete])

  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (timeLeft.seconds / 60) * circumference

  const authorName = "Dr. Elvis Justice Bedi"
  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#fbf9f6] overflow-y-auto selection:bg-[#eae0d0] flex flex-col">
      <div className="w-full min-h-screen flex flex-col items-center justify-between pt-2 px-4 pb-4 md:pt-4 md:px-8 md:pb-8 relative overflow-hidden text-[#1c1611] shrink-0">

        {/* Dynamic Immersive Background Mesh splashes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[15%] -left-[10%] w-[90vw] h-[90vw] max-w-[800px] rounded-full bg-gradient-to-br from-[#bda06d]/15 to-[#2b221a]/5 blur-[140px]"
          />
          <motion.div
            animate={{
              scale: [1.05, 0.95, 1.05],
              x: [0, -40, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-[15%] -right-[10%] w-[90vw] h-[90vw] max-w-[900px] rounded-full bg-gradient-to-tl from-[#eae0d0]/40 to-[#bda06d]/10 blur-[140px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(#e5ddd0_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        </div>

        {/* Luxury Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-6xl flex justify-between items-center z-10 border-b border-[#2b221a]/5 pb-3"
        >
          <span className="font-serif text-xs md:text-sm tracking-[0.3em] uppercase font-bold text-[#bda06d]">
            {authorName} <span className="text-[#2b221a]/30 font-sans mx-2">•</span> Virtual Launch
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="text-[10px] tracking-[0.2em] uppercase font-bold border border-[#bda06d]/30 px-4 py-2 rounded-full hover:bg-[#bda06d]/5 transition-all text-[#bda06d]"
          >
            Skip to Test Demo
          </motion.button>
        </motion.div>

        {/* Main Structural Layout */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto z-10 py-4 lg:py-6 max-h-[calc(100vh-140px)] overflow-y-auto lg:overflow-visible pr-1 lg:pr-0">

          {/* Editorial Textual Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8 lg:pr-6"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#2b221a]/5 text-[#2b221a] text-[10px] font-bold rounded-full uppercase tracking-[0.15em]">
                <BookOpen className="w-3 h-3 text-[#bda06d]" /> Exclusive Digital Access
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight leading-[1.05] uppercase text-[#2b221a]">
                JUST ELVIS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2b221a] via-[#bda06d] to-[#2b221a]">JUSTICE</span>
              </h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
                className="text-base md:text-lg font-serif italic text-[#bda06d]"
              >
                Masterpiece curated by{' '}
                {authorName.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block font-bold"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.p>
            </div>

            <p className="text-sm md:text-base text-[#2b221a]/70 max-w-xl leading-relaxed font-sans font-light">
              Prepare to embark on a boundaries-breaking digital literary production. Engineered specifically as a fully integrated global launch—experience the interactive high-fidelity eBook, premium master-class companion audiobooks, and rich dynamic media files delivered straight to your secure terminal instantly upon drop.
            </p>

            {/* Premium Callout Notification */}
            <div className="p-4 bg-gradient-to-r from-[#f5eee0] to-[#faf5eb] border border-[#bda06d]/20 rounded-xl max-w-xl flex gap-3 text-xs md:text-sm text-[#2b221a]/80 shadow-[0_4px_20px_rgba(189,160,109,0.05)]">
              <AlertCircle className="w-5 h-5 text-[#bda06d] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-[#2b221a] font-medium">Digital Distribution:</strong> No logistics constraints. Available simultaneously worldwide via instant verified secure transmission. Zero delay, zero logistics footprint.
              </p>
            </div>

            {/* Luxury Main CTA Action */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#2b221a] text-[#fbf9f6] rounded-xl font-medium tracking-wide shadow-xl shadow-[#2b221a]/20 hover:bg-[#bda06d] transition-all cursor-pointer text-sm"
              >
                Secure Priority Launch Invitation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          {/* Visual Media & Dimensional Interactive Timer Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center justify-center space-y-4 w-full"
          >
            {/* Enhanced 3D Book Interactive Showcase Container */}
            <div className="relative w-full max-w-[340px] aspect-[4/5] flex items-center justify-center [perspective:1000px]">

              {/* Countdown Rotating Orbit Tracker */}
              <svg viewBox="0 0 320 320" className="absolute w-[110%] h-[110%] -rotate-90 pointer-events-none scale-105 opacity-80">
                <circle
                  cx="160"
                  cy="160"
                  r={radius * 2.3}
                  stroke="#e7dbc6"
                  strokeWidth="2"
                  fill="transparent"
                  className="opacity-30"
                />
                <motion.circle
                  cx="160"
                  cy="160"
                  r={radius * 2.3}
                  stroke="#bda06d"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference * 2.3}
                  animate={{ strokeDashoffset: strokeDashoffset * 2.3 }}
                  transition={{ duration: 0.3 }}
                />
              </svg>

              {/* Custom Luxury 3D Floating Book Mockup container */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotateY: [-5, 5, -5],
                  rotateX: [8, 12, 8]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-44 h-64 sm:w-52 sm:h-76 md:w-56 md:h-80 rounded-r-xl overflow-hidden shadow-[20px_25px_45px_-10px_rgba(43,34,26,0.3)] border-y border-r border-[#ffffff]/30 bg-white group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Premium Book Spine simulation edge highlight */}
                <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-r from-black/20 via-transparent to-white/10 z-20 pointer-events-none" />
                <Image
                  src="/book.jpeg"
                  alt="JUST ELVIS JUSTICE Book Cover"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </div>

            {/* Premium Minimal Editorial Countdown Grid */}
            <div className="text-center space-y-4 w-full">
              <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto px-2">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((unit) => (
                  <div key={unit.label} className="relative group p-3 bg-gradient-to-b from-white to-[#fbf9f6] border border-[#2b221a]/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center transition-all duration-300 hover:border-[#bda06d]/30">
                    <span className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-[#2b221a]">
                      {String(unit.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.1em] text-[#2b221a]/50 font-bold block mt-1.5">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#2b221a]/40 font-bold px-4 pb-8">
                Unlocking Internationally On July 21, 2026
              </p>
            </div>
          </motion.div>
        </div>

        {/* Re-designed Translucent Modal Screen */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1611]/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.96, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 15 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#fbf9f6] border border-[#2b221a]/10 p-8 shadow-3xl rounded-3xl max-w-md w-full relative text-[#2b221a]"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-5 right-5 text-[#2b221a]/40 hover:text-[#2b221a] transition-colors p-1 rounded-full hover:bg-[#2b221a]/5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {!isRsvpSuccess ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif font-black tracking-tight text-[#2b221a]">Priority Registry</h3>
                      <p className="text-xs text-[#2b221a]/60 leading-relaxed font-light">
                        Register your credentials immediately to guarantee live streaming broadcast entry credentials and access direct distribution pipeline download unlocks.
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (!rsvpName || !rsvpEmail) return
                        const currentRSVPs = JSON.parse(localStorage.getItem('aurora_rsvps') || '[]')
                        const newRSVP = {
                          id: Date.now().toString(),
                          name: rsvpName,
                          email: rsvpEmail,
                          date: new Date().toLocaleDateString(),
                        }
                        localStorage.setItem('aurora_rsvps', JSON.stringify([newRSVP, ...currentRSVPs]))
                        localStorage.setItem('aurora_rsvp_registered', 'true')
                        setIsRsvpSuccess(true)
                      }}
                      className="space-y-5"
                    >
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-[#2b221a]/60 uppercase tracking-widest block">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          placeholder="e.g., Jane Doe"
                          className="w-full px-4 py-3 bg-[#2b221a]/5 border border-transparent rounded-xl text-sm transition-all focus:outline-none focus:border-[#bda06d] focus:bg-white text-[#2b221a]"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-[#2b221a]/60 uppercase tracking-widest block">Secure Email Delivery Address</label>
                        <input
                          type="email"
                          required
                          value={rsvpEmail}
                          onChange={(e) => setRsvpEmail(e.target.value)}
                          placeholder="you@domain.com"
                          className="w-full px-4 py-3 bg-[#2b221a]/5 border border-transparent rounded-xl text-sm transition-all focus:outline-none focus:border-[#bda06d] focus:bg-white text-[#2b221a]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#2b221a] text-[#fbf9f6] rounded-xl text-sm font-semibold hover:bg-[#bda06d] transition-all shadow-lg shadow-[#2b221a]/10 cursor-pointer"
                      >
                        Verify &amp; Confirm Registration
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-6">
                    <div className="w-14 h-14 rounded-full bg-[#bda06d]/10 text-[#bda06d] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold text-[#2b221a]">Credentials Manifested</h3>
                      <p className="text-xs text-[#2b221a]/60 max-w-xs mx-auto leading-relaxed">
                        Transmission successfully completed. Secure link assets have been route-mapped to <span className="font-semibold text-[#2b221a]">{rsvpEmail}</span>. See you at launch.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsModalOpen(false)
                        setIsRsvpSuccess(false)
                        setRsvpName('')
                        setRsvpEmail('')
                      }}
                      className="px-6 py-2.5 border border-[#2b221a]/20 rounded-xl hover:bg-[#2b221a]/5 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Sibling Footer on White Background, below the min-h-screen fold */}
      <div className="w-full bg-white text-center py-8 text-[10px] tracking-widest uppercase text-[#2b221a]/60 border-t border-[#2b221a]/5 z-10 relative">
        &copy; {new Date().getFullYear()} JUST ELVIS JUSTICE by {authorName}. All Rights Reserved.
      </div>
    </div>
  )
}