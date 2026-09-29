'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bitcoin,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  HelpCircle,
  Loader2,
  Package,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  UploadCloud,
  Wallet,
  XCircle,
} from 'lucide-react'

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const resolvedParams = use(params)
  const token = resolvedParams.token

  const [order, setOrder] = useState<any>(null)
  const [proofs, setProofs] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [releaseInfo, setReleaseInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Proof re-submission state
  const [showProofForm, setShowProofForm] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [transactionHash, setTransactionHash] = useState('')
  const [senderNameOrPhone, setSenderNameOrPhone] = useState('')
  const [receiptUrl, setReceiptUrl] = useState('')
  const [proofNotes, setProofNotes] = useState('')
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [submittingProof, setSubmittingProof] = useState(false)
  const [proofSuccessMsg, setProofSuccessMsg] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`/api/presale/orders/${token}`)
      const data = await res.json()
      if (res.ok && data.success) {
        setOrder(data.order)
        setProofs(data.proofs || [])
        setSettings(data.settings)
        setReleaseInfo(data.release_info)
      } else {
        setError(data.error || 'Order could not be located.')
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching order.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchOrderDetails()
  }, [token])

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2500)
  }

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingReceipt(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setReceiptUrl(data.url)
      } else {
        alert(data.error || 'Receipt upload failed')
      }
    } catch (err: any) {
      alert(err.message || 'Image upload error')
    } finally {
      setUploadingReceipt(false)
    }
  }

  const handleSubmitNewProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return
    setSubmittingProof(true)
    try {
      const res = await fetch('/api/presale/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: order.access_token,
          order_id: order.id,
          order_number: order.order_number,
          payment_method: order.payment_method,
          reference_number: referenceNumber || undefined,
          transaction_hash: transactionHash || undefined,
          sender_name_or_phone: senderNameOrPhone || order.customer_name,
          receipt_url: receiptUrl || undefined,
          notes: proofNotes || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setProofSuccessMsg('Payment evidence updated successfully! It is now under review.')
        setShowProofForm(false)
        fetchOrderDetails()
      } else {
        alert(data.error || 'Failed to submit proof')
      }
    } catch (err: any) {
      alert(err.message || 'Connection error')
    } finally {
      setSubmittingProof(false)
    }
  }

  if (loading) {
    return (
      <main className="section-shell tracking-page">
        <div className="tracking-loading">
          <Loader2 className="animate-spin" size={32} />
          <p>Retrieving secure pre-order details...</p>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="section-shell tracking-page">
        <div className="tracking-error-card">
          <ShieldAlert size={48} />
          <h2>Order Not Found</h2>
          <p>{error || 'The requested order token is invalid or has expired.'}</p>
          <div className="tracking-actions">
            <Link href="/launch" className="button button-dark">
              Return to Book Launch
            </Link>
            <Link href="/order-tracking" className="button button-light">
              Lookup by Order Number
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const paymentStatus = order.payment_status || 'Awaiting Payment'
  const fulfilmentStatus = order.fulfilment_status || 'Pending Payment'
  const isPhysical = order.book_format?.includes('printed') || order.book_format?.includes('bundle')

  return (
    <main className="section-shell tracking-page">
      {/* Top Breadcrumb & Refresh */}
      <div className="tracking-top-nav">
        <Link href="/launch" className="text-button">
          <ArrowLeft size={16} /> Back to Storefront
        </Link>
        <button className="button button-light btn-sm" onClick={fetchOrderDetails}>
          <RefreshCw size={13} /> Refresh Status
        </button>
      </div>

      {proofSuccessMsg && (
        <div className="admin-success-banner" style={{ marginBottom: '24px' }}>
          <CheckCircle2 size={16} /> {proofSuccessMsg}
        </div>
      )}

      {/* Main Order Card */}
      <div className="tracking-hero-card">
        <div className="tracking-hero-header">
          <div>
            <span className="tracking-badge">OFFICIAL PRESALE RECORD</span>
            <h1>Order #{order.order_number}</h1>
            <p className="tracking-date">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="tracking-status-pill-box">
            <span className={`status-badge status-${paymentStatus.toLowerCase().replace(/\s+/g, '-')}`}>
              Payment: {paymentStatus}
            </span>
            <span className="status-badge status-fulfilment">
              Fulfilment: {fulfilmentStatus}
            </span>
          </div>
        </div>

        {/* Visual Progress Steps */}
        <div className="tracking-progress-tracker">
          <div className={`track-step is-completed`}>
            <div className="track-step-dot"><Check size={14} /></div>
            <span className="track-step-title">Order Placed</span>
            <small suppressHydrationWarning>
              {new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </small>
          </div>
          <div className={`track-line ${paymentStatus !== 'Awaiting Payment' ? 'is-active' : ''}`} />
          <div className={`track-step ${paymentStatus === 'Proof Submitted' || paymentStatus === 'Under Review' ? 'is-current' : paymentStatus === 'Confirmed' ? 'is-completed' : paymentStatus === 'Rejected' ? 'is-error' : ''}`}>
            <div className="track-step-dot">
              {paymentStatus === 'Confirmed' ? <Check size={14} /> : paymentStatus === 'Rejected' ? <XCircle size={14} /> : '2'}
            </div>
            <span className="track-step-title">
              {paymentStatus === 'Rejected' ? 'Verification Issue' : paymentStatus === 'Confirmed' ? 'Payment Verified' : 'Under Review'}
            </span>
            <small>{proofs.length > 0 ? 'Evidence Attached' : 'Awaiting Proof'}</small>
          </div>
          <div className={`track-line ${paymentStatus === 'Confirmed' ? 'is-active' : ''}`} />
          <div className={`track-step ${paymentStatus === 'Confirmed' ? (fulfilmentStatus === 'Delivered' ? 'is-completed' : 'is-current') : ''}`}>
            <div className="track-step-dot">
              {fulfilmentStatus === 'Delivered' ? <Check size={14} /> : '3'}
            </div>
            <span className="track-step-title">
              {isPhysical ? 'Physical Dispatch' : 'eBook Unlocked'}
            </span>
            <small suppressHydrationWarning>
              {releaseInfo?.is_released
                ? 'Available Now'
                : `Target: ${new Date(releaseInfo?.release_date || '2026-11-06').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}`}
            </small>
          </div>
        </div>
      </div>

      {/* Grid: Order Details + Payment & Release Actions */}
      <div className="tracking-grid">
        {/* Left Column: Summary & Download */}
        <div className="tracking-left-col">
          {/* Digital eBook Access Box (When Confirmed & Released) */}
          {releaseInfo?.can_download && (
            <div className="download-unlocked-card">
              <div className="unlocked-header">
                <Sparkles size={20} />
                <div>
                  <h3>Your eBook is Unlocked & Ready!</h3>
                  <p>Thank you for your confirmed purchase of Practical Trading Psychology.</p>
                </div>
              </div>
              <a
                href={releaseInfo.download_url}
                className="button button-dark btn-lg download-btn"
                download
              >
                <Download size={18} /> Download High-Definition eBook (PDF)
              </a>
              <small className="download-security-note">
                <ShieldCheck size={13} /> Authenticated digital license for {order.customer_email}
              </small>
            </div>
          )}

          {/* If Paid but awaiting official launch date */}
          {paymentStatus === 'Confirmed' && !releaseInfo?.can_download && !isPhysical && (
            <div className="release-countdown-card">
              <Clock size={24} />
              <div>
                <h4>Pre-order Confirmed & Secured!</h4>
                <p suppressHydrationWarning>
                  Your digital edition is allocated. Download access will automatically activate on official launch day (
                  <strong>
                    {new Date(releaseInfo?.release_date || '2026-11-06').toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </strong>
                  ). We will also dispatch a direct download link to your email.
                </p>
              </div>
            </div>
          )}

          {/* Physical Courier Tracking Info */}
          {isPhysical && paymentStatus === 'Confirmed' && (
            <div className="physical-dispatch-card">
              <div className="dispatch-header">
                <Truck size={20} />
                <h4>Physical Edition Allocation</h4>
              </div>
              <p>
                Courier Partner: <strong>{order.courier_name || 'Standard Express / SpeedPost'}</strong>
              </p>
              {order.tracking_reference ? (
                <div className="tracking-ref-box">
                  <span>Tracking Reference Number:</span>
                  <code>{order.tracking_reference}</code>
                </div>
              ) : (
                <p className="table-sub">
                  Tracking code will be updated here and emailed to you once your parcel is packed and dispatched from our fulfillment center.
                </p>
              )}
            </div>
          )}

          {/* Order Summary Breakdown */}
          <div className="tracking-panel">
            <h3 className="panel-title">Purchased Edition Details</h3>
            <div className="order-item-card">
              <img src="/practical-trading-psychology.png" alt="Book Cover" className="order-book-thumb" />
              <div className="order-item-body">
                <h4>{order.book_title || 'Practical Trading Psychology'}</h4>
                <p className="order-item-author">By Dr Elvis Justice Bedi</p>
                <span className="order-format-tag">
                  {isPhysical ? <Package size={13} /> : <BookOpen size={13} />}
                  {order.book_format?.replace(/_/g, ' ')} (Qty: {order.quantity || 1})
                </span>
                <div className="order-pricing-lines">
                  <div>
                    <span>Unit Price:</span>
                    <strong>${Number(order.unit_price || 29.99).toFixed(2)} USD</strong>
                  </div>
                  {Number(order.shipping_fee) > 0 && (
                    <div>
                      <span>Shipping Fee:</span>
                      <strong>${Number(order.shipping_fee).toFixed(2)} USD</strong>
                    </div>
                  )}
                  <div className="order-total-line">
                    <span>Total Paid / Due:</span>
                    <strong>${Number(order.total_amount).toFixed(2)} USD</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="customer-info-box">
              <div className="info-block">
                <span>Recipient:</span>
                <strong>{order.customer_name}</strong>
                <p>{order.customer_email}</p>
                {order.customer_phone && <p>{order.customer_phone}</p>}
              </div>
              {order.shipping_address && (
                <div className="info-block">
                  <span>Delivery Address:</span>
                  <p>{order.shipping_address.street}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state || ''} {order.shipping_address.postal_code || ''}</p>
                  <p>{order.shipping_address.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Verification & Proof History */}
        <div className="tracking-right-col">
          {/* Rejection Notice Banner */}
          {paymentStatus === 'Rejected' && (
            <div className="payment-rejected-alert">
              <div className="alert-head">
                <ShieldAlert size={20} />
                <h4>Verification Issue Encountered</h4>
              </div>
              <p className="rejection-desc">
                <strong>Reason:</strong> {order.rejection_reason || 'The transaction reference or receipt could not be verified in our records.'}
              </p>
              <button
                className="button button-dark btn-sm"
                onClick={() => setShowProofForm(true)}
              >
                Re-submit Payment Proof <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Awaiting Payment Action Banner */}
          {paymentStatus === 'Awaiting Payment' && (
            <div className="payment-pending-card">
              <div className="pending-head">
                <AlertCircle size={20} />
                <div>
                  <h4>Payment Awaiting Confirmation</h4>
                  <p>Please complete your payment and submit your receipt or reference below.</p>
                </div>
              </div>
              <button
                className="button button-dark"
                onClick={() => setShowProofForm(!showProofForm)}
              >
                {showProofForm ? 'Hide Evidence Form' : 'Submit Payment Proof'} <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Payment Proof Re-Submission Form */}
          {showProofForm && (
            <div className="tracking-panel proof-submission-panel">
              <h3 className="panel-title">Upload / Update Payment Proof</h3>
              <form onSubmit={handleSubmitNewProof} className="presale-form-grid">
                <label>
                  Reference Number / MoMo Transaction ID / Tx Hash
                  <input
                    type="text"
                    value={referenceNumber || transactionHash}
                    onChange={(e) => {
                      setReferenceNumber(e.target.value)
                      setTransactionHash(e.target.value)
                    }}
                    placeholder="e.g. Bank Ref, MoMo Trans ID, or Blockchain Hash"
                  />
                </label>
                <label>
                  Sender Account / Name
                  <input
                    type="text"
                    value={senderNameOrPhone}
                    onChange={(e) => setSenderNameOrPhone(e.target.value)}
                    placeholder="Name appearing on bank or MoMo transfer"
                  />
                </label>

                <div className="cloudinary-upload-box">
                  <label className="cloudinary-label">
                    <UploadCloud size={20} />
                    <span>Upload Transfer Receipt Screenshot (PNG, JPG)</span>
                    <input type="file" accept="image/*,application/pdf" onChange={handleReceiptUpload} />
                  </label>
                  {uploadingReceipt && (
                    <p className="uploading-text">
                      <Loader2 className="animate-spin" size={14} /> Uploading receipt...
                    </p>
                  )}
                  {receiptUrl && (
                    <div className="cover-preview-row">
                      <CheckCircle2 size={16} color="var(--primary)" />
                      <span>Receipt attached: {receiptUrl.slice(0, 40)}...</span>
                    </div>
                  )}
                </div>

                <label>
                  Remarks / Notes (optional)
                  <textarea
                    rows={2}
                    value={proofNotes}
                    onChange={(e) => setProofNotes(e.target.value)}
                    placeholder="Any notes for the finance team..."
                  />
                </label>

                <div className="presale-summary-bar">
                  <button type="button" className="text-button" onClick={() => setShowProofForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="button button-dark" disabled={submittingProof || uploadingReceipt}>
                    {submittingProof ? (
                      <><Loader2 className="animate-spin" size={16} /> Submitting...</>
                    ) : (
                      <>Submit Proof for Verification <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Instructions Reference */}
          <div className="tracking-panel">
            <h3 className="panel-title">Payment Instructions ({order.payment_method?.replace(/_/g, ' ')})</h3>
            <div className="payment-instructions-box">
              {order.payment_method === 'bank_transfer' && settings?.bank && (
                <div className="account-details-grid">
                  <div className="detail-item">
                    <span>Bank:</span>
                    <strong>{settings.bank.bank_name}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Account Name:</span>
                    <strong>{settings.bank.account_name}</strong>
                  </div>
                  <div className="detail-item detail-copyable">
                    <span>Account Number:</span>
                    <code>{settings.bank.account_number}</code>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => copyToClipboard(settings.bank.account_number, 'track_bank')}
                    >
                      {copiedKey === 'track_bank' ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div className="detail-item">
                    <span>Swift / BIC:</span>
                    <code>{settings.bank.swift_bic}</code>
                  </div>
                </div>
              )}

              {order.payment_method === 'mtn_momo' && settings?.mtn_momo && (
                <div className="account-details-grid">
                  <div className="detail-item">
                    <span>Provider:</span>
                    <strong>{settings.mtn_momo.provider_name}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Account Name:</span>
                    <strong>{settings.mtn_momo.account_name}</strong>
                  </div>
                  <div className="detail-item detail-copyable">
                    <span>MoMo Number / Till:</span>
                    <code>{settings.mtn_momo.phone_or_merchant_id}</code>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => copyToClipboard(settings.mtn_momo.phone_or_merchant_id, 'track_mtn')}
                    >
                      {copiedKey === 'track_mtn' ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )}

              {order.payment_method === 'vodafone_momo' && settings?.vodafone_momo && (
                <div className="account-details-grid">
                  <div className="detail-item">
                    <span>Provider:</span>
                    <strong>{settings.vodafone_momo.provider_name}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Account Name:</span>
                    <strong>{settings.vodafone_momo.account_name}</strong>
                  </div>
                  <div className="detail-item detail-copyable">
                    <span>Till / Number:</span>
                    <code>{settings.vodafone_momo.phone_or_merchant_id}</code>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => copyToClipboard(settings.vodafone_momo.phone_or_merchant_id, 'track_voda')}
                    >
                      {copiedKey === 'track_voda' ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )}

              {order.payment_method === 'btc' && settings?.btc && (
                <div className="crypto-address-box">
                  <span className="crypto-addr-label">Bitcoin Mainnet Receiving Address:</span>
                  <div className="crypto-addr-row">
                    <code>{settings.btc.wallet_address}</code>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => copyToClipboard(settings.btc.wallet_address, 'track_btc')}
                    >
                      {copiedKey === 'track_btc' ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )}

              {order.payment_method?.startsWith('usdt') && settings?.usdt && (
                <div className="crypto-address-box">
                  <span className="crypto-addr-label">
                    USDT Receiving Address ({order.payment_method.replace('usdt_', '').toUpperCase()}):
                  </span>
                  <div className="crypto-addr-row">
                    <code>
                      {order.payment_method === 'usdt_erc20'
                        ? settings.usdt.erc20_address
                        : order.payment_method === 'usdt_bep20'
                        ? settings.usdt.bep20_address
                        : settings.usdt.trc20_address}
                    </code>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() =>
                        copyToClipboard(
                          order.payment_method === 'usdt_erc20'
                            ? settings.usdt.erc20_address
                            : order.payment_method === 'usdt_bep20'
                            ? settings.usdt.bep20_address
                            : settings.usdt.trc20_address,
                          'track_usdt'
                        )
                      }
                    >
                      {copiedKey === 'track_usdt' ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )}

              <p className="pay-instruction-note" style={{ marginTop: '12px' }}>
                Always include your unique reference <strong>{order.order_number}</strong> in the transaction narration/memo so funds are rapidly verified.
              </p>
            </div>
          </div>

          {/* Submitted Proofs History */}
          {proofs && proofs.length > 0 && (
            <div className="tracking-panel">
              <h3 className="panel-title">Submitted Payment Evidence ({proofs.length})</h3>
              <div className="proof-history-list">
                {proofs.map((p, idx) => (
                  <div key={p.id || idx} className="proof-history-item">
                    <div className="proof-item-top">
                      <span className={`status-badge status-${p.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {p.status}
                      </span>
                      <small>{new Date(p.submitted_at).toLocaleString()}</small>
                    </div>
                    {p.reference_number && (
                      <p className="proof-meta-line">
                        <span>Ref / TxID:</span> <code>{p.reference_number}</code>
                      </p>
                    )}
                    {p.transaction_hash && (
                      <p className="proof-meta-line">
                        <span>Tx Hash:</span> <code>{p.transaction_hash.slice(0, 24)}...</code>
                      </p>
                    )}
                    {p.sender_name_or_phone && (
                      <p className="proof-meta-line">
                        <span>Sender:</span> <strong>{p.sender_name_or_phone}</strong>
                      </p>
                    )}
                    {p.receipt_url && (
                      <div className="proof-receipt-preview" style={{ marginTop: '10px' }}>
                        {!(p.receipt_url.toLowerCase().endsWith('.pdf') || p.receipt_url.includes('.pdf')) && (
                          <div style={{ marginBottom: '8px', maxWidth: '240px', maxHeight: '160px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line)' }}>
                            <img
                              src={p.receipt_url}
                              alt="Uploaded Receipt Proof"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          </div>
                        )}
                        <a href={p.receipt_url} target="_blank" rel="noreferrer" className="table-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <ExternalLink size={13} /> View Full Uploaded Proof / Screenshot &rarr;
                        </a>
                      </div>
                    )}
                    {p.rejection_reason && (
                      <p className="proof-rejection-text">
                        <strong>Feedback:</strong> {p.rejection_reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
