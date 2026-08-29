'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    title: 'Book Enthusiast',
    rating: 5,
    text: 'JUST ELVIS JUSTICE is a masterpiece. Dr. Elvis has crafted a narrative that stays with you long after the final page.',
    avatar: 'SJ',
  },
  {
    name: 'Michael Chen',
    title: 'Literature Professor',
    rating: 5,
    text: 'A profound exploration of identity and transformation. I\'ve assigned it to all my advanced literature classes.',
    avatar: 'MC',
  },
  {
    name: 'Emma Williams',
    title: 'Journalist',
    rating: 5,
    text: 'Captivating from start to finish. This book deserves to be on every shelf. Simply extraordinary.',
    avatar: 'EW',
  },
  {
    name: 'James Mitchell',
    title: 'Photographer',
    rating: 5,
    text: 'The lyrical prose paints vivid pictures in the mind. A true work of art that transcends the written word.',
    avatar: 'JM',
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="pt-10 pb-20 md:pt-16 md:pb-32 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 text-balance">
            What Readers Are Saying
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          {/* Testimonial Card */}
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 md:p-12 rounded-2xl border border-border bg-background text-center space-y-6"
          >
            {/* Stars */}
            <div className="flex justify-center gap-1">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground text-balance">
              &quot;{testimonials[current].text}&quot;
            </blockquote>

            {/* Author */}
            <div>
              <p className="text-lg font-semibold text-foreground">
                {testimonials[current].name}
              </p>
              <p className="text-sm text-accent">{testimonials[current].title}</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border hover:border-accent hover:bg-accent/5 flex items-center justify-center transition-all"
            >
              ←
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === current ? 'bg-accent' : 'bg-border'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-12 h-12 rounded-full border border-border hover:border-accent hover:bg-accent/5 flex items-center justify-center transition-all"
            >
              →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
