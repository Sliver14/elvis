'use client'

import { useState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="newsletter">
      <div>
        <p className="eyebrow">The reading list</p>
        <h2>A little more <em>thoughtfully.</em></h2>
        <p>New releases, considered recommendations, and notes from the world of books. Once a month, never noisy.</p>
      </div>
      {sent ? (
        <div className="newsletter-success">
          <Check /> You&apos;re on the list.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="button button-dark" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <>Subscribe <ArrowRight /></>}
          </button>
        </form>
      )}
    </section>
  )
}
