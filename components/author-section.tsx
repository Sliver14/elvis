'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, Linkedin, Twitter } from 'lucide-react'

export default function AuthorSection() {
  const socialLinks = [
    { icon: Mail, href: '#', label: 'Email' },
    { icon: Mail, href: '#', label: 'Website' },
    { icon: Mail, href: '#', label: 'Blog' },
  ]

  const achievements = [
    { number: '3', label: 'Bestselling Novels' },
    { number: '42', label: 'Literary Awards' },
    { number: '2M+', label: 'Readers Worldwide' },
  ]

  return (
    <section id="author" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
        >
          {/* Author Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative h-96 md:h-full flex items-start justify-center"
          >
            <div className="relative w-88 h-[440px] md:w-[380px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/author.jpeg"
                alt="Dr. Elvis Justice Bedi Portrait"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                Dr. Elvis Justice Bedi
              </h2>
              <p className="text-lg text-accent font-semibold">Internationally Acclaimed Author</p>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-lg">
                Dr. Elvis Justice Bedi has inspired thinkers, leaders, and readers globally through his insightful exploration of success, discipline, and human capability.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Combining practical knowledge with global enterprise experience, Dr. Elvis weaves dynamic concepts into direct strategies that empower readers to achieve peak performance.
              </p>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-border">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.label}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-accent mb-2">
                    {achievement.number}
                  </p>
                  <p className="text-sm text-muted-foreground">{achievement.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-foreground uppercase tracking-widest">Follow</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.2, color: '#b08d57' }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* Previous Works */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Previous Works</h3>
              <ul className="space-y-2">
                {['The Silent Echo', 'Whispers of Time', 'The Last Garden'].map((book) => (
                  <li key={book} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {book}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
