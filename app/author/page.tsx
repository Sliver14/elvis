'use client'

import AuthorSection from '@/components/author-section'
import Footer from '@/components/footer'

export default function AuthorPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="pt-8">
        <AuthorSection />
      </div>
      <Footer />
    </main>
  )
}
