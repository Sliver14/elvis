'use client'

import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Star, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  Calendar, 
  Clock, 
  Video, 
  Tv, 
  CheckCircle2, 
  Compass, 
  Target, 
  Feather, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react'
import { 
  getStoredLaunches, 
  getLaunchBySlug, 
  BookLaunch, 
  saveRSVP 
} from '@/lib/data-store'
import { useCart } from '@/lib/cart-context'
import PrelaunchScreen from '@/components/prelaunch-screen'
import BookTrailer from '@/components/book-trailer'
import TestimonialsSection from '@/components/testimonials-section'
import CountdownTimer from '@/components/countdown-timer'
import Footer from '@/components/footer'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function DynamicBookLaunchPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug

  const [launch, setLaunch] = useState<BookLaunch | null>(null)
  const [allLaunches, setAllLaunches] = useState<BookLaunch[]>([])
  const [showPrelaunch, setShowPrelaunch] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const { addToCart, setShowCart } = useCart()

  useEffect(() => {
    setMounted(true)
    const launches = getStoredLaunches()
    setAllLaunches(launches)
    const found = launches.find(l => l.slug === slug) || launches[0]
    setLaunch(found)

    if (found) {
      const launchTimestamp = new Date(found.launchDate || '2026-07-21T18:00:00').getTime()
      const isPastDue = Date.now() >= launchTimestamp || found.status === 'completed'
      const skipped = sessionStorage.getItem(`aurora_prelaunch_skipped_${found.slug}`) === 'true'

      if (isPastDue || skipped) {
        setShowPrelaunch(false)
      } else {
        setShowPrelaunch(true)
      }

      // Check if user already registered for this launch
      const regKey = `aurora_rsvp_${found.slug}`
      if (localStorage.getItem(regKey) === 'true') {
        setIsRegistered(true)
      } else {
        setIsRegistered(false)
      }
    }
  }, [slug])

  if (!launch || !mounted) {
    return (
      <main className="bg-[#f8f5ef] text-[#1d1b18] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="editorial-script text-3xl text-[#c79a68]">Loading Book Launch...</span>
          <div className="w-8 h-8 border-2 border-[#c79a68] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </main>
    )
  }

  const launchTimestamp = new Date(launch.launchDate || '2026-07-21T18:00:00').getTime()
  const isPastDue = Date.now() >= launchTimestamp || launch.status === 'completed'

  const handleEnterLaunch = () => {
    sessionStorage.setItem(`aurora_prelaunch_skipped_${launch.slug}`, 'true')
    setShowPrelaunch(false)
  }

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !launch) return
    saveRSVP(launch, name, email)
    setIsRegistered(true)
  }

  const handleResetRegistration = () => {
    if (!launch) return
    localStorage.removeItem(`aurora_rsvp_${launch.slug}`)
    setIsRegistered(false)
    setName('')
    setEmail('')
  }

  const otherLaunches = allLaunches.filter(l => l.slug !== launch.slug)

  return (
    <AnimatePresence mode="wait">
      {showPrelaunch && !isPastDue ? (
        <motion.div
          key="launch-prelaunch-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <PrelaunchScreen 
            launch={launch} 
            onComplete={handleEnterLaunch} 
            showEnterButton={true}
          />
        </motion.div>
      ) : (
        <motion.main 
          key="launch-mainstage-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-[#f8f5ef] text-[#1d1b18] min-h-screen selection:bg-[#f1ece3]"
        >
          {/* Top Breadcrumb & Status Bar */}
          <div className="bg-[#f1ece3]/70 border-b border-[rgba(80,60,40,0.08)] py-3 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#77716a]">
                <Link href="/book" className="hover:text-[#1d1b18] transition-colors font-sans">
                  Books &amp; Launches
                </Link>
                <span>/</span>
                <span className="font-serif font-semibold text-[#1d1b18]">{launch.title}</span>
              </div>

              <div className="flex items-center gap-3">
                {!isPastDue && (
                  <button
                    onClick={() => {
                      sessionStorage.removeItem(`aurora_prelaunch_skipped_${launch.slug}`)
                      setShowPrelaunch(true)
                    }}
                    className="text-[10px] uppercase tracking-wider font-semibold text-[#c79a68] hover:underline flex items-center gap-1 font-sans cursor-pointer"
                  >
                    <Clock className="w-3 h-3" /> View Countdown
                  </button>
                )}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans ${
                  launch.status === 'upcoming'
                    ? 'bg-[#c79a68]/15 text-[#c79a68]'
                    : launch.status === 'live'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#2a211c] text-[#f8f5ef]'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {launch.status === 'upcoming' 
                    ? `Launch Premiere: ${launch.launchDateFormatted}` 
                    : launch.status === 'live' 
                    ? 'Live Premiere Broadcast' 
                    : 'Recorded Replay Available'}
                </span>
                {launch.inStore && (
                  <Link href="/store" className="text-[10px] font-semibold text-[#c79a68] hover:underline flex items-center gap-1 font-sans">
                    <ShoppingBag className="w-3 h-3" /> Available in Store
                  </Link>
                )}
              </div>
            </div>
          </div>

      {/* Main Book Hero Section */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: 3D Floating Book & Format Selector (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col items-center justify-start space-y-8"
          >
            {/* 3D Floating Book Container */}
            <div className="relative">
              {/* Gold Starburst Badge */}
              <div className="gold-seal-badge -top-4 -right-4 shadow-xl">
                <span>{launch.status === 'upcoming' ? 'PRE' : 'OFFICIAL'}</span>
                <span className="text-[10px] tracking-widest font-bold">RELEASE</span>
                <span className="text-[7px] text-[#f8f5ef]/90">★ 2026 ★</span>
              </div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotateY: [-3, 3, -3],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-56 h-80 sm:w-68 sm:h-96 md:w-76 md:h-[440px] rounded-r-xl overflow-hidden shadow-[25px_32px_55px_-10px_rgba(42,33,28,0.32)] border-y border-r border-[#ffffff]/40 bg-white"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-gradient-to-r from-black/25 via-transparent to-white/10 z-20 pointer-events-none" />
                <Image
                  src={launch.coverImage || '/book.jpeg'}
                  alt={`${launch.title} Cover`}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Formats Grid */}
            <div className="w-full max-w-md space-y-3">
              <span className="eyebrow block text-center">Available Launch Editions</span>
              <div className="grid grid-cols-2 gap-3">
                {launch.formats.map((fmt) => (
                  <div 
                    key={fmt.name} 
                    className="p-3.5 rounded-2xl border border-[rgba(80,60,40,0.10)] bg-white shadow-2xs space-y-1 text-left flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#c79a68] font-sans">
                        {fmt.type === 'digital' ? 'Digital Edition' : 'Collector Print'}
                      </p>
                      <p className="text-xs font-bold text-[#1d1b18] leading-snug">{fmt.name}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(80,60,40,0.06)]">
                      <span className="font-serif font-bold text-sm text-[#1d1b18]">${fmt.price.toFixed(2)}</span>
                      <button
                        onClick={() => {
                          addToCart({
                            id: `${launch.slug}-${fmt.id || fmt.type}`,
                            name: `${launch.title} (${fmt.name})`,
                            book: launch.title,
                            price: fmt.price,
                            image: launch.coverImage || '/book.jpeg',
                            description: fmt.description || launch.subtitle,
                            category: launch.status === 'upcoming' ? 'Pre-Order' : 'Launch Edition',
                            type: fmt.type
                          })
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#c79a68] hover:text-[#2a211c] cursor-pointer"
                      >
                        + Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f1ece3]/70 border border-[rgba(80,60,40,0.08)] text-center w-full max-w-md space-y-1">
              <span className="editorial-script text-lg text-[#c79a68] block">Global Launch Fulfillment</span>
              <p className="text-xs text-[#77716a]">Direct digital download delivery and global print courier distribution.</p>
            </div>
          </motion.div>

          {/* Right Column: Title, Synopsis, Chapters & Specs (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
                  Official Book Launch
                </span>
                <span className="text-xs text-[#77716a]">&bull;</span>
                <span className="text-[10px] uppercase tracking-widest text-[#77716a] font-sans font-semibold">
                  {launch.genre}
                </span>
              </div>
              <h1 className="editorial-display text-3xl sm:text-5xl md:text-6xl text-[#1d1b18]">
                {launch.title}
              </h1>
              <p className="editorial-subheading text-lg sm:text-xl text-[#c79a68]">
                {launch.subtitle}
              </p>
            </div>

            {/* Author Byline */}
            <div className="flex items-center gap-2 text-sm text-[#77716a]">
              <span className="font-sans text-xs uppercase tracking-wider text-[#c79a68] font-semibold">Written by</span>
              <span className="font-serif font-bold text-[#1d1b18] text-base">{launch.author}</span>
              <span className="text-xs text-[#77716a]/50">&bull;</span>
              <span className="font-sans text-xs text-[#77716a]">{launch.pagesCount} Pages</span>
            </div>

            {/* Synopsis Paragraphs */}
            <div className="space-y-4 body-text text-[#77716a] text-base leading-relaxed">
              {launch.synopsis.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Quote block */}
            {launch.quote && (
              <div className="p-5 rounded-2xl bg-[#f1ece3]/60 border-l-4 border-[#c79a68] italic font-serif text-base text-[#1d1b18]">
                &ldquo;{launch.quote}&rdquo;
              </div>
            )}

            {/* Core Chapter Breakdown */}
            {launch.chapters && launch.chapters.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[rgba(80,60,40,0.10)]">
                <span className="eyebrow">Key Chapters &amp; Structure</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {launch.chapters.map((chap) => (
                    <div key={chap.num} className="p-4 rounded-xl bg-white border border-[rgba(80,60,40,0.08)] space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#c79a68] tracking-widest">{chap.num}</span>
                      <h4 className="font-serif font-bold text-sm text-[#1d1b18]">{chap.title}</h4>
                      <p className="text-xs text-[#77716a] leading-relaxed">{chap.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Book Specifications Table */}
            {launch.specs && launch.specs.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[rgba(80,60,40,0.10)]">
                <h3 className="font-serif text-xl font-bold text-[#1d1b18]">Specifications &amp; Publication Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {launch.specs.map((spec) => (
                    <div key={spec.label} className="border-b border-[rgba(80,60,40,0.08)] pb-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-[#77716a] font-semibold block font-sans">{spec.label}</span>
                      <span className="text-[#1d1b18] font-medium font-serif text-sm mt-0.5 block">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action CTAs */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link 
                href="/event" 
                className="editorial-btn-primary group"
              >
                <span>Virtual Launch Mainstage</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/store" className="editorial-btn-secondary">
                Visit Bookstore Catalog
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Countdown Section for this Launch */}
      {launch.status === 'upcoming' && (
        <section className="py-8 px-4 max-w-4xl mx-auto">
          <CountdownTimer 
            targetDate={launch.launchDate}
            title={`Countdown to ${launch.title} Premiere`}
            subtitle={`${launch.launchDateFormatted} • ${launch.launchTimeFormatted}`}
          />
        </section>
      )}

      {/* Schedule & Speakers for this specific launch */}
      {((launch.schedule && launch.schedule.length > 0) || (launch.speakers && launch.speakers.length > 0)) && (
        <section id="launch-schedule" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#f1ece3]/40 border-y border-[rgba(80,60,40,0.08)]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
                Launch Itinerary
              </span>
              <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
                Schedule &amp; Speakers
              </h2>
              <p className="body-text text-sm sm:text-base text-[#77716a]">
                Explore the itinerary, keynote addresses, and guest panel discussions for *{launch.title}*.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
              {/* Schedule timeline */}
              {launch.schedule && launch.schedule.length > 0 && (
                <div className={`${launch.speakers && launch.speakers.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
                  <div className="space-y-1">
                    <span className="eyebrow">Program Structure</span>
                    <h3 className="editorial-heading text-2xl font-bold text-[#1d1b18]">
                      Launch Timeline
                    </h3>
                  </div>

                  <div className="relative pl-6 sm:pl-8 border-l border-[#c79a68]/30 space-y-6">
                    {launch.schedule.map((item, index) => (
                      <div key={item.id || index} className="relative group">
                        <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#c79a68] group-hover:bg-[#c79a68] transition-colors" />
                        
                        <div className="p-4 rounded-xl bg-white border border-[rgba(80,60,40,0.08)] shadow-xs space-y-1">
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
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers panel */}
              {launch.speakers && launch.speakers.length > 0 && (
                <div className={`${launch.schedule && launch.schedule.length > 0 ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-6`}>
                  <div className="space-y-1">
                    <span className="eyebrow">Guest Panelists</span>
                    <h3 className="editorial-heading text-2xl font-bold text-[#1d1b18]">
                      Distinguished Speakers
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {launch.speakers.map((speaker) => (
                      <div
                        key={speaker.name}
                        className="editorial-card p-4 flex items-start gap-4 hover:border-[#c79a68]/40"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#2a211c] text-[#f8f5ef] font-serif font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                          {speaker.initials}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif font-bold text-sm text-[#1d1b18]">
                            {speaker.name}
                          </h4>
                          <p className="text-[10px] font-sans text-[#c79a68] uppercase tracking-wider font-semibold">
                            {speaker.title}
                          </p>
                          <p className="body-text text-xs text-[#77716a] leading-relaxed">
                            {speaker.bio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Book Trailer Section */}
      <BookTrailer 
        trailerUrl={launch.trailerUrl} 
        title={`Cinematic Trailer: ${launch.title}`}
        bookTitle={launch.title}
      />

      {/* Explore Other Book Launches Cross-navigation */}
      {otherLaunches.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[rgba(80,60,40,0.10)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <span className="editorial-script text-2xl text-[#c79a68]">Literary Catalog</span>
              <h3 className="editorial-heading text-2xl sm:text-3xl text-[#1d1b18]">Other Book Launches</h3>
            </div>
            <Link href="/book" className="editorial-btn-secondary py-2 px-5 text-xs">
              View All Launches &amp; Volumes
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherLaunches.map((other) => (
              <div key={other.id} className="editorial-card p-6 flex flex-col justify-between space-y-4 hover:border-[#c79a68]/40">
                <div className="flex gap-4 items-start">
                  <div className="relative w-16 h-24 rounded-md overflow-hidden bg-white shadow-md shrink-0 border border-[rgba(80,60,40,0.1)]">
                    <Image src={other.coverImage} alt={other.title} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#c79a68] font-sans">{other.genre}</span>
                    <h4 className="font-serif font-bold text-base text-[#1d1b18] leading-tight">{other.title}</h4>
                    <p className="text-[11px] text-[#77716a] line-clamp-2">{other.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[rgba(80,60,40,0.06)]">
                  <span className="text-[10px] uppercase font-semibold text-[#77716a] font-sans">{other.launchDateFormatted}</span>
                  <Link href={`/book/${other.slug}`} className="text-xs font-bold text-[#c79a68] hover:underline flex items-center gap-1">
                    Launch Room <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Endorsements Section */}
      <TestimonialsSection />

      <Footer />
    </motion.main>
      )}
    </AnimatePresence>
  )
}
