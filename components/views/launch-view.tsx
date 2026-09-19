'use client'

import { useState } from 'react'
import { ArrowRight, Check, Loader2, Sparkles } from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { Countdown } from '@/components/countdown'
import { DEFAULT_LAUNCH } from '@/lib/types'

export function LaunchView() {
  const { activeLaunch } = useStore()
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [agreedUpdates, setAgreedUpdates] = useState(true)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setLoading(true)
    try {
      const res = await fetch('/api/launch/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          launch_id: activeLaunch.id,
          launch_title: activeLaunch.title,
          launch_date: activeLaunch.launch_date,
          author_name: activeLaunch.author,
          agreed_updates: agreedUpdates,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setRegistered(true)
      } else {
        alert(data.error || 'Could not complete registration. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const themes =
    Array.isArray(activeLaunch.themes) && activeLaunch.themes.length > 0
      ? activeLaunch.themes
      : DEFAULT_LAUNCH.themes

  return (
    <main id="launch" className="launch-page">
      <section className="launch-hero section-shell">
        <div className="launch-hero-copy">
          <p className="eyebrow">
            <Sparkles /> The next release
          </p>
          <h1>{activeLaunch.title}</h1>
          <p className="launch-author">By {activeLaunch.author}</p>
          {activeLaunch.tagline && (
            <h2 className="launch-tagline" style={{ whiteSpace: 'pre-line' }}>
              {activeLaunch.tagline}
            </h2>
          )}
          <p className="hero-intro">{activeLaunch.intro || activeLaunch.description}</p>
          <div className="hero-actions">
            <button
              className="button button-dark"
              onClick={() => document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get notified <ArrowRight />
            </button>
            <button
              className="text-button"
              onClick={() => document.getElementById('about-book')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore the book <ArrowRight />
            </button>
          </div>
        </div>
        <div className="launch-cover-stage">
          <div className="stage-label">
            SERENDIPITY / ELVIS
            <br />
            FEATURED RELEASE
          </div>
          <div className="book-cover launch-cover" onContextMenu={(e) => e.preventDefault()}>
            <img
              src={activeLaunch.cover_image || '/practical-trading-psychology.png'}
              alt={activeLaunch.title}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="cover-protection-shield" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="countdown-section">
        <div className="section-shell countdown-inner">
          <div>
            <p className="eyebrow">The launch</p>
            <h2>Make room for a better <em>process.</em></h2>
          </div>
          <div>
            <p className="countdown-note">
              Launching{' '}
              {new Date(activeLaunch.launch_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <Countdown targetDate={activeLaunch.launch_date} />
          </div>
        </div>
      </section>

      <section id="about-book" className="section-shell about-book">
        <div className="about-book-heading">
          <p className="eyebrow">About the book</p>
          <h2>The mind is where every trade <em>begins.</em></h2>
        </div>
        <div className="about-book-copy">
          <p>{activeLaunch.description || activeLaunch.intro}</p>
          <p>
            It emphasizes the importance of mastering the mind and building a consistent process rather than being driven solely by profit.
          </p>
        </div>
      </section>

      <section className="themes section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Inside the work</p>
            <h2>What readers can <em>expect.</em></h2>
          </div>
        </div>
        <div className="theme-grid">
          {themes.map((theme, i) => (
            <div className="theme-item" key={theme + i}>
              <span>0{i + 1}</span>
              <h3>{theme}</h3>
              <ArrowRight />
            </div>
          ))}
        </div>
      </section>

      <section className="author-section">
        <div className="section-shell author-inner">
          <div
            className="author-photo-frame author-launch-photo-frame"
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              src={activeLaunch.author_image || '/elvis.jpeg'}
              alt={activeLaunch.author}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="cover-protection-shield" aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">The author</p>
            <h2>{activeLaunch.author}</h2>
            <p>{activeLaunch.author_bio || DEFAULT_LAUNCH.author_bio}</p>
          </div>
        </div>
      </section>

      <section id="notify" className="section-shell notify-section">
        <div className="notify-copy">
          <p className="eyebrow">Stay close to the launch</p>
          <h2>Be first in line for <em>{activeLaunch.title}.</em></h2>
          <p>
            Register your interest and we&apos;ll let you know the moment {activeLaunch.title} is available.
          </p>
        </div>
        {registered ? (
          <div className="registration-success">
            <div className="success-icon">
              <Check />
            </div>
            <h3>You&apos;re registered.</h3>
            <p>We&apos;ll be in touch with launch updates and priority access.</p>
          </div>
        ) : (
          <form className="notify-form" onSubmit={handleRegister}>
            <label>
              Full name
              <input
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Phone number <span>(optional)</span>
              <input
                type="tel"
                placeholder="+44 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreedUpdates}
                onChange={(e) => setAgreedUpdates(e.target.checked)}
              />
              <span>I agree to receive launch updates and understand I can unsubscribe at any time.</span>
            </label>
            <button className="button button-dark" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <>Notify me <ArrowRight /></>}
            </button>
          </form>
        )}
      </section>

      <section className="reserve-section">
        <p className="eyebrow">Almost here</p>
        <h2>
          Be among the first to experience
          <br />
          <em>{activeLaunch.title}.</em>
        </h2>
        <button
          className="button button-light"
          onClick={() => document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Reserve your copy <ArrowRight />
        </button>
      </section>
    </main>
  )
}
