'use client'

import ContactSection from '@/components/contact-section'
import Footer from '@/components/footer'

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="pt-8">
        <ContactSection />
      </div>
      <Footer />
    </main>
  )
}
