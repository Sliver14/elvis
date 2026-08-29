'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState } from 'react'

export default function BookTrailer() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section id="trailer" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6 text-balance">
            Watch the Trailer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a glimpse into the concepts of JUST ELVIS JUSTICE and experience the transformation that awaits you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-full bg-foreground rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {/* Video Container */}
          <div className="relative w-full pt-[56.25%] bg-foreground/90">
            {/* YouTube Embed */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/dQw4w9WgXcQ${isPlaying ? '?autoplay=1' : '?autoplay=0'}`}
              title="JUST ELVIS JUSTICE - Book Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Play Button Overlay (only show if not playing) */}
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-20 h-20 rounded-full bg-accent hover:bg-accent/90 transition-all shadow-xl"
                >
                  <Play className="w-8 h-8 text-accent-foreground fill-accent-foreground" />
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-sm font-semibold text-accent uppercase tracking-widest">
            Duration: 2 min 15 sec
          </p>
        </motion.div>
      </div>
    </section>
  )
}
