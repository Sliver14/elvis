'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bitcoin,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  FileText,
  HelpCircle,
  Info,
  Loader2,
  Minus,
  Package,
  Plus,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  UploadCloud,
  Wallet,
  X,
} from 'lucide-react'
import {
  BookFormat,
  PaymentMethodType,
  PaymentSettings,
  DEFAULT_PAYMENT_SETTINGS,
  DEFAULT_LAUNCH,
} from '@/lib/types'

interface PresaleCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  initialFormat?: BookFormat
}

export function PresaleCheckoutModal({
  isOpen,
  onClose,
  initialFormat = 'digital_ebook',
}: PresaleCheckoutModalProps) {
  // Step State: 1: Format -> 2: Customer/Shipping -> 3: Payment Method -> 4: Evidence -> 5: Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS)
  const [loadingSettings, setLoadingSettings] = useState(false)

  // Step 1: Format
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(initialFormat)
  const [quantity, setQuantity] = useState(1)

  // Step 2: Customer & Shipping Details
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [country, setCountry] = useState('Ghana')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [stateRegion, setStateRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [notes, setNotes] = useState('')

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mtn_momo')
  const [selectedUsdtNetwork, setSelectedUsdtNetwork] = useState<'trc20'>('trc20')

  // Step 4: Proof Submission
  const [referenceNumber, setReferenceNumber] = useState('')
  const [transactionHash, setTransactionHash] = useState('')
  const [senderNameOrPhone, setSenderNameOrPhone] = useState('')
  const [receiptUrl, setReceiptUrl] = useState('')
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [proofNotes, setProofNotes] = useState('')

  // Step 5: Created Order Response
  const [createdOrder, setCreatedOrder] = useState<any>(null)
  const [trackingUrl, setTrackingUrl] = useState('')

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Fetch settings when modal opens
  useEffect(() => {
    if (!isOpen) return

    const loadSettings = async () => {
      setLoadingSettings(true)
      try {
        const res = await fetch('/api/launch/active')
        const data = await res.json()
        if (data.settings) {
          setSettings(data.settings)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoadingSettings(false)
      }
    }

    loadSettings()
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const formatConfig =
    settings.formats.find((f) => f.format === selectedFormat) || settings.formats[0]

  const isPhysical = formatConfig.is_physical
  const isDomestic = country && (country.toLowerCase().includes('ghana') || country.toLowerCase().includes('gh'))
  const shippingFee = isPhysical
    ? isDomestic
      ? Number(settings.shipping_fee_domestic || 10.0)
      : Number(settings.shipping_fee_international || 25.0)
    : 0

  const subtotal = (Number(formatConfig.price) || 29.99) * quantity
  const totalAmount = subtotal + shippingFee

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2500)
  }

  // Handle Receipt Upload
  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingReceipt(true)
    setErrorMsg('')
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
        setErrorMsg(data.error || 'Receipt upload failed')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error uploading receipt')
    } finally {
      setUploadingReceipt(false)
    }
  }

  // Handle Order Placement (Transitions to Step 4/5)
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')

    try {
      const actualPaymentMethod =
        paymentMethod === 'usdt_trc20' || paymentMethod === 'usdt_erc20' || paymentMethod === 'usdt_bep20'
          ? `usdt_${selectedUsdtNetwork}` as PaymentMethodType
          : paymentMethod

      const res = await fetch('/api/presale/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          country,
          book_format: selectedFormat,
          quantity,
          shipping_address: isPhysical
            ? {
                street,
                city,
                state: stateRegion,
                postal_code: postalCode,
                country,
                notes,
              }
            : null,
          payment_method: actualPaymentMethod,
          notes,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setCreatedOrder(data.order)
        setTrackingUrl(data.tracking_url)
        setStep(4) // Move to Payment Proof Submission
      } else {
        setErrorMsg(data.error || 'Could not create presale order.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Payment Proof Submission
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createdOrder) return

    setSubmitting(true)
    setErrorMsg('')

    try {
      const actualMethod = createdOrder.payment_method

      const res = await fetch('/api/presale/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: createdOrder.access_token,
          order_id: createdOrder.id,
          order_number: createdOrder.order_number,
          payment_method: actualMethod,
          reference_number: referenceNumber || undefined,
          transaction_hash: transactionHash || undefined,
          sender_name_or_phone: senderNameOrPhone || customerName,
          crypto_network: actualMethod.startsWith('usdt') ? selectedUsdtNetwork.toUpperCase() : actualMethod === 'btc' ? 'BTC' : undefined,
          amount_submitted: totalAmount,
          currency: settings.currency || 'USD',
          receipt_url: receiptUrl || undefined,
          notes: proofNotes || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStep(5) // Final Confirmation
      } else {
        setErrorMsg(data.error || 'Failed to submit payment evidence.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error submitting proof.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="presale-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose()
      }}
    >
      <div className="presale-modal-card" role="dialog" aria-modal="true" aria-label="Presale Checkout">
        {/* Header */}
        <div className="presale-modal-header">
          <div className="presale-header-info">
            <span className="presale-header-badge">
              <Sparkles size={12} /> OFFICIAL AUTHOR PRESALE
            </span>
            <h2>Practical Trading Psychology</h2>
            <p className="presale-header-tagline">Process Over Profit · Win in the mind first</p>
          </div>
          <button className="icon-button" onClick={onClose} disabled={submitting} aria-label="Close checkout">
            <X />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="presale-stepper">
          <div className={`step-item ${step >= 1 ? 'is-active' : ''} ${step > 1 ? 'is-completed' : ''}`}>
            <span className="step-num">{step > 1 ? <Check size={12} /> : '1'}</span>
            <span className="step-label">Edition</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'is-active' : ''}`} />
          <div className={`step-item ${step >= 2 ? 'is-active' : ''} ${step > 2 ? 'is-completed' : ''}`}>
            <span className="step-num">{step > 2 ? <Check size={12} /> : '2'}</span>
            <span className="step-label">Details</span>
          </div>
          <div className={`step-line ${step >= 3 ? 'is-active' : ''}`} />
          <div className={`step-item ${step >= 3 ? 'is-active' : ''} ${step > 3 ? 'is-completed' : ''}`}>
            <span className="step-num">{step > 3 ? <Check size={12} /> : '3'}</span>
            <span className="step-label">Payment</span>
          </div>
          <div className={`step-line ${step >= 4 ? 'is-active' : ''}`} />
          <div className={`step-item ${step >= 4 ? 'is-active' : ''} ${step > 4 ? 'is-completed' : ''}`}>
            <span className="step-num">{step > 4 ? <Check size={12} /> : '4'}</span>
            <span className="step-label">Evidence</span>
          </div>
        </div>

        {errorMsg && (
          <div className="presale-error-banner">
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ================= STEP 1: FORMAT SELECTION ================= */}
        {step === 1 && (
          <div className="presale-step-body">
            <div className="step-heading">
              <p className="eyebrow">Step 1 of 4</p>
              <h3>Select your book format</h3>
              <p className="step-desc">Choose between digital instant delivery or limited signed physical editions.</p>
            </div>

            <div className="format-options-grid">
              {settings.formats.map((fmt) => (
                <div
                  key={fmt.format}
                  className={`format-card ${selectedFormat === fmt.format ? 'is-selected' : ''}`}
                  onClick={() => setSelectedFormat(fmt.format)}
                >
                  <div className="format-card-header">
                    <div className="format-radio">
                      <div className={`radio-dot ${selectedFormat === fmt.format ? 'is-checked' : ''}`} />
                    </div>
                    <div>
                      <strong className="format-name">{fmt.name}</strong>
                      <span className="format-type-tag">
                        {fmt.is_physical ? <Package size={12} /> : <BookOpen size={12} />}
                        {fmt.is_physical ? 'Physical Print' : 'Digital eBook'}
                      </span>
                    </div>
                    <div className="format-price">${Number(fmt.price).toFixed(2)}</div>
                  </div>
                  <p className="format-desc">{fmt.description}</p>
                </div>
              ))}
            </div>

            {/* Quantity Selector for Physical Copies */}
            {isPhysical && (
              <div className="quantity-row">
                <label>Number of Copies:</label>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    disabled={quantity >= 20}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Summary Footer */}
            <div className="presale-summary-bar">
              <div>
                <span className="summary-label">Estimated Total:</span>
                <strong className="summary-price">${subtotal.toFixed(2)} USD</strong>
                {isPhysical && <small className="shipping-hint">+ Shipping calculated next step</small>}
              </div>
              <button className="button button-dark" onClick={() => setStep(2)}>
                Continue to Details <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CUSTOMER & SHIPPING DETAILS ================= */}
        {step === 2 && (
          <div className="presale-step-body">
            <div className="step-heading">
              <p className="eyebrow">Step 2 of 4</p>
              <h3>Customer & Delivery details</h3>
              <p className="step-desc">Enter your recipient information for order verification and delivery.</p>
            </div>

            <form
              id="customer-details-form"
              onSubmit={(e) => {
                e.preventDefault()
                setStep(3)
              }}
              className="presale-form-grid"
            >
              <div className="form-row-2">
                <label>
                  Full Name <span className="req">*</span>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Samuel Bedi"
                  />
                </label>
                <label>
                  Email Address (for order tracking & eBook) <span className="req">*</span>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className="form-row-2">
                <label>
                  Phone Number (optional for SMS/delivery alerts)
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+233 55 123 4567"
                  />
                </label>
                <label>
                  Country <span className="req">*</span>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} required>
                    <option value="Ghana">Ghana</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Kenya">Kenya</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Germany">Germany</option>
                    <option value="Other">Other International Country</option>
                  </select>
                </label>
              </div>

              {/* Physical Shipping Address fields */}
              {isPhysical && (
                <div className="shipping-fields-box">
                  <div className="shipping-box-header">
                    <Truck size={16} />
                    <strong>Physical Dispatch Address ({isDomestic ? 'Domestic Ghana' : 'International Express'})</strong>
                  </div>
                  <label>
                    Street Address & Apartment / Landmark <span className="req">*</span>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. House 42, Independence Avenue, Airport Hills"
                    />
                  </label>
                  <div className="form-row-3">
                    <label>
                      City / Town <span className="req">*</span>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Accra"
                      />
                    </label>
                    <label>
                      State / Region
                      <input
                        type="text"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        placeholder="e.g. Greater Accra"
                      />
                    </label>
                    <label>
                      Postal Code / Digital Address
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. GA-183-9022"
                      />
                    </label>
                  </div>
                </div>
              )}

              <label>
                Special Delivery Notes or Dedication Request (optional)
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any delivery instructions or note for Dr. Elvis..."
                />
              </label>

              <div className="presale-summary-bar">
                <button type="button" className="text-button" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back to Format
                </button>
                <div className="summary-price-box">
                  <span className="summary-label">
                    Total (incl. {shippingFee > 0 ? `$${shippingFee.toFixed(2)} shipping` : 'digital delivery'}):
                  </span>
                  <strong className="summary-price">${totalAmount.toFixed(2)} USD</strong>
                </div>
                <button type="submit" className="button button-dark">
                  Select Payment Method <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 3: PAYMENT METHOD & INSTRUCTIONS ================= */}
        {step === 3 && (
          <div className="presale-step-body">
            <div className="step-heading">
              <p className="eyebrow">Step 3 of 4</p>
              <h3>Select payment method</h3>
              <p className="step-desc">
                Choose your preferred payment channel. Mobile Money (MTN & Telecel Cash), Bitcoin (BTC), and Tether (USDT TRC20) are supported with verified audit tracking.
              </p>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="payment-method-tabs">
              {settings.bank?.enabled && (
                <button
                  type="button"
                  className={`pay-tab ${paymentMethod === 'bank_transfer' ? 'is-active' : ''}`}
                  onClick={() => setPaymentMethod('bank_transfer')}
                >
                  <Banknote size={16} /> Bank Wire / Transfer
                </button>
              )}
              <button
                type="button"
                className={`pay-tab ${paymentMethod === 'mtn_momo' ? 'is-active' : ''}`}
                onClick={() => setPaymentMethod('mtn_momo')}
              >
                <Smartphone size={16} /> MTN Mobile Money
              </button>
              <button
                type="button"
                className={`pay-tab ${paymentMethod === 'vodafone_momo' ? 'is-active' : ''}`}
                onClick={() => setPaymentMethod('vodafone_momo')}
              >
                <Smartphone size={16} /> Telecel / Vodafone Cash
              </button>
              <button
                type="button"
                className={`pay-tab ${paymentMethod === 'btc' ? 'is-active' : ''}`}
                onClick={() => setPaymentMethod('btc')}
              >
                <Bitcoin size={16} /> Bitcoin (BTC)
              </button>
              <button
                type="button"
                className={`pay-tab ${paymentMethod.startsWith('usdt') ? 'is-active' : ''}`}
                onClick={() => setPaymentMethod('usdt_trc20')}
              >
                <Wallet size={16} /> Tether (USDT TRC20)
              </button>
            </div>

            {/* Payment Details Container */}
            <div className="payment-details-card">
              {/* Option A: Bank Transfer (Only if enabled) */}
              {paymentMethod === 'bank_transfer' && settings.bank?.enabled && (
                <div className="pay-instruction-pane">
                  <div className="pane-header">
                    <h4>Direct Bank Wire / Transfer</h4>
                    <span className="verified-tag"><ShieldCheck size={13} /> Official Publisher Account</span>
                  </div>
                  <div className="account-details-grid">
                    <div className="detail-item">
                      <span>Bank Name:</span>
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
                        onClick={() => copyToClipboard(settings.bank.account_number, 'bank_acc')}
                      >
                        {copiedKey === 'bank_acc' ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                    <div className="detail-item">
                      <span>Routing / Sort Code:</span>
                      <code>{settings.bank.routing_or_sort_code || 'SCBLGHAC'}</code>
                    </div>
                    <div className="detail-item">
                      <span>Swift / BIC:</span>
                      <code>{settings.bank.swift_bic || 'SCBLGHACXXX'}</code>
                    </div>
                    <div className="detail-item">
                      <span>Supported Currency:</span>
                      <strong>{settings.bank.currency}</strong>
                    </div>
                  </div>
                  <p className="pay-instruction-note">{settings.bank.instructions}</p>
                </div>
              )}

              {/* Option B: MTN Mobile Money */}
              {paymentMethod === 'mtn_momo' && (
                <div className="pay-instruction-pane">
                  <div className="pane-header">
                    <h4>MTN Mobile Money (MoMo)</h4>
                    <span className="verified-tag"><ShieldCheck size={13} /> Official Merchant / Momo</span>
                  </div>
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
                      <span>Merchant / Phone Number:</span>
                      <code>{settings.mtn_momo.phone_or_merchant_id}</code>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => copyToClipboard(settings.mtn_momo.phone_or_merchant_id, 'mtn_num')}
                      >
                        {copiedKey === 'mtn_num' ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                    <div className="detail-item">
                      <span>Country / Region:</span>
                      <strong>{settings.mtn_momo.country}</strong>
                    </div>
                  </div>
                  <p className="pay-instruction-note">{settings.mtn_momo.instructions}</p>
                </div>
              )}

              {/* Option C: Vodafone / Telecel Cash */}
              {paymentMethod === 'vodafone_momo' && (
                <div className="pay-instruction-pane">
                  <div className="pane-header">
                    <h4>Telecel Cash / Vodafone Cash</h4>
                    <span className="verified-tag"><ShieldCheck size={13} /> Official Merchant Till</span>
                  </div>
                  <div className="account-details-grid">
                    <div className="detail-item">
                      <span>Service Name:</span>
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
                        onClick={() => copyToClipboard(settings.vodafone_momo.phone_or_merchant_id, 'voda_num')}
                      >
                        {copiedKey === 'voda_num' ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                    <div className="detail-item">
                      <span>Country:</span>
                      <strong>{settings.vodafone_momo.country}</strong>
                    </div>
                  </div>
                  <p className="pay-instruction-note">{settings.vodafone_momo.instructions}</p>
                </div>
              )}

              {/* Option D: Bitcoin (BTC) */}
              {paymentMethod === 'btc' && (
                <div className="pay-instruction-pane">
                  <div className="pane-header">
                    <h4>Bitcoin (BTC) Payment</h4>
                    <span className="verified-tag crypto-tag"><Bitcoin size={13} /> Bitcoin Mainnet</span>
                  </div>
                  <div className="crypto-warning-box">
                    <ShieldAlert size={16} />
                    <span>Send only BTC to this address via Bitcoin Mainnet. Sending other tokens or via Lightning may result in loss of funds.</span>
                  </div>
                  <div className="crypto-address-box">
                    <span className="crypto-addr-label">Receiving Bitcoin Address:</span>
                    <div className="crypto-addr-row">
                      <code>{settings.btc.wallet_address}</code>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => copyToClipboard(settings.btc.wallet_address, 'btc_addr')}
                      >
                        {copiedKey === 'btc_addr' ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                  <p className="pay-instruction-note">{settings.btc.instructions}</p>
                </div>
              )}

              {/* Option E: Tether (USDT TRC20) */}
              {paymentMethod.startsWith('usdt') && (
                <div className="pay-instruction-pane">
                  <div className="pane-header">
                    <h4>Tether (USDT - TRC20)</h4>
                    <span className="verified-tag crypto-tag"><Wallet size={13} /> TRON (TRC20) Network</span>
                  </div>

                  <div className="crypto-warning-box">
                    <ShieldAlert size={16} />
                    <span>
                      Make sure you select the <strong>TRON (TRC20)</strong> network in your exchange or wallet. Transfers sent on other networks cannot be recovered.
                    </span>
                  </div>

                  <div className="crypto-address-box">
                    <span className="crypto-addr-label">
                      Receiving USDT Address (TRC20 - TRON):
                    </span>
                    <div className="crypto-addr-row">
                      <code>{settings.usdt.trc20_address}</code>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => copyToClipboard(settings.usdt.trc20_address, 'usdt_addr')}
                      >
                        {copiedKey === 'usdt_addr' ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                  <p className="pay-instruction-note">{settings.usdt.instructions}</p>
                </div>
              )}
            </div>

            {/* Presale Action & Order Lock */}
            <div className="presale-summary-bar">
              <button type="button" className="text-button" onClick={() => setStep(2)} disabled={submitting}>
                <ArrowLeft size={16} /> Back to Details
              </button>
              <div className="summary-price-box">
                <span className="summary-label">Amount Due:</span>
                <strong className="summary-price">${totalAmount.toFixed(2)} USD</strong>
              </div>
              <button
                type="button"
                className="button button-dark"
                disabled={submitting}
                onClick={handleCreateOrder}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Creating Pre-order...
                  </>
                ) : (
                  <>
                    Generate Order & Submit Proof <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SUBMIT PAYMENT PROOF ================= */}
        {step === 4 && createdOrder && (
          <div className="presale-step-body">
            <div className="step-heading">
              <p className="eyebrow">Step 4 of 4</p>
              <h3>Submit payment evidence</h3>
              <p className="step-desc">
                Your order has been registered as <strong>#{createdOrder.order_number}</strong>. Please upload your payment receipt screenshot or paste your transaction reference below.
              </p>
            </div>

            <div className="order-receipt-highlight">
              <div>
                <span>Order Reference:</span>
                <strong>{createdOrder.order_number}</strong>
              </div>
              <div>
                <span>Amount:</span>
                <strong>${Number(createdOrder.total_amount).toFixed(2)} USD</strong>
              </div>
              <div>
                <span>Payment Method:</span>
                <strong style={{ textTransform: 'capitalize' }}>
                  {createdOrder.payment_method.replace(/_/g, ' ')}
                </strong>
              </div>
            </div>

            <form onSubmit={handleSubmitProof} className="presale-form-grid">
              {/* Reference Number or Hash */}
              <div className="form-row-2">
                <label>
                  Bank Transfer Reference / Transaction ID / Tx Hash
                  <input
                    type="text"
                    value={
                      createdOrder.payment_method.startsWith('btc') || createdOrder.payment_method.startsWith('usdt')
                        ? transactionHash
                        : referenceNumber
                    }
                    onChange={(e) => {
                      if (createdOrder.payment_method.startsWith('btc') || createdOrder.payment_method.startsWith('usdt')) {
                        setTransactionHash(e.target.value)
                      } else {
                        setReferenceNumber(e.target.value)
                      }
                    }}
                    placeholder={
                      createdOrder.payment_method.startsWith('btc') || createdOrder.payment_method.startsWith('usdt')
                        ? 'e.g. 0x8f7d9a1c... or 64-char transaction hash'
                        : 'e.g. SCB-9831920 or MTN MoMo Transaction ID'
                    }
                  />
                </label>
                <label>
                  Sender Account Name or MoMo Phone
                  <input
                    type="text"
                    value={senderNameOrPhone}
                    onChange={(e) => setSenderNameOrPhone(e.target.value)}
                    placeholder="Name appearing on transfer or sender phone"
                  />
                </label>
              </div>

              {/* Upload Screenshot */}
              <div className="cloudinary-upload-box">
                <label className="cloudinary-label">
                  <UploadCloud size={20} />
                  <span>Upload Payment Receipt / Transfer Screenshot (PNG, JPG, PDF)</span>
                  <input type="file" accept="image/*,application/pdf" onChange={handleReceiptUpload} />
                </label>
                {uploadingReceipt && (
                  <p className="uploading-text">
                    <Loader2 className="animate-spin" size={14} /> Uploading proof to secure storage...
                  </p>
                )}
                {receiptUrl && (
                  <div className="cover-preview-row">
                    <CheckCircle2 size={16} color="var(--primary)" />
                    <span>Proof attached: {receiptUrl.slice(0, 45)}...</span>
                  </div>
                )}
              </div>

              <label>
                Additional Notes or Remarks (optional)
                <textarea
                  rows={2}
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="Any additional information for the verification team..."
                />
              </label>

              <div className="presale-summary-bar">
                <button
                  type="button"
                  className="text-button"
                  onClick={onClose}
                >
                  Close & Pay Later
                </button>
                <button
                  type="submit"
                  className="button button-dark"
                  disabled={submitting || uploadingReceipt}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Submitting Evidence...
                    </>
                  ) : (
                    <>
                      Submit Proof for Verification <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 5: FINAL CONFIRMATION ================= */}
        {step === 5 && createdOrder && (
          <div className="presale-step-body presale-success-body">
            <div className="success-icon-circle">
              <CheckCircle2 size={44} />
            </div>
            <h2>Pre-order Successfully Registered!</h2>
            <p className="success-desc">
              Your order <strong>#{createdOrder.order_number}</strong> has been logged and your payment evidence is now <strong>Under Review</strong> by our finance team.
            </p>

            <div className="confirmation-meta-card">
              <div className="meta-row">
                <span>Customer:</span>
                <strong>{customerName} ({customerEmail})</strong>
              </div>
              <div className="meta-row">
                <span>Selected Edition:</span>
                <strong>{formatConfig.name}</strong>
              </div>
              <div className="meta-row">
                <span>Total Amount:</span>
                <strong>${totalAmount.toFixed(2)} USD</strong>
              </div>
              <div className="meta-row">
                <span>Verification Status:</span>
                <span className="status-badge status-review">Under Review</span>
              </div>
            </div>

            <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
              <Link
                href="/contact"
                className="button button-dark"
                onClick={onClose}
              >
                <HelpCircle size={16} /> Contact Support <ArrowRight size={15} />
              </Link>
              <button className="button button-light" onClick={onClose}>
                Return to Website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
