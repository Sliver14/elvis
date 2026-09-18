'use client'

import StoreSection from '@/components/store-section'
import Footer from '@/components/footer'

export default function StorePage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <StoreSection />
      <Footer />
    </main>
  )
}
