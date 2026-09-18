'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    question: 'How do I attend the virtual launch event?',
    answer: 'You can register directly on our Launch Event portal. This is a 100% virtual broadcast, and streaming credentials along with calendar invites will be dispatched to your email address prior to the live stream.',
  },
  {
    question: 'Is attendance for the global launch free?',
    answer: 'Yes, registration and live stream attendance for the virtual event are completely free! Simply RSVP to secure your personalized broadcast feed.',
  },
  {
    question: 'Can I rewatch the event if I cannot attend live?',
    answer: 'All registered participants will receive exclusive on-demand access to the complete recorded keynote, author reading, and panel sessions for 30 days post-launch.',
  },
  {
    question: 'What book formats are available?',
    answer: 'JUST ELVIS JUSTICE is published in premium Hardcover (with custom gold foil dust jacket), collector Paperback, high-fidelity Audiobook, and instant digital eBook (PDF & EPUB) formats.',
  },
  {
    question: 'How do I receive digital downloads upon checkout?',
    answer: 'Immediately following checkout, you will receive a secure instant download panel on your screen as well as direct download links delivered to your inbox.',
  },
  {
    question: 'What international shipping options are supported for print editions?',
    answer: 'We offer tracked global courier dispatch to over 140 countries. Standard delivery averages 4–8 business days depending on location.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#f8f5ef]">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
            Inquiries
          </span>
          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
            Frequently Asked Questions
          </h2>
          <p className="body-text text-sm sm:text-base text-[#77716a] max-w-lg mx-auto">
            Everything you need to know regarding the book launch, order fulfillments, and virtual broadcast access.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="editorial-card overflow-hidden border border-[rgba(80,60,40,0.10)] transition-colors hover:border-[#c79a68]/40"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left bg-white transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg font-bold text-[#1d1b18] pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#f1ece3] text-[#c79a68] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#c79a68] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="px-6 pb-6 pt-2 text-[#77716a] body-text text-sm leading-relaxed border-t border-[rgba(80,60,40,0.06)] bg-[#faf8f5]"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact fallback */}
        <div className="text-center pt-4">
          <p className="text-sm text-[#77716a]">
            Have an unanswered question or press inquiry?{' '}
            <Link
              href="/contact"
              className="text-[#c79a68] font-semibold underline hover:text-[#2a211c] transition-colors"
            >
              Contact the author desk
            </Link>
          </p>
        </div>

      </div>
    </section>
  )
}
