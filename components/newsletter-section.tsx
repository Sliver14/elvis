'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Store in localStorage for admin subscriber list
      const subscribers = JSON.parse(localStorage.getItem('aurora_subscribers') || '[]')
      subscribers.push({ email, date: new Date().toLocaleDateString() })
      localStorage.setItem('aurora_subscribers', JSON.stringify(subscribers))

      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 4000)
    }
  }

  return (
    <section id="newsletter" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#f1ece3]/60 relative overflow-hidden">
      <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
        
        <div className="space-y-3">
          <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
            Stay Connected
          </span>
          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
            Join the Reader&apos;s Circle
          </h2>
          <p className="body-text text-sm sm:text-base text-[#77716a] max-w-xl mx-auto">
            Receive exclusive author reflections, chapter excerpts, private invitations to virtual masterclasses, and early access to upcoming releases.
          </p>
        </div>

        {/* Newsletter Subscription Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
        >
          <div className="relative w-full">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c79a68] pointer-events-none" />
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-[rgba(80,60,40,0.15)] text-[#1d1b18] placeholder-[#77716a]/70 font-sans text-sm focus:outline-none focus:border-[#c79a68] focus:ring-2 focus:ring-[#c79a68]/20 shadow-xs transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="editorial-btn-primary w-full sm:w-auto py-3.5 px-7 whitespace-nowrap text-xs font-semibold tracking-wider shrink-0 cursor-pointer disabled:opacity-80"
          >
            {submitted ? 'Subscribed' : 'Join Circle'}
          </button>
        </form>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#c79a68]/30 text-[#c79a68] text-xs font-semibold shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Welcome to the Reader&apos;s Circle. Check your inbox for your welcome note.</span>
          </motion.div>
        )}

        <p className="text-[11px] text-[#77716a]/80 font-sans">
          We respect your privacy. No spam, ever. Unsubscribe with one click anytime.
        </p>

      </div>
    </section>
  )
}
