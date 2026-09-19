'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function AboutView() {
  return (
    <main className="about-page">
      <section className="section-shell about-intro">
        <div>
          <p className="eyebrow">About Serendipity / Elvis</p>
          <h1>A bookstore for <em>better questions.</em></h1>
        </div>
        <p className="about-lede">
          We believe the right book can change the quality of a person&apos;s attention. Serendipity / Elvis brings together thoughtful books for curious minds, open conversations, and considered lives.
        </p>
      </section>

      <section className="section-shell about-manifesto">
        <div className="manifesto-number">01</div>
        <div>
          <p className="eyebrow">Our point of view</p>
          <h2>Less noise.<br /><em>More staying power.</em></h2>
          <p>
            We choose books with something to return to: a useful idea, a generous perspective, or a sentence that stays with you. Our collection is intentionally small, so every title earns its place.
          </p>
          <Link href="/books" className="text-button">
            Explore the collection <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="section-shell about-values">
        <div>
          <p className="eyebrow">What guides us</p>
          <h2>Read with <em>intention.</em></h2>
        </div>
        <div className="value-list">
          <div>
            <span>01</span>
            <h3>Curiosity</h3>
            <p>We make room for questions that lead somewhere unexpected.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Clarity</h3>
            <p>We look for ideas that make the complicated feel more possible.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Connection</h3>
            <p>Books are better when they become part of a wider conversation.</p>
          </div>
        </div>
      </section>

      <section className="section-shell author-bios">
        <div>
          <p className="eyebrow">The author</p>
          <h2>Meet the <em>author.</em></h2>
        </div>
        <div className="author-bio-grid">
          <article className="author-bio">
            <div
              className="author-photo-frame author-bio-photo-frame"
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src="/elvis.jpeg"
                alt="Dr Elvis Justice Bedi"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="cover-protection-shield" aria-hidden="true" />
            </div>
            <div>
              <p className="author-number">01</p>
              <h3>Dr Elvis Justice Bedi</h3>
              <p>
                Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.
              </p>
              <Link href="/launch" className="text-button">
                Explore the Book Launch <ArrowRight />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
