'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeUnit {
  value: number
  label: string
}

interface CountdownTimerProps {
  targetDate?: string // ISO format e.g. '2026-07-21T18:00:00'
  title?: string
  subtitle?: string
  onComplete?: () => void
}

export default function CountdownTimer({
  targetDate = '2026-07-21T18:00:00',
  title = 'Countdown to Broadcast',
  subtitle = 'July 21, 2026 • 6:00 PM EST',
  onComplete
}: CountdownTimerProps) {
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>([
    { value: 0, label: 'Days' },
    { value: 0, label: 'Hours' },
    { value: 0, label: 'Minutes' },
    { value: 0, label: 'Seconds' },
  ])
  const [isLaunched, setIsLaunched] = useState(false)

  useEffect(() => {
    const target = new Date(targetDate)

    const calculate = () => {
      const now = new Date()
      const difference = target.getTime() - now.getTime()

      if (difference <= 0) {
        setIsLaunched(true)
        if (onComplete) onComplete()
        return false
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
        return true
      }
    }

    calculate()
    const timer = setInterval(() => {
      const hasTime = calculate()
      if (!hasTime) clearInterval(timer)
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (isLaunched) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="editorial-card p-6 text-center space-y-2 bg-white"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block animate-pulse mr-2" />
        <span className="text-xs uppercase tracking-widest text-[#c79a68] font-bold font-sans">
          Premiere Broadcast Live
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#1d1b18]">
          The Launch Premiere Is Underway
        </h3>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="editorial-card p-6 text-center space-y-4 bg-white"
    >
      <div className="flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#c79a68] animate-pulse" />
        <p className="text-xs uppercase tracking-widest text-[#c79a68] font-bold font-sans">
          {title} {subtitle ? `• ${subtitle}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="p-3 bg-[#f8f5ef] border border-[rgba(80,60,40,0.10)] rounded-xl shadow-2xs">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#1d1b18]">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[9px] uppercase font-semibold text-[#77716a] block mt-1.5 font-sans">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
