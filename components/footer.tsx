'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

const links = {
  Quick: [
    { name: 'Home', href: '/' },
    { name: 'About the Book', href: '/book' },
    { name: 'About the Author', href: '/author' },
    { name: 'Virtual Event', href: '/event' },
    { name: 'Bookstore', href: '/store' },
    { name: 'Contact', href: '/contact' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Refund Policy', href: '#' },
  ],
}

const socials = [
  { icon: Mail, href: '#', label: 'Email' },
  { icon: Phone, href: '#', label: 'Phone' },
  { icon: MapPin, href: '#', label: 'Location' },
]

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-serif font-bold text-foreground">Elvis Bedi</h3>
            <p className="text-sm text-muted-foreground">
              Discover the extraordinary mindset, performance strategy, and success principles of Dr. Elvis Justice Bedi.
            </p>
            <div className="flex gap-3">
              {socials.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2 }}
                    className="p-2 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground hover:text-accent" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {links.Quick.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              {links.Legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4 lg:col-span-2"
          >
            <h4 className="font-semibold text-foreground">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="mailto:hello@elvisjusticebedi.com" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  hello@elvisjusticebedi.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="tel:+12125551234" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  +1 (212) 555-1234
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  New York, NY<br />
                  United States
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
        >
          <p>&copy; {new Date().getFullYear()} JUST ELVIS JUSTICE. All rights reserved.</p>
          <p>
            Crafted with{' '}
            <span className="text-accent">✨</span>
            {' '}by Dr. Elvis Justice Bedi
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
