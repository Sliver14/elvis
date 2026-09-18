'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState } from 'react'

interface BookTrailerProps {
  trailerUrl?: string
  title?: string
  bookTitle?: string
}

export default function BookTrailer({
  trailerUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  title = 'Official Book Trailer',
  bookTitle = 'The Weight of Quiet Hearts'
}: BookTrailerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Determine embed url
  const cleanUrl = trailerUrl.includes('embed') 
    ? trailerUrl 
    : trailerUrl.includes('watch?v=') 
      ? `https://www.youtube.com/embed/${trailerUrl.split('watch?v=')[1]?.split('&')[0]}`
      : trailerUrl

  return (
    <section id="trailer" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#f8f5ef]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
            {title}
          </h2>
          <p className="body-text text-sm sm:text-base text-[#77716a]">
            Experience a visual prelude to the philosophies and core principles within *{bookTitle}*.
          </p>
        </div>

        {/* Video Player Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(42,33,28,0.25)] border-4 border-white bg-[#2a211c] cursor-pointer group"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <div className="relative w-full pt-[56.25%] bg-[#2a211c]">
            {/* YouTube Embed */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}autoplay=${isPlaying ? '1' : '0'}`}
              title={`${bookTitle} - Cinematic Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Play Button Overlay */}
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 group-hover:bg-black/55 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-[#c79a68] hover:bg-[#b88958] flex items-center justify-center transition-all duration-300 shadow-2xl group-hover:scale-110">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                <p className="text-white text-xs uppercase tracking-widest font-semibold mt-4 font-sans drop-shadow-md">
                  Watch Official Trailer (2:15)
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
