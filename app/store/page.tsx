'use client'

import StoreSection from '@/components/store-section'
import Footer from '@/components/footer'

export default function StorePage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="pt-8">
        <StoreSection />
      </div>
      <Footer />
    </main>
  )
}
