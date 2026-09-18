'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    isBooking: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.subject && formData.message) {
      const currentMessages = JSON.parse(localStorage.getItem('aurora_messages') || '[]')
      const newMessage = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        isBooking: formData.isBooking,
        date: new Date().toLocaleDateString(),
      }
      localStorage.setItem('aurora_messages', JSON.stringify([newMessage, ...currentMessages]))

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '', isBooking: false })
      setTimeout(() => setSubmitted(false), 4000)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Direct Email',
      value: 'hello@elvisjusticebedi.com',
      href: 'mailto:hello@elvisjusticebedi.com',
    },
    {
      icon: Phone,
      label: 'Press & Booking Desk',
      value: '+1 (212) 555-0198',
      href: 'tel:+12125550198',
    },
    {
      icon: MapPin,
      label: 'Publishing Office',
      value: 'New York & Global Headquarters',
      href: '#',
    },
  ]

  return (
    <section id="contact" className="pt-8 sm:pt-10 md:pt-12 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 bg-[#f8f5ef]">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="editorial-script text-2xl sm:text-3xl text-[#c79a68]">
            Get In Touch
          </span>
          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
            Author &amp; Press Desk
          </h2>
          <p className="body-text text-sm sm:text-base text-[#77716a]">
            Have a question, bulk order inquiry, or media speaking request? Submit your message below and our executive team will get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <a
                  key={info.label}
                  href={info.href}
                  className="editorial-card p-6 flex items-center gap-4 group hover:border-[#c79a68]/40 block transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#f1ece3] text-[#c79a68] flex items-center justify-center shrink-0 group-hover:bg-[#c79a68] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-[#c79a68] tracking-widest font-sans">
                      {info.label}
                    </p>
                    <p className="font-serif font-bold text-base text-[#1d1b18] group-hover:text-[#c79a68] transition-colors mt-0.5">
                      {info.value}
                    </p>
                  </div>
                </a>
              )
            })}

            {/* Speaking Enquiries Callout */}
            <div className="p-6 rounded-2xl bg-[#2a211c] text-[#f8f5ef] space-y-2 shadow-md">
              <span className="text-[10px] uppercase tracking-widest text-[#c79a68] font-bold block">
                Keynote Engagements
              </span>
              <h4 className="font-serif text-lg font-bold">
                Book Dr. Elvis for Your Next Conference
              </h4>
              <p className="text-xs text-[#f8f5ef]/70 leading-relaxed">
                Available for select global executive summits, university lectures, and private leadership retreats.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 editorial-card p-8 sm:p-10 bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1d1b18] uppercase tracking-wider block font-sans">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] text-[#1d1b18] text-sm focus:outline-none focus:border-[#c79a68] focus:bg-white transition-all placeholder-[#77716a]/50"
                    placeholder="e.g. Elvis Reader"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1d1b18] uppercase tracking-wider block font-sans">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] text-[#1d1b18] text-sm focus:outline-none focus:border-[#c79a68] focus:bg-white transition-all placeholder-[#77716a]/50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1d1b18] uppercase tracking-wider block font-sans">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] text-[#1d1b18] text-sm focus:outline-none focus:border-[#c79a68] focus:bg-white transition-all placeholder-[#77716a]/50"
                  placeholder="e.g. Media Interview / Bulk Order Request"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1d1b18] uppercase tracking-wider block font-sans">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] text-[#1d1b18] text-sm focus:outline-none focus:border-[#c79a68] focus:bg-white transition-all resize-none placeholder-[#77716a]/50"
                  placeholder="Share details of your inquiry..."
                />
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="isBooking"
                  name="isBooking"
                  checked={formData.isBooking}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isBooking: e.target.checked }))}
                  className="w-4 h-4 rounded border-[rgba(80,60,40,0.2)] text-[#c79a68] accent-[#c79a68] cursor-pointer"
                />
                <label htmlFor="isBooking" className="text-xs text-[#77716a] font-medium cursor-pointer">
                  This inquiry is regarding a keynote speaking invitation or media feature.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="editorial-btn-primary w-full py-3.5 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-80"
              >
                {submitted ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Message Successfully Dispatched
                  </span>
                ) : (
                  <span>Send Message to Author Desk</span>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  )
}
