'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/components/footer'
import { Calendar, Clock, Video, Mail, CheckCircle2, Tv, RefreshCw, Sparkles } from 'lucide-react'

export default function EventPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [isReplayMode, setIsReplayMode] = useState(false) // Toggle to test "post-event recorded replay"
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Target event date: July 21, 2026
  useEffect(() => {
    const targetDate = new Date('2026-07-21T18:00:00') // 6:00 PM EST

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      if (difference <= 0) {
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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Check if user is already registered in this session
    const registered = localStorage.getItem('aurora_rsvp_registered')
    if (registered) {
      setIsRegistered(true)
    }

    // Load broadcast mode set by admin
    const storedMode = localStorage.getItem('aurora_event_mode')
    if (storedMode === 'replay') {
      setIsReplayMode(true)
    } else {
      setIsReplayMode(false)
    }

    return () => clearInterval(timer)
  }, [])

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    // Save RSVP to localStorage for Admin dashboard access
    const existingRSVPs = JSON.parse(localStorage.getItem('aurora_rsvps') || '[]')
    const newRSVP = {
      id: Date.now().toString(),
      name,
      email,
      date: new Date().toLocaleDateString(),
    }
    localStorage.setItem('aurora_rsvps', JSON.stringify([newRSVP, ...existingRSVPs]))
    localStorage.setItem('aurora_rsvp_registered', 'true')
    
    setIsRegistered(true)
  }

  const handleResetRegistration = () => {
    localStorage.removeItem('aurora_rsvp_registered')
    setIsRegistered(false)
    setName('')
    setEmail('')
  }

  return (
    <main className="bg-background text-foreground min-h-screen">

      {/* Hero Banner */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eaddcd] text-foreground text-xs font-semibold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#b08d57]" /> Exclusive Virtual Event
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight">
            Virtual Launch Mainstage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrate the official digital launch of *JUST ELVIS JUSTICE* by Dr. Elvis Justice Bedi, featuring live reading, author Q&amp;A, and guest panelists.
          </p>
        </motion.div>
      </section>

      {/* Countdown Timer Widget */}
      <section className="py-6 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 text-center space-y-4"
        >
          <p className="text-xs uppercase tracking-widest text-[#b08d57] font-semibold">
            Countdown to Launch Event: July 21, 2026 &bull; 6:00 PM EST
          </p>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="p-3 bg-background border border-border rounded-lg shadow-sm">
                  <span className="text-2xl md:text-3xl font-bold font-mono text-[#2d2620]">
                    {String(value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block mt-1">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Main Stream Player & RSVP Section */}
      <section className="py-12 px-4 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live stream / Replay screen (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-serif font-bold flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#b08d57]" /> 
              {isReplayMode ? 'Post-Event Replay' : 'Virtual Live Stream'}
            </h3>
          </div>

          {/* Embedded Video Mock Container */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#f8f5f0] border border-[#eadecc] flex flex-col items-center justify-center text-center p-6 shadow-md">
            
            {!isRegistered ? (
              // Unregistered Overlay
              <div className="space-y-4 max-w-md">
                <Video className="w-12 h-12 text-[#b08d57] mx-auto animate-pulse" />
                <h4 className="text-lg font-serif font-bold">Registration Required</h4>
                <p className="text-sm text-[#7d7265]">
                  Please complete the RSVP form on the right to unlock access to the livestream feed and get direct Zoom access link.
                </p>
              </div>
            ) : isReplayMode ? (
              // Replay Video Mode
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                title="Book Launch Recorded Replay"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // Live Stream Active Player (YouTube Live Mock/Placeholder)
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#fcfbfa] to-[#f3eee7] text-center">
                <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest animate-pulse">
                  Standby
                </span>
                <Video className="w-16 h-16 text-[#b08d57] mb-4" />
                <h4 className="text-xl font-serif font-bold text-[#2d2620] mb-2">Live Stream Standby Room</h4>
                <p className="text-sm text-[#7d7265] max-w-sm mb-6">
                  Stream will start on July 21st, 2026. Keep this tab open or join via Zoom using the button below.
                </p>
                <a 
                  href="https://zoom.us" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-6 py-2 bg-[#b08d57] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                >
                  Join Direct Zoom Broadcast
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: RSVP Registration / Confirmation */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {!isRegistered ? (
              // RSVP Form
              <motion.div
                key="rsvp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-[#2d2620]">Event RSVP</h3>
                  <p className="text-xs text-[#7d7265]">Register to reserve your slot and unlock the video feed link.</p>
                </div>

                <form onSubmit={handleRSVPSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elvis Reader"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    Register for Launch Event
                  </button>
                </form>

                <div className="text-[10px] text-muted-foreground leading-relaxed text-center">
                  *By submitting, you agree to receive automated email confirmations, calendar invites, and reminder updates before the event.
                </div>
              </motion.div>
            ) : (
              // RSVP Success Box
              <motion.div
                key="rsvp-success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#f8f5f0] border border-[#eadecc] rounded-xl p-6 text-center space-y-6 shadow-sm"
              >
                <CheckCircle2 className="w-12 h-12 text-[#b08d57] mx-auto" />
                
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#2d2620]">RSVP Confirmed!</h3>
                  <p className="text-sm text-[#7d7265] leading-relaxed">
                    Thank you! We&apos;ve registered you for the event. An automated confirmation email containing your direct streaming credentials has been dispatched.
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#eadecc] rounded-lg text-xs space-y-2 text-[#7d7265] text-left">
                  <div className="flex gap-2">
                    <Calendar className="w-4 h-4 text-[#b08d57] shrink-0" />
                    <span>July 21st, 2026</span>
                  </div>
                  <div className="flex gap-2">
                    <Clock className="w-4 h-4 text-[#b08d57] shrink-0" />
                    <span>6:00 PM - 9:00 PM EST</span>
                  </div>
                </div>

                <button
                  onClick={handleResetRegistration}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all block mx-auto"
                >
                  Change RSVP Details
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  )
}
