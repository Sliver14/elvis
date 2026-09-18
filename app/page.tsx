'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PrelaunchScreen from '@/components/prelaunch-screen'
import HeroSection from '@/components/hero-section'
import AboutSection from '@/components/about-section'
import TestimonialsSection from '@/components/testimonials-section'
import FAQSection from '@/components/faq-section'
import NewsletterSection from '@/components/newsletter-section'
import Footer from '@/components/footer'
import { getStoredLaunches, defaultBookLaunches, BookLaunch } from '@/lib/data-store'

export default function Page() {
  const [featuredLaunch, setFeaturedLaunch] = useState<BookLaunch>(defaultBookLaunches[0])
  const [showPrelaunch, setShowPrelaunch] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const launches = getStoredLaunches()
    const found = launches.find(l => l.isFeatured) || launches[0] || defaultBookLaunches[0]
    setFeaturedLaunch(found)

    const launchTimestamp = new Date(found.launchDate || '2026-07-21T18:00:00').getTime()
    const isPastDue = Date.now() >= launchTimestamp || found.status === 'completed'
    const skipped = sessionStorage.getItem('aurora_prelaunch_skipped') === 'true'

    if (isPastDue || skipped) {
      setShowPrelaunch(false)
    } else {
      setShowPrelaunch(true)
    }
  }, [])

  const handleComplete = () => {
    sessionStorage.setItem('aurora_prelaunch_skipped', 'true')
    setShowPrelaunch(false)
  }

  if (!mounted) {
    return <div className="bg-[#fbf9f6] min-h-screen" />
  }

  return (
    <AnimatePresence mode="wait">
      {showPrelaunch ? (
        <motion.div
          key="prelaunch"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          <PrelaunchScreen launch={featuredLaunch} onComplete={handleComplete} />
        </motion.div>
      ) : (
        <motion.main
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-background text-foreground"
        >
          <HeroSection />
          <AboutSection />
          <TestimonialsSection />
          <FAQSection />
          <NewsletterSection />
          <Footer />
        </motion.main>
      )}
    </AnimatePresence>
  )
}

