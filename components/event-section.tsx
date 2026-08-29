'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Globe, Video, Clock } from 'lucide-react'
import { getStoredSchedule, ScheduleItem } from '@/lib/data-store'

const eventDetails = [
  {
    icon: Calendar,
    label: 'Date',
    value: 'September 15, 2026',
  },
  {
    icon: Clock,
    label: 'Time',
    value: '6:00 PM - 9:00 PM EST',
  },
  {
    icon: Globe,
    label: 'Location',
    value: 'Virtual Mainstage',
  },
  {
    icon: Video,
    label: 'Format',
    value: 'Live Interactive Stream',
  },
]

// Schedule events loaded dynamically from data-store

const speakers = [
  {
    name: 'Dr. Elvis Justice Bedi',
    title: 'Author',
    bio: 'Self-mastery strategies mentor, leader, and author.',
  },
  {
    name: 'Marcus Thompson',
    title: 'Literary Critic',
    bio: 'Renowned book critic and cultural commentator.',
  },
  {
    name: 'Sarah Chen',
    title: 'Publisher',
    bio: 'Leading voice in contemporary publishing.',
  },
  {
    name: 'David Rodriguez',
    title: 'Journalist',
    bio: 'Award-winning journalist and interviewer.',
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
    <section id="event" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 text-balance">
            Launch Event
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us for an unforgettable evening celebrating Aurora&apos;s Awakening and the author&apos;s vision.
          </p>
        </motion.div>

        {/* Event Details */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {eventDetails.map((detail) => {
            const Icon = detail.icon
            return (
              <motion.div
                key={detail.label}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-6 rounded-lg border border-border bg-background hover:border-accent transition-all"
              >
                <Icon className="w-8 h-8 text-accent mb-4" />
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                  {detail.label}
                </p>
                <p className="text-lg font-semibold text-foreground">{detail.value}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Event Schedule Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8">Event Schedule</h3>
          <div className="space-y-0 border-l-2 border-accent pl-0">
            {scheduleList.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-8 pb-8 last:pb-0"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent border-4 border-background" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-accent">{item.time}</p>
                  <p className="text-lg font-semibold text-foreground">{item.activity}</p>
                  {item.speaker && <p className="text-sm text-muted-foreground">{item.speaker}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guest Speakers */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8">Guest Speakers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {speakers.map((speaker) => (
              <motion.div
                key={speaker.name}
                whileHover={{ y: -5 }}
                className="p-6 rounded-lg border border-border bg-background hover:border-accent transition-all text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/50 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-1">{speaker.name}</h4>
                <p className="text-sm font-medium text-accent mb-3">{speaker.title}</p>
                <p className="text-sm text-muted-foreground">{speaker.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(176, 141, 87, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold transition-all hover:shadow-xl"
          >
            Register Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
