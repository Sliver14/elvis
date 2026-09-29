'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react'
import { BookPreviewModal } from '@/components/book-preview-modal'
import { PresaleCheckoutModal } from '@/components/presale-checkout-modal'

export default function PreviewPage() {
  const [previewOpen, setPreviewOpen] = useState(true)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <main className="section-shell" style={{ padding: '60px 0', minHeight: '80vh' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <p className="eyebrow"><Sparkles size={14} /> Approved Reader Excerpt</p>
        <h1 style={{ fontSize: '2.4rem', margin: '12px 0 16px', fontFamily: 'var(--serif)' }}>
          Practical Trading Psychology
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '28px' }}>
          Explore the official preface, key principles, and preview chapters by Dr Elvis Justice Bedi.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="button button-dark" onClick={() => setPreviewOpen(true)}>
            <BookOpen size={16} /> Open Preview Reader
          </button>
          <button className="button button-light" onClick={() => setCheckoutOpen(true)}>
            Pre-order Book <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ marginTop: '40px' }}>
          <Link href="/launch" className="text-button">
            <ArrowLeft size={16} /> Return to Launch Page
          </Link>
        </div>
      </div>

      <BookPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onPreOrderClick={() => {
          setPreviewOpen(false)
          setCheckoutOpen(true)
        }}
      />

      <PresaleCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </main>
  )
}
