'use client'

import { useState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

export function ContactView() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="contact-page section-shell">
      <section className="contact-intro">
        <p className="eyebrow">Get in touch</p>
        <h1>Let&apos;s start a <em>conversation.</em></h1>
        <p>
          Have a question about an order, a recommendation, or a possible collaboration? We&apos;d love to hear from you.
        </p>
        <a className="contact-email" href="mailto:hello@elvisjusticebooks.com">
          hello@elvisjusticebooks.com <ArrowRight />
        </a>
      </section>
      <section className="contact-form-wrap">
        {sent ? (
          <div className="contact-success">
            <Check />
            <p>
              <strong>Thank you for writing.</strong>
              <br />
              We&apos;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label>
              How can we help?
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
              />
            </label>
            <button className="button button-dark" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <>Send message <ArrowRight /></>}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
