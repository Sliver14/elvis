'use client'

import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { Cover } from '@/components/book-cover'
import { Newsletter } from '@/components/newsletter'

export function HomeView() {
  const { booksList, activeLaunch } = useStore()

  return (
    <main id="home">
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">Independent books for considered lives</p>
          <h1>Books to help you <em>think</em> better.</h1>
          <p className="hero-intro">
            Serendipity / Elvis is a modern bookstore for ideas with staying power. Discover books that meet you where you are — and take you somewhere new.
          </p>
          <div className="hero-actions">
            <Link href="/books" className="button button-dark">
              Explore the collection <ArrowRight />
            </Link>
            <Link href="/launch" className="text-button">
              Discover the launch <ArrowRight />
            </Link>
          </div>
        </div>
        <div className="hero-banner-frame" onContextMenu={(e) => e.preventDefault()}>
          <img
            src="/elvis-banner.png"
            alt="Dr Elvis Justice Bedi — SERENDIPITY"
            className="hero-banner-image"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
          <div className="cover-protection-shield" aria-hidden="true" />
        </div>
      </section>

      {activeLaunch && (
        <section className="launch-strip">
          <div className="section-shell launch-strip-inner">
            <div>
              <p className="eyebrow">Coming soon</p>
              <h2>{activeLaunch.title || 'Practical Trading Psychology'}</h2>
              <p>{activeLaunch.tagline?.split('\n')[0] || activeLaunch.intro || 'Process over profit. Win in the mind first.'}</p>
            </div>
            <div className="launch-date">
              <Clock3 />
              <span suppressHydrationWarning>
                Launching{' '}
                {activeLaunch.launch_date ? new Date(activeLaunch.launch_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }) : 'November 6, 2026'}
              </span>
            </div>
            <Link href="/launch" className="button button-light">
              View launch <ArrowRight />
            </Link>
          </div>
        </section>
      )}

      <section id="books" className="section-shell collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The collection</p>
            <h2>Find your next <em>good read.</em></h2>
          </div>
          <Link href="/books" className="text-button">
            View all books <ArrowRight />
          </Link>
        </div>
        {booksList.length > 0 ? (
          <div className="book-grid">
            {booksList.map((book) => (
              <Link href={`/books/${book.id}`} key={book.id} className="book-card-link">
                <article className="book-card">
                  <div className="card-cover-wrap">
                    <Cover book={book} />
                    <span className="card-category">{book.category}</span>
                  </div>
                  <div className="book-card-meta">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <div>
                      <span>{book.price}</span>
                      <span className="round-arrow" aria-label={`View ${book.title}`}>
                        <ArrowRight />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>New Titles Coming Soon</h3>
            <p style={{ color: 'var(--color-muted)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
              Our curated catalog is being updated. Explore our featured book launch in the meantime.
            </p>
            <Link href="/launch" className="button button-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Explore the Book Launch <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      <section className="quote-band">
        <p className="eyebrow">A note from us</p>
        <blockquote>“A bookstore should be a place where curiosity feels at home.”</blockquote>
        <span>— Serendipity / Elvis</span>
      </section>

      <Newsletter />
    </main>
  )
}
