'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Globe, Video, Clock, ArrowRight, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { getStoredSchedule, ScheduleItem } from '@/lib/data-store'

const eventDetails = [
  {
    icon: Calendar,
    label: 'Date',
    value: 'July 21, 2026',
  },
  {
    icon: Clock,
    label: 'Time',
    value: '6:00 PM – 9:00 PM EST',
  },
  {
    icon: Globe,
    label: 'Platform',
    value: 'Virtual Mainstage',
  },
  {
    icon: Video,
    label: 'Format',
    value: 'Interactive Global Stream',
  },
]

const speakers = [
  {
    name: 'Dr. Elvis Justice Bedi',
    title: 'Author & Keynote Speaker',
    bio: 'Founder, venture strategist, and author of JUST ELVIS JUSTICE.',
    initials: 'EJ'
  },
  {
    name: 'Marcus Thompson',
    title: 'Literary Critic & Host',
    bio: 'Renowned essayist and international cultural commentator.',
    initials: 'MT'
  },
  {
    name: 'Sarah Chen',
    title: 'Publishing Director',
    bio: 'Leading innovator in modern digital media and authorship.',
    initials: 'SC'
  },
  {
    name: 'David Rodriguez',
    title: 'Executive Interviewer',
    bio: 'Award-winning journalist and host of Global Leadership Series.',
    initials: 'DR'
  },
]

export default function EventSection() {
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([])

  useEffect(() => {
    setScheduleList(getStoredSchedule())
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
    <section id="event" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#f1ece3]/40">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
            Global Launch
          </span>
          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
            The Virtual Premiere
          </h2>
          <p className="body-text text-sm sm:text-base text-[#77716a]">
            An exclusive evening featuring live readings, deep-dive keynote address by Dr. Elvis, panel dialogues, and global interactive audience Q&amp;A.
          </p>
        </div>

        {/* 4 Event Quick Detail Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {eventDetails.map((detail) => {
            const Icon = detail.icon
            return (
              <motion.div
                key={detail.label}
                variants={itemVariants}
                className="editorial-card p-6 flex flex-col space-y-3 group hover:border-[#c79a68]/40"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f1ece3] text-[#c79a68] flex items-center justify-center group-hover:bg-[#c79a68] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#c79a68] tracking-widest font-sans">
                    {detail.label}
                  </p>
                  <p className="font-serif text-lg font-bold text-[#1d1b18] mt-0.5">
                    {detail.value}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* 2-Column: Schedule Timeline & Speakers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Schedule Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-1">
              <span className="eyebrow">Program Structure</span>
              <h3 className="editorial-heading text-2xl sm:text-3xl text-[#1d1b18]">
                Evening Schedule
              </h3>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l border-[#c79a68]/30 space-y-8">
              {scheduleList.map((item, index) => (
                <div key={item.id || index} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#c79a68] group-hover:bg-[#c79a68] transition-colors" />
                  
                  <div className="p-4 rounded-xl bg-white border border-[rgba(80,60,40,0.08)] shadow-xs space-y-1 group-hover:border-[#c79a68]/30 transition-colors">
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

          {/* Speakers Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-1">
              <span className="eyebrow">Distinguished Guests</span>
              <h3 className="editorial-heading text-2xl sm:text-3xl text-[#1d1b18]">
                Featured Speakers
              </h3>
            </div>

            <div className="space-y-4">
              {speakers.map((speaker) => (
                <div
                  key={speaker.name}
                  className="editorial-card p-5 flex items-start gap-4 hover:border-[#c79a68]/40"
                >
                  <div className="w-11 h-11 rounded-full bg-[#2a211c] text-[#f8f5ef] font-serif font-bold flex items-center justify-center shrink-0 text-sm shadow-sm">
                    {speaker.initials}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-base text-[#1d1b18]">
                      {speaker.name}
                    </h4>
                    <p className="text-[11px] font-sans text-[#c79a68] uppercase tracking-wider font-semibold">
                      {speaker.title}
                    </p>
                    <p className="body-text text-xs text-[#77716a] leading-relaxed">
                      {speaker.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* RSVP CTA Box */}
            <div className="p-6 rounded-2xl bg-[#2a211c] text-[#f8f5ef] space-y-4 shadow-xl">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold tracking-widest text-[#c79a68]">
                  Complimentary Registration
                </span>
                <h4 className="font-serif text-xl font-bold">
                  Reserve Your Virtual Seat
                </h4>
                <p className="text-xs text-[#f8f5ef]/70 leading-relaxed font-sans">
                  Free access to the live stream. Registered attendees receive the recorded replay package and calendar invite.
                </p>
              </div>

              <Link
                href="/event"
                className="editorial-btn-primary w-full text-center block text-xs"
              >
                RSVP for Mainstage Access
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
