'use client'

import { useEffect, useMemo, useState } from 'react'

export function Countdown({ targetDate }: { targetDate: string }) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, new Date(targetDate || '2026-11-06T09:00:00+01:00').getTime() - Date.now())
  )

  useEffect(() => {
    const target = new Date(targetDate || '2026-11-06T09:00:00+01:00').getTime()
    setRemaining(Math.max(0, target - Date.now()))
    const interval = window.setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [targetDate])

  const values = useMemo(() => {
    const total = Math.floor(remaining / 1000)
    return [
      Math.floor(total / 86400),
      Math.floor((total % 86400) / 3600),
      Math.floor((total % 3600) / 60),
      total % 60,
    ]
  }, [remaining])

  if (!remaining) return <p className="launch-live">The book is now available.</p>
  return (
    <div className="countdown" aria-label="Time until book launch">
      {values.map((value, index) => (
        <div className="countdown-unit" key={index}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span>
        </div>
      ))}
    </div>
  )
}
