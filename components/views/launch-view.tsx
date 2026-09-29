'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Banknote,
  Bitcoin,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Headphones,
  Loader2,
  Package,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Wallet,
} from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { Countdown } from '@/components/countdown'
import { DEFAULT_LAUNCH, BookFormat } from '@/lib/types'
import { BookPreviewModal } from '@/components/book-preview-modal'
import { PresaleCheckoutModal } from '@/components/presale-checkout-modal'

export function LaunchView() {
  const { activeLaunch } = useStore()
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [agreedUpdates, setAgreedUpdates] = useState(true)

  // Modals
  const [previewOpen, setPreviewOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutFormat, setCheckoutFormat] = useState<BookFormat>('digital_ebook')

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

  const openCheckoutWithFormat = (fmt: BookFormat) => {
    setCheckoutFormat(fmt)
    setCheckoutOpen(true)
  }

  const themes =
    Array.isArray(activeLaunch.themes) && activeLaunch.themes.length > 0
      ? activeLaunch.themes
      : DEFAULT_LAUNCH.themes

  return (
    <main id="launch" className="launch-page">
      {/* 1. HERO SECTION */}
      <section className="launch-hero section-shell">
        <div className="launch-hero-copy">
          <p className="eyebrow">
            <Sparkles /> Official Book Launch & Presale
          </p>
          <h1>{activeLaunch.title}</h1>
          <p className="launch-author">By {activeLaunch.author}</p>
          {activeLaunch.tagline && (
            <p className="launch-tagline" style={{ whiteSpace: 'pre-line' }}>
              {activeLaunch.tagline}
            </p>
          )}
          <p className="hero-intro">{activeLaunch.intro || activeLaunch.description}</p>
          <div className="hero-actions">
            <button
              className="button button-dark"
              onClick={() => openCheckoutWithFormat('digital_ebook')}
            >
              Pre-order Book <ArrowRight size={16} />
            </button>
            <button
              className="button button-light"
              onClick={() => setPreviewOpen(true)}
            >
              <BookOpen size={16} /> Read a Preview
            </button>
          </div>
          <div className="hero-micro-meta">
            <span><ShieldCheck size={14} color="var(--primary)" /> Secured Payment</span>
            <span>·</span>
            <span suppressHydrationWarning>
              Expected Release:{' '}
              {new Date(activeLaunch.launch_date || '2026-11-06').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
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

      {/* 2. COUNTDOWN SECTION */}
      <section className="countdown-section">
        <div className="section-shell countdown-inner">
          <div>
            <p className="eyebrow">Countdown to Official Release</p>
            <h2>Counting down to <em>{activeLaunch.title || 'the next release'}.</em></h2>
          </div>
          <div>
            <p className="countdown-note" suppressHydrationWarning>
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

      {/* 3. PRESALE FORMATS & PRICING SECTION */}
      <section id="presale-editions" className="section-shell presale-editions-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Available Editions</p>
            <h2>Pre-order your <em>preferred format.</em></h2>
          </div>
          <button className="text-button" onClick={() => setPreviewOpen(true)}>
            Read approved excerpt first <ArrowRight size={16} />
          </button>
        </div>

        <div className="presale-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {/* Format 1: Ebook / PDF */}
          <article className="presale-edition-card">
            <div className="edition-badge">INSTANT DIGITAL</div>
            <div className="edition-icon-wrap"><BookOpen size={24} /></div>
            <h3>Ebook / PDF Edition</h3>
            <p className="edition-desc">
              Complete high-definition digital eBook (PDF & EPUB). Delivered directly to your inbox upon official release with instant access.
            </p>
            <div className="edition-features">
              <span><Check size={14} /> Full unabridged 12 chapters</span>
              <span><Check size={14} /> Interactive charts & checklists</span>
              <span><Check size={14} /> Instant digital release delivery</span>
            </div>
            <div className="edition-pricing-box">
              <span className="edition-price">$22</span>
              <span className="edition-curr">USD</span>
            </div>
            <button
              className="button button-dark"
              onClick={() => openCheckoutWithFormat('digital_ebook')}
            >
              Pre-order Ebook / PDF <ArrowRight size={14} />
            </button>
          </article>

          {/* Format 2: Audio Book */}
          <article className="presale-edition-card is-featured-edition">
            <div className="edition-badge edition-badge-gold">AUDIO MASTERCLASS</div>
            <div className="edition-icon-wrap"><Headphones size={24} /></div>
            <h3>Audio Book Edition</h3>
            <p className="edition-desc">
              Studio narrated audio masterclass edition with full chapter commentary, psychological breakdowns, and mindset training exercises.
            </p>
            <div className="edition-features">
              <span><Check size={14} /> Full audio narration masterclass</span>
              <span><Check size={14} /> Chapter-by-chapter psychological insights</span>
              <span><Check size={14} /> Instant streaming & offline download</span>
            </div>
            <div className="edition-pricing-box">
              <span className="edition-price">$28</span>
              <span className="edition-curr">USD</span>
            </div>
            <button
              className="button button-dark"
              onClick={() => openCheckoutWithFormat('audiobook')}
            >
              Pre-order Audio Book <ArrowRight size={14} />
            </button>
          </article>

          {/* Format 3: Hard Copy */}
          <article className="presale-edition-card">
            <div className="edition-badge">EXECUTIVE HARDCOVER</div>
            <div className="edition-icon-wrap"><Package size={24} /></div>
            <h3>Hard Copy Edition</h3>
            <p className="edition-desc">
              Executive clothbound hardcover with embossed gold foil lettering, custom ribbon bookmark, and priority doorstep delivery.
            </p>
            <div className="edition-features">
              <span><Check size={14} /> Executive clothbound hardcover</span>
              <span><Check size={14} /> Embossed gold foil & ribbon bookmark</span>
              <span><Check size={14} /> Domestic & International shipping</span>
            </div>
            <div className="edition-pricing-box">
              <span className="edition-price">$45</span>
              <span className="edition-curr">USD</span>
            </div>
            <button
              className="button button-dark"
              onClick={() => openCheckoutWithFormat('printed_hardcover')}
            >
              Pre-order Hard Copy <ArrowRight size={14} />
            </button>
          </article>
        </div>
      </section>

      {/* 4. PAYMENT TRUST & MULTI-CHANNELS STRIP */}
      <section className="payment-trust-strip section-shell">
        <div className="trust-strip-inner">
          <div className="trust-item">
            <Smartphone size={24} />
            <div>
              <strong>MTN Mobile Money</strong>
              <p>Direct MoMo line with payment reference</p>
            </div>
          </div>
          <div className="trust-item">
            <Smartphone size={24} />
            <div>
              <strong>Telecel / Vodafone Cash</strong>
              <p>Official merchant till with order confirmation</p>
            </div>
          </div>
          <div className="trust-item">
            <Bitcoin size={24} />
            <div>
              <strong>Bitcoin & USDT (TRC20)</strong>
              <p>BTC Mainnet & TRON (TRC20) cryptocurrency</p>
            </div>
          </div>
          <div className="trust-item">
            <ShieldCheck size={24} />
            <div>
              <strong>Encrypted Order Tracking</strong>
              <p>Live verification portal & receipt inspection</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT THE BOOK */}
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
          <div style={{ marginTop: '20px' }}>
            <button className="text-button" onClick={() => setPreviewOpen(true)}>
              <BookOpen size={16} /> Read the author’s preface now <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. THEMES / TAKEAWAYS */}
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

      {/* 7. THE AUTHOR */}
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

      {/* 8. REGISTRATION & WAITLIST NOTIFICATION */}
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

      {/* 9. RESERVE / PRE-ORDER CTA BAND */}
      <section className="reserve-section">
        <p className="eyebrow">Almost here</p>
        <h2>
          Be among the first to experience
          <br />
          <em>{activeLaunch.title}.</em>
        </h2>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="button button-light"
            onClick={() => openCheckoutWithFormat('digital_ebook')}
          >
            Pre-order Your Edition <ArrowRight />
          </button>
          <button
            className="button"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
            onClick={() => setPreviewOpen(true)}
          >
            <BookOpen size={16} /> Read a Preview
          </button>
        </div>
      </section>

      {/* MODALS */}
      <BookPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onPreOrderClick={() => {
          setPreviewOpen(false)
          setCheckoutOpen(true)
        }}
      />

      <PresaleCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        initialFormat={checkoutFormat}
      />
    </main>
  )
}
