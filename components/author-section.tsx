'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Globe, ArrowRight, BookOpen, Award, Compass, Sparkles } from 'lucide-react'

export default function AuthorSection() {
  const achievements = [
    { number: '3', label: 'Bestselling Volumes' },
    { number: '150K+', label: 'Global Readers' },
    { number: '40+', label: 'Countries Reached' },
  ]

  const previousWorks = [
    {
      title: 'The Silent Echo',
      year: '2023',
      genre: 'Leadership & Mindset',
      desc: 'An internationally acclaimed study on strategic restraint and focus.'
    },
    {
      title: 'Whispers of Time',
      year: '2024',
      genre: 'Personal Sovereignty',
      desc: 'Mastering high-stakes decision making in chaotic environments.'
    },
    {
      title: 'The Last Garden',
      year: '2025',
      genre: 'Philosophy & Venture',
      desc: 'Constructing enduring systems of wealth and personal freedom.'
    }
  ]

  return (
    <section id="author" className="pt-8 sm:pt-10 md:pt-12 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 bg-[#f8f5ef]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Arched Portrait Showcase (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Decorative background aura */}
              <div className="absolute inset-0 bg-[#c79a68]/15 " />

              {/* Signature Arched Portrait Frame */}
              <div className="relative w-72 h-[420px] sm:w-80 sm:h-[470px] bg-[#f1ece3] shadow-2xl">
                <Image
                  src="/author.jpeg"
                  alt="Dr. Elvis Justice Bedi Portrait"
                  fill
                  priority
                  className="object-cover object-top hover:scale-103 transition-transform duration-700"
                />
              </div>

              {/* Floating Signature Tag */}
              {/* <div className="absolute -bottom-4 right-2 sm:-right-4 bg-white px-5 py-2.5 rounded-full border border-[rgba(80,60,40,0.12)] shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c79a68]" />
                <span className="editorial-script text-lg text-[#1d1b18]">Dr. Elvis Justice Bedi</span>
              </div> */}
            </div>
          </div>

          {/* Right Column: Author Editorial Bio (7 cols) */}
          <div className="lg:col-span-7 space-y-8">

            <div className="space-y-2">
              <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
                The Author
              </span>
              <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
                Dr. Elvis Justice Bedi
              </h2>
              <p className="font-serif italic text-lg text-[#c79a68]">
                Venture Strategist, Mentor &amp; Internationally Acclaimed Author
              </p>
            </div>

            <div className="space-y-4 body-text text-[#77716a] text-base leading-relaxed">
              <p>
                Dr. Elvis Justice Bedi is a pioneering global entrepreneur, high-performance educator, and author whose writings have inspired hundreds of thousands of readers across the globe.
              </p>
              <p>
                Bridging the intersection between psychological endurance, rigorous market discipline, and sovereign living, Dr. Elvis transforms complex performance frameworks into actionable, life-altering philosophy.
              </p>
            </div>

            {/* Achievements stats grid */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-[rgba(80,60,40,0.10)] text-center">
              {achievements.map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="font-serif text-3xl sm:text-4xl font-bold text-[#c79a68]">
                    {item.number}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#77716a]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Previous Works List */}
            <div className="space-y-4">
              <span className="eyebrow">Selected Bibliography</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {previousWorks.map((work) => (
                  <div key={work.title} className="p-4 rounded-xl bg-white border border-[rgba(80,60,40,0.08)] space-y-1">
                    <p className="font-serif font-bold text-sm text-[#1d1b18]">{work.title}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[#c79a68] font-semibold">{work.year} &bull; {work.genre}</p>
                    <p className="text-xs text-[#77716a] line-clamp-2">{work.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/contact" className="editorial-btn-dark">
                Speaking &amp; Media Inquiries
              </Link>
              <Link href="/store" className="editorial-btn-secondary">
                View All Published Titles
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
