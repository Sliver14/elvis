'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeUnit {
  value: number
  label: string
}

export default function CountdownTimer() {
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>([
    { value: 0, label: 'Days' },
    { value: 0, label: 'Hours' },
    { value: 0, label: 'Minutes' },
    { value: 0, label: 'Seconds' },
  ])
  const [isLaunched, setIsLaunched] = useState(false)

  useEffect(() => {
    // Set launch date to July 21, 2026
    const launchDate = new Date('2026-07-21T18:00:00')

    const timer = setInterval(() => {
      const now = new Date()
      const difference = launchDate.getTime() - now.getTime()

      if (difference <= 0) {
        setIsLaunched(true)
        clearInterval(timer)
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeUnits([
          { value: days, label: 'Days' },
          { value: hours, label: 'Hours' },
          { value: minutes, label: 'Minutes' },
          { value: seconds, label: 'Seconds' },
        ])
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isLaunched) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 md:py-12"
      >
        <p className="text-3xl md:text-4xl font-serif font-bold text-accent">
          🎉 The Book Is Now Available
        </p>
      </motion.div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8"
      >
        Launch in
      </motion.h3>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <motion.div
              key={unit.value}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-lg p-3 md:p-4 mb-2"
            >
              <p className="text-xl md:text-3xl font-bold text-foreground">
                {String(unit.value).padStart(2, '0')}
              </p>
            </motion.div>
            <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-widest">
              {unit.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
