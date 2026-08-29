'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How do I attend the launch event?',
    answer: 'You can register for the launch event on our website. This is a 100% virtual event, and streaming details will be sent directly to your registered email address before the event.',
  },
  {
    question: 'Is the launch event free?',
    answer: 'Yes, virtual attendance for the main launch stream is completely free! Simply register to receive your streaming link.',
  },
  {
    question: 'Can I watch the event later if I miss it live?',
    answer: 'Yes! The launch event stream will be recorded and available for all registered participants to watch on-demand for 30 days after the event.',
  },
  {
    question: 'How do I purchase the book?',
    answer: 'You can purchase JUST ELVIS JUSTICE by Dr. Elvis Justice Bedi directly through our online store in digital eBook formats, high-fidelity Audiobook, and deluxe virtual experience bundles.',
  },
  {
    question: 'Will signed copies be available?',
    answer: 'Since this is a virtual-only launch, we are offering digitally-signed editions of the Author\'s Cut and Complete Virtual Experience Bundle, which include a high-resolution, digitally signed digital bookplate.',
  },
  {
    question: 'How do I receive my digital files?',
    answer: 'Immediately upon checkout or book release, you will receive a secure download link via email. You can download the files in EPUB, PDF, and MP3 formats as many times as you need.',
  },
  {
    question: 'Are there physical copies or shipping?',
    answer: 'No, this is a virtual-only release. There are no physical copies, printing, or shipping involved, keeping this launch 100% eco-friendly and instantly accessible worldwide.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay for secure digital transactions.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section id="faq" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about the book, event, and store.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="border border-border rounded-lg overflow-hidden hover:border-accent transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors"
              >
                <h3 className="text-lg font-semibold text-foreground text-left">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-accent" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 bg-card/50 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, color: '#d4af37' }}
            className="inline-block font-semibold text-accent transition-colors"
          >
            Contact us
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
