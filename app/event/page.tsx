'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/footer'
import CountdownTimer from '@/components/countdown-timer'
import { 
  Calendar, 
  Clock, 
  Video, 
  Mail, 
  CheckCircle2, 
  Tv, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  BookOpen,
  UserCheck
} from 'lucide-react'
import { getStoredLaunches, BookLaunch, saveRSVP } from '@/lib/data-store'

export default function EventMainstagePage() {
  const [launches, setLaunches] = useState<BookLaunch[]>([])
  const [selectedLaunchId, setSelectedLaunchId] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const list = getStoredLaunches()
    setLaunches(list)
    if (list.length > 0) {
      const featured = list.find(l => l.isFeatured) || list[0]
      setSelectedLaunchId(featured.id)
      checkRegistration(featured.slug)
    }
  }, [])

  const checkRegistration = (slug: string) => {
    const reg = localStorage.getItem(`aurora_rsvp_${slug}`)
    setIsRegistered(reg === 'true')
  }

  const selectedLaunch = launches.find(l => l.id === selectedLaunchId) || launches[0]

  const handleSelectLaunch = (launch: BookLaunch) => {
    setSelectedLaunchId(launch.id)
    checkRegistration(launch.slug)
    setName('')
    setEmail('')
  }

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !selectedLaunch) return
    saveRSVP(selectedLaunch, name, email)
    setIsRegistered(true)
  }

  const handleResetRegistration = () => {
    if (!selectedLaunch) return
    localStorage.removeItem(`aurora_rsvp_${selectedLaunch.slug}`)
    setIsRegistered(false)
    setName('')
    setEmail('')
  }

  if (!selectedLaunch) {
    return (
      <main className="bg-[#f8f5ef] min-h-screen flex items-center justify-center text-[#1d1b18]">
        <div className="w-8 h-8 border-2 border-[#c79a68] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="bg-[#f8f5ef] text-[#1d1b18] min-h-screen selection:bg-[#f1ece3]">
      
      {/* Hero Banner */}
      <section className="pt-16 pb-8 md:pt-20 md:pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
            Virtual Mainstage Hub
          </span>
          <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
            Book Launch Premieres
          </h1>
          <p className="body-text text-sm sm:text-base text-[#77716a] max-w-xl mx-auto">
            Select a book launch below to view broadcast schedules, stream transmission feeds, and complete complimentary RSVP registration.
          </p>
        </motion.div>
      </section>

      {/* Multi-Launch Selector Capsule Bar */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-8">
        <div className="bg-[#f1ece3] p-2 rounded-2xl border border-[rgba(80,60,40,0.08)] shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#77716a] pl-3 shrink-0 font-sans">
              Select Launch Stage:
            </span>
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {launches.map((l) => {
                const isSelected = l.id === selectedLaunch.id
                return (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLaunch(l)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#2a211c] text-[#f8f5ef] shadow-md'
                        : 'bg-white/80 text-[#1d1b18] hover:bg-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      l.status === 'live' ? 'bg-red-500 animate-ping' : isSelected ? 'bg-[#c79a68]' : 'bg-gray-400'
                    }`} />
                    <span className="truncate max-w-[180px]">{l.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Synchronized Countdown for Selected Launch */}
      {selectedLaunch.status === 'upcoming' && (
        <section className="py-4 px-4 max-w-3xl mx-auto">
          <CountdownTimer
            targetDate={selectedLaunch.launchDate}
            title={`Countdown to ${selectedLaunch.title}`}
            subtitle={`${selectedLaunch.launchDateFormatted} • ${selectedLaunch.launchTimeFormatted}`}
          />
        </section>
      )}

      {/* Main Launch Presentation & RSVP Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Selected Launch Overview Card (5 cols) */}
        <div className="lg:col-span-5 editorial-card p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="editorial-script text-xl text-[#c79a68]">
                Selected Launch
              </span>
              <span className="text-xs text-[#77716a]">&bull;</span>
              <span className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">
                {selectedLaunch.genre}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="relative w-24 h-36 rounded-md overflow-hidden bg-white shadow-md shrink-0 border border-[rgba(80,60,40,0.1)]">
                <Image 
                  src={selectedLaunch.coverImage || '/book.jpeg'} 
                  alt={selectedLaunch.title} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-bold text-[#1d1b18] leading-tight">
                  {selectedLaunch.title}
                </h3>
                <p className="text-xs text-[#77716a] line-clamp-2">
                  {selectedLaunch.subtitle}
                </p>
                <p className="font-serif italic text-xs text-[#c79a68]">
                  By {selectedLaunch.author}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#f8f5ef] rounded-xl border border-[rgba(80,60,40,0.08)] space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-[#1d1b18]">
                <Calendar className="w-4 h-4 text-[#c79a68] shrink-0" />
                <span className="font-medium">{selectedLaunch.launchDateFormatted}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1d1b18]">
                <Clock className="w-4 h-4 text-[#c79a68] shrink-0" />
                <span className="font-medium">{selectedLaunch.launchTimeFormatted}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[rgba(80,60,40,0.08)]">
            <Link
              href={`/book/${selectedLaunch.slug}`}
              className="editorial-btn-secondary w-full py-2.5 text-xs text-center flex items-center justify-center gap-1.5"
            >
              <span>Explore Book Details &amp; Chapters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: RSVP Registration (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!isRegistered ? (
              <motion.div
                key={`rsvp-form-${selectedLaunch.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="editorial-card p-6 sm:p-8 space-y-6 bg-white"
              >
                <div className="space-y-1">
                  <span className="editorial-script text-xl text-[#c79a68]">
                    Reserve Access
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1d1b18]">Mainstage RSVP</h3>
                  <p className="text-xs text-[#77716a] leading-relaxed">
                    Complimentary registration for <strong>{selectedLaunch.title}</strong> guarantees your streaming seat, replay video package, and author Q&amp;A submission credentials.
                  </p>
                </div>

                <form onSubmit={handleRSVPSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#77716a] uppercase tracking-wider block font-sans">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elvis Reader"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#77716a] uppercase tracking-wider block font-sans">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-sm focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="editorial-btn-primary w-full py-3 text-xs font-semibold tracking-wider cursor-pointer shadow-md mt-2"
                  >
                    Confirm Attendance for This Event
                  </button>
                </form>

                <div className="text-[10px] text-[#77716a] leading-relaxed text-center font-sans border-t border-[rgba(80,60,40,0.08)] pt-4">
                  *Automated calendar invite credentials and streaming instructions will be sent instantly.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`rsvp-success-${selectedLaunch.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="editorial-card p-8 text-center space-y-6 bg-white"
              >
                <div className="w-14 h-14 rounded-full bg-[#c79a68]/15 text-[#c79a68] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <span className="editorial-script text-xl text-[#c79a68]">You&apos;re Confirmed</span>
                  <h3 className="font-serif text-2xl font-bold text-[#1d1b18]">Seat Reserved!</h3>
                  <p className="body-text text-xs leading-relaxed">
                    Thank you! Your virtual attendance for <strong>{selectedLaunch.title}</strong> is recorded. The livestream feed is activated.
                  </p>
                </div>

                <div className="p-4 bg-[#f8f5ef] border border-[rgba(80,60,40,0.08)] rounded-xl text-xs space-y-2 text-[#77716a] text-left">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#c79a68] shrink-0" />
                    <span className="font-medium text-[#1d1b18]">{selectedLaunch.launchDateFormatted}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#c79a68] shrink-0" />
                    <span className="font-medium text-[#1d1b18]">{selectedLaunch.launchTimeFormatted}</span>
                  </div>
                </div>

                <button
                  onClick={handleResetRegistration}
                  className="text-xs text-[#77716a] hover:text-[#1d1b18] underline transition-all block mx-auto cursor-pointer"
                >
                  Change RSVP Details
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Program Schedule & Distinguished Speakers for the selected launch */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[rgba(80,60,40,0.08)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Schedule Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="eyebrow">Program Structure</span>
              <h3 className="editorial-heading text-2xl sm:text-3xl text-[#1d1b18]">
                {selectedLaunch.title} Schedule
              </h3>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l border-[#c79a68]/30 space-y-6">
              {selectedLaunch.schedule && selectedLaunch.schedule.length > 0 ? (
                selectedLaunch.schedule.map((item, index) => (
                  <div key={item.id || index} className="relative group">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#c79a68] group-hover:bg-[#c79a68] transition-colors" />
                    
                    <div className="p-4 rounded-xl bg-white border border-[rgba(80,60,40,0.08)] shadow-xs space-y-1 group-hover:border-[#c79a68]/30 transition-colors">
                      <span className="text-xs font-semibold text-[#c79a68] font-mono tracking-wider">
                        {item.time}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#1d1b18]">
                        {item.activity}
                      </h4>
                      {item.speaker && (
                        <p className="text-xs text-[#77716a] font-sans">
                          Presented by: <span className="text-[#1d1b18] font-medium">{item.speaker}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#77716a]">Schedule details will be announced shortly.</p>
              )}
            </div>
          </div>

          {/* Speakers Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1">
              <span className="eyebrow">Distinguished Guests</span>
              <h3 className="editorial-heading text-2xl sm:text-3xl text-[#1d1b18]">
                Featured Speakers
              </h3>
            </div>

            <div className="space-y-4">
              {selectedLaunch.speakers && selectedLaunch.speakers.length > 0 ? (
                selectedLaunch.speakers.map((speaker) => (
                  <div
                    key={speaker.name}
                    className="editorial-card p-4 flex items-start gap-4 hover:border-[#c79a68]/40"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#2a211c] text-[#f8f5ef] font-serif font-bold flex items-center justify-center shrink-0 text-sm shadow-sm">
                      {speaker.initials}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-base text-[#1d1b18]">
                        {speaker.name}
                      </h4>
                      <p className="text-[11px] font-sans text-[#c79a68] uppercase tracking-wider font-semibold">
                        {speaker.title}
                      </p>
                      <p className="body-text text-xs text-[#77716a] leading-relaxed">
                        {speaker.bio}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#77716a]">Speakers will be announced shortly.</p>
              )}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
