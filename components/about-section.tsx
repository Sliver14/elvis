'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { BookOpen, Lightbulb, Users, Award } from 'lucide-react'

const highlights = [
  {
    icon: BookOpen,
    title: 'Compelling Narrative',
    description: 'A beautifully crafted story that spans continents and generations.',
  },
  {
    icon: Lightbulb,
    title: 'Life-Changing Insights',
    description: 'Discover profound wisdom about resilience, identity, and transformation.',
  },
  {
    icon: Users,
    title: 'Diverse Characters',
    description: 'Meet unforgettable characters who challenge and inspire you.',
  },
  {
    icon: Award,
    title: 'Award-Worthy',
    description: 'A masterpiece that captures hearts and minds worldwide.',
  },
]

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section id="about" className="pt-10 pb-10 md:pt-16 md:pb-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6 text-balance">
            About the Book
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            JUST ELVIS JUSTICE is more than a book—it&apos;s an invitation to discover the extraordinary leadership, discipline, and success principles within yourself. This compelling guide weaves together life-changing strategies and personal philosophies to inspire your own development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Custom Luxury 3D Floating Book Mockup container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-96 md:h-full flex items-start justify-center"
          >
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotateY: [-5, 5, -5],
                rotateX: [8, 12, 8]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-52 h-76 sm:w-60 sm:h-88 md:w-64 md:h-96 rounded-r-xl overflow-hidden shadow-[25px_30px_55px_-10px_rgba(43,34,26,0.35)] border-y border-r border-[#ffffff]/30 bg-white group"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {/* Premium Book Spine simulation edge highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-r from-black/20 via-transparent to-white/10 z-20 pointer-events-none" />
              <Image
                src="/book.jpeg"
                alt="JUST ELVIS JUSTICE Book Mockup"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </motion.div>

          {/* Just */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Just</h3>
              <p className="text-muted-foreground leading-relaxed">
                Written by Dr. Elvis Justice Bedi, this volume challenges you to break free from self-imposed limitations, master your personal habits, and execute your strategy with absolute clarity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through practical frameworks, philosophy, and personal stories, Dr. Elvis shows that true breakthrough comes from aligning action with your deepest vision and executing daily without compromise.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="space-y-2"
            >
              <p className="text-sm font-semibold text-accent uppercase tracking-widest">Pages: 384 | Format: Hardcover | Release: September 15, 2026</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Highlights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {highlights.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.1)' }}
                className="p-6 rounded-lg border border-border bg-card hover:border-accent transition-all cursor-pointer group"
              >
                <motion.div
                  className="mb-4"
                  whileHover={{ scale: 1.1, color: '#d4af37' }}
                >
                  <Icon className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
