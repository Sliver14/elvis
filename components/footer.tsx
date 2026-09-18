'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

const links = {
  Navigation: [
    { name: 'Home', href: '/' },
    { name: 'About the Author', href: '/author' },
    { name: 'Bookstore', href: '/store' },
    { name: 'Contact & Inquiries', href: '/contact' },
  ],
  Editions: [
    { name: 'Hardcover Collector Edition', href: '/store' },
    { name: 'Paperback First Edition', href: '/store' },
    { name: 'Instant eBook (EPUB/PDF)', href: '/store' },
    { name: 'Companion Audiobook', href: '/store' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Delivery & Returns', href: '#' },
  ],
}

export default function Footer() {
  const { user, setIsAuthModalOpen, setIsProfileModalOpen } = useAuth()

  return (
    <footer className="bg-[#2a211c] text-[#f8f5ef] pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[rgba(255,255,255,0.10)]">
          
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#c79a68] text-white flex items-center justify-center font-serif font-bold text-sm">
                EJ
              </span>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-tight text-[#f8f5ef]">
                  Dr. Elvis Justice Bedi
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#c79a68] font-sans font-semibold">
                  Official Book Launch &amp; Bookstore
                </p>
              </div>
            </div>

            <p className="text-xs text-[#f8f5ef]/70 leading-relaxed font-sans max-w-sm">
              *The Weight of Quiet Hearts* and our literary catalog represent an enduring blueprint on self-mastery, execution systems, and peak performance authored by Dr. Elvis Justice Bedi. Published worldwide.
            </p>

            <div className="pt-2">
              <p className="text-[11px] text-[#c79a68] font-serif italic">
                &ldquo;Where discipline meets destination.&rdquo;
              </p>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c79a68] font-sans">
              Navigation
            </h4>
            <ul className="space-y-2">
              {links.Navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#f8f5ef]/70 hover:text-white transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Editions Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c79a68] font-sans">
              Bookstore
            </h4>
            <ul className="space-y-2">
              {links.Editions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#f8f5ef]/70 hover:text-white transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c79a68] font-sans">
              Author Desk
            </h4>
            <div className="space-y-2.5 text-xs text-[#f8f5ef]/70">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c79a68] shrink-0" />
                <a href="mailto:hello@elvisjusticebedi.com" className="hover:text-white transition-colors">
                  hello@elvisjusticebedi.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c79a68] shrink-0" />
                <span>+1 (212) 555-0198</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c79a68] shrink-0 mt-0.5" />
                <span>Global Publishing &amp; Distribution</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-1.5">
              {user ? (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#c79a68] hover:underline font-sans cursor-pointer text-left"
                >
                  <span>My Reader Account ({user.name.split(' ')[0]})</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#c79a68] hover:underline font-sans cursor-pointer text-left"
                >
                  <span>Sign In / Reader Account</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
              {user && (user.role === 'author' || user.role === 'admin') && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#f8f5ef]/60 hover:text-white font-sans"
                >
                  <span>Author Desk Operations</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#f8f5ef]/50 font-sans">
          <p>&copy; {new Date().getFullYear()} Dr. Elvis Justice Bedi. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {links.Legal.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
