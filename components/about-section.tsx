'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Compass, Target, Feather, ArrowRight, Check, ShoppingBag, Tv } from 'lucide-react'
import { getStoredLaunches, getFeaturedLaunch, BookLaunch } from '@/lib/data-store'

const defaultHighlights = [
  {
    number: '01',
    icon: Compass,
    title: 'Mindset Architecture',
    description: 'Systematic frameworks to dismantle limiting conditioning and build unshakable mental discipline.',
  },
  {
    number: '02',
    icon: Target,
    title: 'High-Stakes Execution',
    description: 'Practical playbooks drawn from global venture strategy to execute high-impact decisions daily.',
  },
  {
    number: '03',
    icon: Feather,
    title: 'Lyrical Narrative',
    description: 'Compelling autobiographical lessons woven with profound philosophies on personal sovereignty.',
  },
  {
    number: '04',
    icon: BookOpen,
    title: 'Global Performance Edge',
    description: 'Proven tactics utilized by elite achievers and industry leaders across multiple continents.',
  },
]

export default function AboutSection() {
  const [featuredLaunch, setFeaturedLaunch] = useState<BookLaunch | null>(null)

  useEffect(() => {
    setFeaturedLaunch(getFeaturedLaunch())
  }, [])

  const launch = featuredLaunch || {
    title: 'The Weight of Quiet Hearts',
    subtitle: 'Where ambition, human mastery, and relentless focus meet the edge of destiny.',
    author: 'Dr. Elvis Justice Bedi',
    coverImage: '/book.jpeg',
    quote: 'True freedom is not found in ease, but in deliberate mastery.',
    pagesCount: 384,
    synopsis: [
      'The Weight of Quiet Hearts by Dr. Elvis Justice Bedi is an intimate yet commanding manifesto on breaking internal barriers, mastering daily discipline, and designing an unyielding life.'
    ]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section id="about" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#f8f5ef]">
      <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
            Synopsis
          </span>
          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
            The Journey Within
          </h2>
          <p className="body-text text-[#77716a] text-base md:text-lg">
            *{launch.title}* by {launch.author} is an intimate yet commanding manifesto on breaking internal barriers, mastering daily discipline, and designing an unyielding life.
          </p>
        </div>

        {/* 2-Column Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Book & Quote Showcase (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-6 sm:p-8 bg-[#f1ece3]/70 rounded-3xl border border-[rgba(80,60,40,0.08)] shadow-[0_10px_30px_rgba(50,35,20,0.04)] text-center w-full max-w-md">
              <span className="editorial-script text-xl text-[#c79a68] block mb-4">
                &ldquo;For Those Who Dare to Lead&rdquo;
              </span>

              {/* Floating Book Cover */}
              <div className="relative mx-auto w-48 h-72 sm:w-56 sm:h-80 rounded-r-lg overflow-hidden shadow-[20px_25px_45px_-8px_rgba(42,33,28,0.3)] border border-[#ffffff]/50 bg-white mb-6">
                <Image
                  src={launch.coverImage || '/book.jpeg'}
                  alt={`${launch.title} Mockup`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <p className="font-serif font-bold text-lg text-[#1d1b18]">{launch.author}</p>
                <p className="text-xs uppercase tracking-widest text-[#c79a68] font-semibold">
                  {launch.pagesCount} Pages &bull; First Edition &bull; 2026
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text & Bullet Points (7 cols) */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="space-y-2">
              <span className="eyebrow">A Note from the Author</span>
              <h3 className="editorial-heading text-2xl sm:text-3xl text-[#1d1b18]">
                &ldquo;{launch.quote || 'True freedom is not found in ease, but in deliberate mastery.'}&rdquo;
              </h3>
            </div>

            <div className="space-y-4 body-text text-[#77716a] text-base">
              <p>
                Through years of pioneering international ventures and mentoring thousands across the globe, Dr. Elvis shares the exact mental operating principles that separate passive dreamers from relentless executors.
              </p>
              <p>
                Each chapter functions as an architectural blueprint—deconstructing fear, sharpening daily focus, calibrating emotional endurance, and executing high-yield decisions with unwavering clarity.
              </p>
            </div>

            {/* Core takeaways checklist */}
            <div className="space-y-3 pt-2">
              {[
                'The Psychology of Quiet Conviction and Strategic Patience',
                'Constructing High-Velocity Execution Systems for Career & Life',
                'Transforming Psychological Roadblocks into Strategic Leverage',
                'The Art of Uncompromising Focus in a Distracted World'
              ].map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c79a68]/15 text-[#c79a68] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-sm text-[#1d1b18] font-medium leading-tight">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link
                href="/store"
                className="editorial-btn-dark group"
              >
                <ShoppingBag className="w-4 h-4 mr-2 text-[#c79a68]" />
                <span>Explore Bookstore Editions</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/event"
                className="editorial-btn-secondary"
              >
                <Tv className="w-4 h-4 mr-1.5 text-[#c79a68]" />
                <span>Book Launch Event Stage</span>
              </Link>
            </div>
          </div>

        </div>

        {/* 4 Feature Information Blocks (Editorial cards) */}
        <div className="space-y-8 pt-8">
          <div className="text-center">
            <span className="eyebrow">Core Pillars</span>
            <h3 className="editorial-heading text-2xl sm:text-3xl text-[#1d1b18] mt-1">
              What Sets This Volume Apart
            </h3>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {defaultHighlights.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="editorial-card p-7 flex flex-col justify-between space-y-4 group hover:border-[#c79a68]/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#f1ece3] text-[#c79a68] flex items-center justify-center group-hover:bg-[#c79a68] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-serif text-sm font-semibold text-[#c79a68]/60 tracking-wider">
                      {item.number}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif text-lg font-bold text-[#1d1b18]">
                      {item.title}
                    </h4>
                    <p className="body-text text-xs text-[#77716a] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
