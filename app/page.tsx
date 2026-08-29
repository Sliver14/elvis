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

export default function Page() {
  const [showPrelaunch, setShowPrelaunch] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem('aurora_prelaunch_skipped') === 'true') {
      setShowPrelaunch(false)
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
          <PrelaunchScreen onComplete={handleComplete} />
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

