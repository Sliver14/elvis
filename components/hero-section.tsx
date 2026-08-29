'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="min-h-screen bg-background pt-24 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-6 md:space-y-8">
            <motion.div variants={itemVariants} className="space-y-3">
              <p className="text-xs font-bold text-[#bda06d] uppercase tracking-[0.2em]">
                Latest Literary Drop
              </p>
              <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight leading-[1.05] uppercase text-[#2b221a]">
                JUST ELVIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2b221a] via-[#bda06d] to-[#2b221a]">JUSTICE</span>
              </h1>

              {/* Staggered Typewriter Reading Effect */}
              <motion.p
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
                className="text-base md:text-lg font-serif italic text-[#bda06d]"
              >
                Masterpiece curated by{' '}
                {"Dr. Elvis Justice Bedi".split('').map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="inline-block font-bold"
                    style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-[#2b221a]/70 max-w-xl leading-relaxed font-sans font-light"
            >
              Prepare to embark on a boundaries-breaking digital literary production. Engineered specifically as a fully integrated global launch—experience the interactive high-fidelity eBook, premium master-class companion audiobooks, and rich dynamic media files.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link
                href="/store"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#2b221a] text-white rounded-xl font-medium tracking-wide shadow-xl shadow-[#2b221a]/20 hover:bg-[#bda06d] transition-all cursor-pointer text-sm"
              >
                Secure Priority Access
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-8 py-3 border border-[#bda06d]/30 text-[#bda06d] hover:bg-[#bda06d]/5 rounded-xl font-medium tracking-wide transition-all cursor-pointer text-sm"
              >
                Read Book Spec Sheet
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Book Cover & Countdown */}
          <motion.div
            variants={itemVariants}
            className="space-y-8 flex justify-center items-center"
          >
            {/* Custom Luxury 3D Floating Book Mockup container */}
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
                alt="JUST ELVIS JUSTICE Book Cover"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
