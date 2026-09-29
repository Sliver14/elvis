'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2, Search, ShieldCheck, Sparkles } from 'lucide-react'

export default function OrderTrackingLookupPage() {
  const router = useRouter()
  const [orderQuery, setOrderQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderQuery.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/presale/orders/${encodeURIComponent(orderQuery.trim())}`)
      const data = await res.json()
      if (res.ok && data.success && data.order?.access_token) {
        router.push(`/order/${data.order.access_token}`)
      } else {
        setError(data.error || 'No matching order found for this reference or token.')
      }
    } catch (err: any) {
      setError(err.message || 'Lookup failed. Please check your order reference.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="section-shell" style={{ padding: '80px 0', minHeight: '80vh' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto', background: 'var(--paper-card)', border: '1px solid var(--line)', padding: '40px', borderRadius: '4px', boxShadow: '0 10px 30px rgba(40,24,16,0.06)' }}>
        <p className="eyebrow"><Sparkles size={14} /> Customer Self-Service</p>
        <h1 style={{ fontSize: '2rem', margin: '10px 0 14px', fontFamily: 'var(--serif)' }}>
          Track Your Pre-order
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '28px', lineHeight: '1.6' }}>
          Enter your unique Order Number (e.g. <code>PTP-PRE-...</code>) or secure access token from your confirmation email to inspect payment verification, delivery timeline, or download access.
        </p>

        {error && (
          <div className="admin-error-banner" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
            Order Number or Access Token
            <input
              type="text"
              required
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="e.g. PTP-PRE-1A2B3C-9876"
              style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: '2px', background: 'var(--paper)' }}
            />
          </label>

          <button className="button button-dark btn-lg" type="submit" disabled={loading} style={{ justifyContent: 'center' }}>
            {loading ? <><Loader2 className="animate-spin" size={16} /> Finding Order...</> : <>Search Pre-order <Search size={16} /></>}
          </button>
        </form>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/launch" className="text-button">
            <ArrowLeft size={16} /> Book Launch
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="var(--primary)" /> 256-bit Encrypted Portal
          </span>
        </div>
      </div>
    </main>
  )
}
