'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, AtSign, Camera, Music2 } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) return null

  return (
    <footer id="contact" className="site-footer">
      <div className="section-shell footer-top">
        <div className="footer-intro">
          <Link href="/" className="wordmark footer-mark">
            <span className="wordmark-mark">S</span>
            <span>SERENDIPITY / <em>ELVIS</em></span>
          </Link>
          <p>A considered bookstore for curious minds, thoughtful conversations, and books worth returning to.</p>
          <Link href="/books" className="footer-cta">
            Find your next read <ArrowRight />
          </Link>
        </div>

        <div className="footer-links">
          <div>
            <p className="footer-label">Explore</p>
            <Link href="/books">Books</Link>
            <Link href="/launch">Book launch</Link>
            <Link href="/about">About us</Link>
          </div>
          <div>
            <p className="footer-label">Say hello</p>
            <Link href="/contact">Get in touch</Link>
            <a href="mailto:hello@elvisjusticebooks.com">hello@elvisjusticebooks.com</a>
            <p>London · Accra · Online</p>
          </div>
          <div>
            <p className="footer-label">Follow along</p>
            <div className="socials">
              <a
                href="https://www.instagram.com/elvisjusticeofficial_/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Camera />
              </a>
              <a
                href="https://www.tiktok.com/@elvisjusticeofficial_"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <Music2 />
              </a>
              <a
                href="https://twitter.com/manofserendipty"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <AtSign />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="section-shell footer-bottom">
        <span>© 2026 Serendipity / Elvis</span>
        <span>Made for readers with intention.</span>
        <span>Privacy · Terms</span>
        <Link href="/admin" className="footer-admin-link">
          Admin access
        </Link>
      </div>
    </footer>
  )
}
