'use client'

import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  {
    name: 'Sarah Jenkins',
    title: 'Executive Leadership Coach & Bestselling Author',
    rating: 5,
    text: 'JUST ELVIS JUSTICE is a tour de force in modern personal strategy. Dr. Elvis provides not just inspirational depth, but the exact architectural blueprints required to command peak performance.',
    avatar: 'SJ',
  },
  {
    name: 'Marcus Vance',
    title: 'Managing Director, Global Capital Ventures',
    rating: 5,
    text: 'A profound, fiercely written volume on discipline and sovereign decision-making. The mental models in Chapter 4 alone altered how I direct our executive leadership team.',
    avatar: 'MV',
  },
  {
    name: 'Dr. Elena Rostova',
    title: 'Professor of Behavioral Psychology',
    rating: 5,
    text: 'Lyrical, rigorous, and deeply transformative. This book transcends standard personal development—it is an enduring manual of self-mastery for the next generation of global leaders.',
    avatar: 'ER',
  },
  {
    name: 'David K. Osei',
    title: 'Tech Founder & Keynote Speaker',
    rating: 5,
    text: 'Dr. Elvis writes with razor-sharp precision and genuine heart. Reading this manuscript gave me the clarity to completely restructure my business and personal focus.',
    avatar: 'DO',
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
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#f1ece3]/50 relative overflow-hidden">
      {/* Background quote mark decoration */}
      <div className="absolute top-10 right-10 text-[#c79a68]/10 select-none pointer-events-none">
        <Quote className="w-64 h-64" />
      </div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2">
          <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
            Endorsements
          </span>
          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
            What Readers Are Saying
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#77716a] font-sans font-semibold">
            Early Reviews &amp; Industry Praise
          </p>
        </div>

        {/* Testimonial Quotation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-white border border-[rgba(80,60,40,0.10)] shadow-[0_15px_35px_rgba(50,35,20,0.06)] text-center space-y-8">
            
            {/* Stars */}
            <div className="flex justify-center items-center gap-1.5">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#c79a68] text-[#c79a68]" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif italic text-[#1d1b18] leading-relaxed max-w-3xl mx-auto">
              &ldquo;{testimonials[current].text}&rdquo;
            </blockquote>

            {/* Author Attribution */}
            <div className="space-y-1 pt-4 border-t border-[rgba(80,60,40,0.08)] max-w-sm mx-auto">
              <p className="font-serif text-lg font-bold text-[#1d1b18]">
                {testimonials[current].name}
              </p>
              <p className="text-xs font-sans text-[#c79a68] font-medium tracking-wide">
                {testimonials[current].title}
              </p>
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-[rgba(80,60,40,0.18)] bg-white hover:border-[#c79a68] hover:bg-[#c79a68] hover:text-white text-[#1d1b18] flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current ? 'w-6 bg-[#c79a68]' : 'w-2 bg-[rgba(80,60,40,0.2)] hover:bg-[#c79a68]/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-[rgba(80,60,40,0.18)] bg-white hover:border-[#c79a68] hover:bg-[#c79a68] hover:text-white text-[#1d1b18] flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </motion.div>

      </div>
    </section>
  )
}
