'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  BarChart3,
  Bitcoin,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  Maximize2,
  Package,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Trash2,
  Truck,
  UploadCloud,
  Users,
  Wallet,
  X,
  XCircle,
  ZoomIn,
} from 'lucide-react'
import {
  Book,
  BookLaunch,
  BookFormat,
  PaymentMethodType,
  PaymentStatus,
  FulfilmentStatus,
  PaymentSettings,
  BookPreview,
  PreviewChapter,
  DEFAULT_PAYMENT_SETTINGS,
  DEFAULT_BOOK_PREVIEW,
} from '@/lib/types'
import { useStore } from '@/components/store-provider'

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [authMode, setAuthMode] = useState<'login' | 'forgot' | 'verify'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        onLogin()
      } else {
        setError(data.error || 'Invalid credentials. Please verify your password.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSuccessMsg(data.message || `A 6-digit verification code has been dispatched to ${email}`)
        setAuthMode('verify')
      } else {
        setError(data.error || 'Failed to dispatch reset code.')
      }
    } catch {
      setError('Network error sending verification code.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please re-enter.')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('/api/admin/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: otpCode,
          new_password: newPassword,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSuccessMsg('Password updated successfully! Sign in with your new password.')
        setPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setOtpCode('')
        setAuthMode('login')
      } else {
        setError(data.error || 'Invalid or expired code.')
      }
    } catch {
      setError('Network error resetting password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-card">
        <div className="admin-auth-mark">
          {authMode === 'login' ? <LockKeyhole /> : <KeyRound />}
        </div>
        <p className="eyebrow">Serendipity / Elvis Admin</p>

        {/* MODE 1: LOGIN */}
        {authMode === 'login' && (
          <>
            <h2>Administrator Portal</h2>
            <p className="admin-auth-sub">Enter your credentials to access the book launch and presale control center.</p>
            {error && <p className="admin-error-banner">{error}</p>}
            {successMsg && <p className="admin-success-banner"><CheckCircle2 /> {successMsg}</p>}
            <form onSubmit={handleSignIn} className="admin-auth-form">
              <label>
                Admin Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@elvisjusticebooks.com"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                />
              </label>
              <button className="button button-dark" type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <>Sign in to Portal <ArrowRight /></>}
              </button>
            </form>
            <div className="admin-card-actions">
              <button
                className="admin-forgot-btn"
                onClick={() => {
                  setError('')
                  setSuccessMsg('')
                  setAuthMode('forgot')
                }}
              >
                Forgot Password?
              </button>
            </div>
          </>
        )}

        {/* MODE 2: FORGOT PASSWORD */}
        {authMode === 'forgot' && (
          <>
            <h2>Reset Password</h2>
            <p className="admin-auth-sub">We will dispatch a secure 6-digit OTP code to your registered email address.</p>
            {error && <p className="admin-error-banner">{error}</p>}
            <form onSubmit={handleRequestResetCode} className="admin-auth-form">
              <label>
                Admin Email Address
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@elvisjusticebooks.com"
                />
              </label>
              <button className="button button-dark" type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <>Send Verification Code <ArrowRight /></>}
              </button>
            </form>
            <div className="admin-card-actions">
              <button
                className="text-button"
                onClick={() => {
                  setError('')
                  setSuccessMsg('')
                  setAuthMode('login')
                }}
              >
                <ArrowLeft /> Back to sign in
              </button>
            </div>
          </>
        )}

        {/* MODE 3: VERIFY OTP */}
        {authMode === 'verify' && (
          <>
            <h2>Enter 6-Digit Code</h2>
            <p className="admin-auth-sub">Check your inbox for the OTP verification code dispatched to <strong>{email}</strong>.</p>
            {successMsg && <p className="admin-success-banner"><CheckCircle2 /> {successMsg}</p>}
            {error && <p className="admin-error-banner">{error}</p>}
            <form onSubmit={handleVerifyAndResetPassword} className="admin-auth-form">
              <label>
                6-Digit Verification Code
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="admin-otp-input"
                />
              </label>
              <label>
                New Password (minimum 6 characters)
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create strong new password"
                />
              </label>
              <label>
                Confirm New Password
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </label>
              <button className="button button-dark" type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <>Update & Activate Password <ArrowRight /></>}
              </button>
            </form>
            <div className="admin-card-actions">
              <button
                className="admin-forgot-btn"
                onClick={handleRequestResetCode}
                disabled={loading}
              >
                Resend code
              </button>
              <button
                className="text-button"
                onClick={() => {
                  setError('')
                  setSuccessMsg('')
                  setAuthMode('login')
                }}
              >
                <ArrowLeft /> Back to sign in
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

const AUTHOR_NAME = 'Dr Elvis Justice Bedi'
const AUTHOR_IMAGE = '/elvis.jpeg'
const AUTHOR_BIO =
  'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.'

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { booksList, refreshBooks, activeLaunch, refreshLaunch } = useStore()
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'presales' | 'payment-settings' | 'preview-editor' | 'audit-logs' | 'launches' | 'books' | 'messages' | 'subscribers'
  >('overview')

  const [stats, setStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Presales State & Orders
  const [presalesList, setPresalesList] = useState<any[]>([])
  const [presaleStats, setPresaleStats] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all')
  const [filterFulfilmentStatus, setFilterFulfilmentStatus] = useState('all')
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all')
  const [filterFormat, setFilterFormat] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  // Receipt Inspection & Lightbox Modal
  const [viewingReceiptModal, setViewingReceiptModal] = useState<{
    url: string
    orderNumber?: string
    customerName?: string
    referenceNumber?: string
    submittedAt?: string
  } | null>(null)

  // Payment Verification Modals
  const [orderToVerify, setOrderToVerify] = useState<any | null>(null)
  const [verifyNote, setVerifyNote] = useState('')
  const [verifyingPayment, setVerifyingPayment] = useState(false)

  // Payment Rejection Modal
  const [orderToReject, setOrderToReject] = useState<any | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectingPayment, setRejectingPayment] = useState(false)

  // Fulfilment Update Modal
  const [orderForFulfilment, setOrderForFulfilment] = useState<any | null>(null)
  const [newFulfilmentStatus, setNewFulfilmentStatus] = useState<FulfilmentStatus>('Confirmed')
  const [trackingReference, setTrackingReference] = useState('')
  const [courierName, setCourierName] = useState('SpeedPost / DHL')
  const [updatingFulfilment, setUpdatingFulfilment] = useState(false)

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS)
  const [savingSettings, setSavingSettings] = useState(false)

  // Preview Editor State
  const [bookPreview, setBookPreview] = useState<BookPreview>(DEFAULT_BOOK_PREVIEW)
  const [editingChapter, setEditingChapter] = useState<PreviewChapter | null>(null)
  const [savingPreview, setSavingPreview] = useState(false)

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  // Launches & Books
  const [launchesList, setLaunchesList] = useState<BookLaunch[]>([])
  const [selectedLaunchRegs, setSelectedLaunchRegs] = useState<any[] | null>(null)
  const [selectedLaunchTitle, setSelectedLaunchTitle] = useState('')
  const [showNewLaunchModal, setShowNewLaunchModal] = useState(false)
  const [newLaunchTitle, setNewLaunchTitle] = useState('')
  const [newLaunchTagline, setNewLaunchTagline] = useState('Process over profit.\nWin in the mind first.')
  const [newLaunchDate, setNewLaunchDate] = useState('2026-11-06T09:00')
  const [newLaunchThemes, setNewLaunchThemes] = useState('Emotional discipline, Process over outcome, Managing psychology, Building consistency')
  const [newLaunchCover, setNewLaunchCover] = useState('/practical-trading-psychology.png')
  const [newLaunchDesc, setNewLaunchDesc] = useState('A practical exploration of the mindset, discipline, and emotional control that shape a trader\'s journey.')
  const [newLaunchActive, setNewLaunchActive] = useState(true)
  const [savingNewLaunch, setSavingNewLaunch] = useState(false)

  // Edit Launch State
  const [showEditLaunchModal, setShowEditLaunchModal] = useState(false)
  const [editLaunchId, setEditLaunchId] = useState('')
  const [editLaunchTitle, setEditLaunchTitle] = useState('')
  const [editLaunchTagline, setEditLaunchTagline] = useState('')
  const [editLaunchDesc, setEditLaunchDesc] = useState('')
  const [editLaunchThemes, setEditLaunchThemes] = useState('')
  const [editLaunchCover, setEditLaunchCover] = useState('')
  const [editLaunchDate, setEditLaunchDate] = useState('')
  const [editLaunchActive, setEditLaunchActive] = useState(true)
  const [savingLaunch, setSavingLaunch] = useState(false)

  // Books
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [newBookTitle, setNewBookTitle] = useState('')
  const [newBookCategory, setNewBookCategory] = useState('Mind & Money')
  const [newBookPrice, setNewBookPrice] = useState('$24.00')
  const [newBookDesc, setNewBookDesc] = useState('')
  const [newBookCover, setNewBookCover] = useState('')
  const [newBookPdf, setNewBookPdf] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [savingBook, setSavingBook] = useState(false)

  // Other Lists
  const [messagesList, setMessagesList] = useState<any[]>([])
  const [subscribersList, setSubscribersList] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4500)
  }

  // Change Password
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [currPassword, setCurrPassword] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('')
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState('')

  // Delete Book State
  const [bookToDelete, setBookToDelete] = useState<{ id: string; title: string } | null>(null)
  const [deletingBook, setDeletingBook] = useState(false)

  // Launch Distribution & Scheduled Sending Hub
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [broadcastTab, setBroadcastTab] = useState<'announcement' | 'presale_delivery' | 'history'>('announcement')
  const [audienceSummary, setAudienceSummary] = useState<{
    launch_title: string
    launch_date: string
    waitlist_count: number
    newsletter_count: number
    total_unique_recipients: number
    confirmed_presale_orders_count: number
    early_delivery_enabled: boolean
  } | null>(null)
  const [loadingAudience, setLoadingAudience] = useState(false)

  // Announcement Form State
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastCustomMsg, setBroadcastCustomMsg] = useState('')
  const [includeWaitlist, setIncludeWaitlist] = useState(true)
  const [includeNewsletter, setIncludeNewsletter] = useState(true)
  const [broadcastScheduleMode, setBroadcastScheduleMode] = useState<'immediate' | 'scheduled'>('scheduled')
  const [broadcastScheduledDate, setBroadcastScheduledDate] = useState('2026-11-06T09:00')
  const [sendingBroadcast, setSendingBroadcast] = useState(false)

  // Presale Delivery Form State
  const [deliveryScheduleMode, setDeliveryScheduleMode] = useState<'immediate' | 'scheduled'>('scheduled')
  const [deliveryScheduledDate, setDeliveryScheduledDate] = useState('2026-11-06T09:00')
  const [deliveringBooks, setDeliveringBooks] = useState(false)
  const [onlyUndeliveredOrders, setOnlyUndeliveredOrders] = useState(false)

  // Broadcast History
  const [broadcastCampaigns, setBroadcastCampaigns] = useState<any[]>([])
  const [loadingCampaigns, setLoadingCampaigns] = useState(false)

  const openBroadcastHub = async (tab: 'announcement' | 'presale_delivery' | 'history' = 'announcement') => {
    setBroadcastTab(tab)
    setShowBroadcastModal(true)
    setLoadingAudience(true)
    try {
      const [sumRes, campRes] = await Promise.all([
        fetch('/api/admin/launches/recipients-summary'),
        fetch('/api/admin/broadcasts'),
      ])
      const sumData = await sumRes.json()
      if (sumData.success && sumData.summary) {
        setAudienceSummary(sumData.summary)
        if (sumData.summary.launch_date) {
          try {
            const dtStr = new Date(sumData.summary.launch_date).toISOString().slice(0, 16)
            setBroadcastScheduledDate(dtStr)
            setDeliveryScheduledDate(dtStr)
          } catch {}
        }
      }
      const campData = await campRes.json()
      if (campData.success && campData.campaigns) {
        setBroadcastCampaigns(campData.campaigns)
      }
    } catch (e) {
      console.error('Error fetching broadcast summary:', e)
    } finally {
      setLoadingAudience(false)
    }
  }

  const handleSendLaunchBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingBroadcast(true)
    try {
      const payload = {
        subject: broadcastSubject || undefined,
        custom_message: broadcastCustomMsg || undefined,
        scheduled_at: broadcastScheduleMode === 'scheduled' ? broadcastScheduledDate : undefined,
        include_waitlist: includeWaitlist,
        include_newsletter: includeNewsletter,
      }
      const res = await fetch('/api/admin/launches/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(data.message || 'Launch announcement processed successfully!')
        setShowBroadcastModal(false)
        loadAdminData()
      } else {
        alert(data.error || 'Failed to dispatch launch broadcast.')
      }
    } catch {
      alert('Network error dispatching broadcast.')
    } finally {
      setSendingBroadcast(false)
    }
  }

  const handleDeliverPresaleBooks = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeliveringBooks(true)
    try {
      const payload = {
        scheduled_at: deliveryScheduleMode === 'scheduled' ? deliveryScheduledDate : undefined,
        only_undelivered: onlyUndeliveredOrders,
      }
      const res = await fetch('/api/admin/launches/deliver-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(data.message || 'Presale book delivery processed successfully!')
        setShowBroadcastModal(false)
        loadAdminData()
      } else {
        alert(data.error || 'Failed to deliver presale books.')
      }
    } catch {
      alert('Network error delivering books.')
    } finally {
      setDeliveringBooks(false)
    }
  }

  // Load All Admin Data
  const loadAdminData = async () => {
    setLoadingData(true)
    try {
      const [
        statsRes,
        presalesRes,
        launchesRes,
        msgsRes,
        subsRes,
        settingsRes,
        previewRes,
        auditRes,
      ] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/presales?search=${encodeURIComponent(searchQuery)}&payment_status=${filterPaymentStatus}&fulfilment_status=${filterFulfilmentStatus}&payment_method=${filterPaymentMethod}&book_format=${filterFormat}`),
        fetch('/api/admin/launches'),
        fetch('/api/admin/messages'),
        fetch('/api/admin/subscribers'),
        fetch('/api/admin/settings/payments'),
        fetch('/api/admin/preview'),
        fetch('/api/admin/audit-logs'),
      ])

      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
        setRecentActivity(statsData.recentActivity || [])
      }

      const presalesData = await presalesRes.json()
      if (presalesData.success) {
        setPresalesList(presalesData.orders || [])
        setPresaleStats(presalesData.stats || null)
      }

      const launchesData = await launchesRes.json()
      if (launchesData.success) setLaunchesList(launchesData.launches || [])

      const msgsData = await msgsRes.json()
      if (msgsData.success) setMessagesList(msgsData.messages || [])

      const subsData = await subsRes.json()
      if (subsData.success) setSubscribersList(subsData.subscribers || [])

      const settingsData = await settingsRes.json()
      if (settingsData.success && settingsData.settings) {
        setPaymentSettings(settingsData.settings)
      }

      const previewData = await previewRes.json()
      if (previewData.success && previewData.preview) {
        setBookPreview(previewData.preview)
      }

      const auditData = await auditRes.json()
      if (auditData.success && auditData.logs) {
        setAuditLogs(auditData.logs)
      }
    } catch (e) {
      console.error('Error loading admin data:', e)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [searchQuery, filterPaymentStatus, filterFulfilmentStatus, filterPaymentMethod, filterFormat])

  // Close receipt lightbox with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewingReceiptModal) {
        setViewingReceiptModal(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewingReceiptModal])

  // Payment Verification Handler
  const handleConfirmPayment = async () => {
    if (!orderToVerify) return
    setVerifyingPayment(true)
    try {
      const res = await fetch('/api/admin/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderToVerify.id,
          reference_note: verifyNote,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Payment confirmed for Order #${orderToVerify.order_number}! Customer email sent.`)
        setOrderToVerify(null)
        setVerifyNote('')
        if (selectedOrder?.id === orderToVerify.id) {
          setSelectedOrder({ ...selectedOrder, payment_status: 'Confirmed' })
        }
        loadAdminData()
      } else {
        alert(data.error || 'Failed to verify payment')
      }
    } catch (err: any) {
      alert(err.message || 'Error connecting to server')
    } finally {
      setVerifyingPayment(false)
    }
  }

  // Payment Rejection Handler
  const handleRejectPayment = async () => {
    if (!orderToReject) return
    if (!rejectionReason.trim()) {
      alert('Please specify a rejection reason for the customer.')
      return
    }
    setRejectingPayment(true)
    try {
      const res = await fetch('/api/admin/payments/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderToReject.id,
          rejection_reason: rejectionReason,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Order #${orderToReject.order_number} marked as Rejected. Customer was emailed.`)
        setOrderToReject(null)
        setRejectionReason('')
        if (selectedOrder?.id === orderToReject.id) {
          setSelectedOrder({ ...selectedOrder, payment_status: 'Rejected', rejection_reason: rejectionReason })
        }
        loadAdminData()
      } else {
        alert(data.error || 'Failed to reject payment')
      }
    } catch (err: any) {
      alert(err.message || 'Error connecting to server')
    } finally {
      setRejectingPayment(false)
    }
  }

  // Fulfilment Update Handler
  const handleUpdateFulfilment = async () => {
    if (!orderForFulfilment) return
    setUpdatingFulfilment(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderForFulfilment.id}/fulfilment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fulfilment_status: newFulfilmentStatus,
          tracking_reference: trackingReference,
          courier_name: courierName,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Fulfilment status for #${orderForFulfilment.order_number} updated to ${newFulfilmentStatus}.`)
        setOrderForFulfilment(null)
        loadAdminData()
      } else {
        alert(data.error || 'Failed to update fulfilment')
      }
    } catch (err: any) {
      alert(err.message || 'Error')
    } finally {
      setUpdatingFulfilment(false)
    }
  }

  // Save Payment & Presale Settings
  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    try {
      const res = await fetch('/api/admin/settings/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: paymentSettings }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Payment methods, crypto wallets, and presale pricing saved successfully!')
      } else {
        alert(data.error || 'Failed to save settings')
      }
    } catch (err: any) {
      alert(err.message || 'Network error')
    } finally {
      setSavingSettings(false)
    }
  }

  // Save Book Preview Content
  const handleSaveBookPreview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPreview(true)
    try {
      const res = await fetch('/api/admin/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preview: bookPreview }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Public book preview chapters and excerpts updated!')
      } else {
        alert(data.error || 'Failed to save preview')
      }
    } catch (err: any) {
      alert(err.message || 'Network error')
    } finally {
      setSavingPreview(false)
    }
  }

  // Cloudinary Upload
  const handleCloudinaryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrlCallback: (url: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok && data.url) {
        setUrlCallback(data.url)
        showToast('Image uploaded successfully!')
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err: any) {
      alert(err.message || 'Upload error')
    } finally {
      setUploadingImage(false)
    }
  }

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newAdminPassword !== confirmAdminPassword) {
      setPassError('New passwords do not match. Please re-enter.')
      return
    }
    if (newAdminPassword.length < 6) {
      setPassError('New password must be at least 6 characters.')
      return
    }

    setPassLoading(true)
    setPassError('')
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currPassword,
          new_password: newAdminPassword,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Admin password updated successfully! A security notice was sent to your email.')
        setShowChangePasswordModal(false)
        setCurrPassword('')
        setNewAdminPassword('')
        setConfirmAdminPassword('')
      } else {
        setPassError(data.error || 'Failed to update password.')
      }
    } catch {
      setPassError('Connection error while updating password.')
    } finally {
      setPassLoading(false)
    }
  }

  // Delete Book
  const confirmDeleteBook = async () => {
    if (!bookToDelete) return
    setDeletingBook(true)
    try {
      const res = await fetch(`/api/books/${bookToDelete.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success !== false) {
        showToast(`Book "${bookToDelete.title}" deleted permanently.`)
        setBookToDelete(null)
        refreshBooks()
        loadAdminData()
      } else {
        alert(data.error || 'Failed to delete book')
      }
    } catch (err: any) {
      alert(err.message || 'Connection error')
    } finally {
      setDeletingBook(false)
    }
  }

  // CSV Export Utility
  const exportCsv = (rows: any[], filename = 'export.csv') => {
    if (!rows.length) return
    const keys = Object.keys(rows[0])
    const csvContent = [
      keys.join(','),
      ...rows.map((row) =>
        keys
          .map((k) => {
            const val = typeof row[k] === 'object' ? JSON.stringify(row[k]) : String(row[k] ?? '')
            return `"${val.replace(/"/g, '""')}"`
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="admin-dashboard-page">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="admin-toast">
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {/* Top Admin Header */}
      <header className="admin-header">
        <div className="admin-header-title">
          <span className="wordmark-mark">S</span>
          <div>
            <h1>Dr. Elvis Justice Bedi Admin Portal</h1>
            <p className="admin-sub">
              Book Launch, Presale Management & Verified Payment Engine · v2.0
            </p>
          </div>
        </div>
        <div className="admin-header-controls">
          <button
            className="button button-light btn-sm"
            onClick={loadAdminData}
            disabled={loadingData}
          >
            <RefreshCw size={14} className={loadingData ? 'animate-spin' : ''} /> Refresh Data
          </button>
          <button
            className="button button-light btn-sm"
            onClick={() => setShowChangePasswordModal(true)}
          >
            <KeyRound size={14} /> Security & Password
          </button>
          <button className="button button-dark btn-sm" onClick={onLogout}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <nav className="admin-tabs-nav" aria-label="Admin Sections">
        <button
          className={activeTab === 'overview' ? 'is-active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={15} /> Overview & Analytics
        </button>
        <button
          className={activeTab === 'presales' ? 'is-active' : ''}
          onClick={() => setActiveTab('presales')}
        >
          <ShoppingBag size={15} /> Presale Orders ({presalesList.length})
          {presaleStats?.under_review > 0 && (
            <span className="tab-pill-badge">{presaleStats.under_review}</span>
          )}
        </button>
        <button
          className={activeTab === 'payment-settings' ? 'is-active' : ''}
          onClick={() => setActiveTab('payment-settings')}
        >
          <Wallet size={15} /> Payment Methods & Pricing
        </button>
        <button
          className={activeTab === 'preview-editor' ? 'is-active' : ''}
          onClick={() => setActiveTab('preview-editor')}
        >
          <BookOpen size={15} /> Book Preview Editor
        </button>
        <button
          className={activeTab === 'audit-logs' ? 'is-active' : ''}
          onClick={() => setActiveTab('audit-logs')}
        >
          <ShieldCheck size={15} /> Audit Trail ({auditLogs.length})
        </button>
        <button
          className={activeTab === 'launches' ? 'is-active' : ''}
          onClick={() => setActiveTab('launches')}
        >
          <Rocket size={15} /> Book Launches ({launchesList.length})
        </button>
        <button
          className={activeTab === 'books' ? 'is-active' : ''}
          onClick={() => setActiveTab('books')}
        >
          <BookOpen size={15} /> Books Catalog ({booksList.length})
        </button>
        <button
          className={activeTab === 'messages' ? 'is-active' : ''}
          onClick={() => setActiveTab('messages')}
        >
          <Mail size={15} /> Messages ({messagesList.length})
        </button>
        <button
          className={activeTab === 'subscribers' ? 'is-active' : ''}
          onClick={() => setActiveTab('subscribers')}
        >
          <Users size={15} /> Subscribers ({subscribersList.length})
        </button>
      </nav>

      {/* ================= TAB: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content">
          {/* Key Financial & Order Metrics */}
          <div className="admin-stats">
            <article className="stat-card">
              <span className="stat-icon"><ShoppingBag /></span>
              <p>Total Presale Orders</p>
              <strong>{presaleStats?.total_orders ?? presalesList.length}</strong>
              <small>All editions registered</small>
            </article>
            <article className="stat-card stat-alert-card">
              <span className="stat-icon stat-icon-amber"><AlertCircle /></span>
              <p>Payments Awaiting Review</p>
              <strong style={{ color: '#d97706' }}>{presaleStats?.under_review ?? 0}</strong>
              <small>Action needed in Queue</small>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-icon-green"><CheckCircle2 /></span>
              <p>Confirmed Preorders</p>
              <strong style={{ color: '#16a34a' }}>{presaleStats?.confirmed_count ?? 0}</strong>
              <small>Verified payments</small>
            </article>
            <article className="stat-card stat-revenue-card">
              <span className="stat-icon"><span className="admin-currency">$</span></span>
              <p>Verified Net Revenue</p>
              <strong>
                ${Number(presaleStats?.verified_revenue ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
              <small>Confirmed payments only</small>
            </article>
            <article className="stat-card">
              <span className="stat-icon"><Users /></span>
              <p>Waitlist Registrants</p>
              <strong>{stats?.registrationsCount ?? 0}</strong>
              <small>Launch notification list</small>
            </article>
          </div>

          {/* Launch Day Notification & Bulk Scheduled Fulfillment Control Center */}
          <div className="admin-broadcast-banner">
            <div className="broadcast-banner-info">
              <div className="broadcast-banner-badge">
                <Sparkles size={13} /> LAUNCH DISTRIBUTION & SCHEDULED SENDING
              </div>
              <h3>Launch Day Broadcast & Presale Book Delivery Hub</h3>
              <p>
                Dispatch scheduled announcements to deduplicated waitlist & newsletter subscribers (0 duplicate emails), and deliver digital books with download tokens to all paid presale orders.
              </p>
            </div>
            <div className="broadcast-banner-actions">
              <button
                type="button"
                className="button button-dark btn-sm"
                onClick={() => openBroadcastHub('announcement')}
              >
                <Mail size={14} /> Broadcast Launch to Audience
              </button>
              <button
                type="button"
                className="button button-light btn-sm"
                onClick={() => openBroadcastHub('presale_delivery')}
              >
                <Download size={14} /> Deliver Books to Presales
              </button>
            </div>
          </div>

          {/* Quick Review Queue + Launch Status */}
          <div className="admin-content-grid">
            {/* Quick Action Payment Queue */}
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Attention Required</p>
                  <h2>Payment Verification Queue</h2>
                </div>
                <button className="button button-light btn-sm" onClick={() => setActiveTab('presales')}>
                  View All Orders <ArrowRight size={13} />
                </button>
              </div>

              {presalesList.filter((o) => o.payment_status === 'Proof Submitted' || o.payment_status === 'Under Review').length > 0 ? (
                <div className="admin-table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Evidence</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {presalesList
                        .filter((o) => o.payment_status === 'Proof Submitted' || o.payment_status === 'Under Review')
                        .slice(0, 5)
                        .map((o) => (
                          <tr key={o.id}>
                            <td><code>{o.order_number}</code></td>
                            <td>
                              <strong>{o.customer_name}</strong>
                              <p className="table-sub">{o.customer_email}</p>
                            </td>
                            <td><strong>${Number(o.total_amount).toFixed(2)} USD</strong></td>
                            <td style={{ textTransform: 'capitalize' }}>
                              {o.payment_method?.replace(/_/g, ' ')}
                            </td>
                            <td>
                              {o.proofs && o.proofs.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span className="badge-sent">
                                    <FileCheck size={12} /> {o.proofs.length} Proof(s)
                                  </span>
                                  {o.proofs.some((p: any) => p.receipt_url) && (
                                    <button
                                      type="button"
                                      className="table-receipt-chip"
                                      title="Inspect receipt screenshot"
                                      onClick={() => {
                                        const p = o.proofs.find((item: any) => item.receipt_url)
                                        if (p) {
                                          setViewingReceiptModal({
                                            url: p.receipt_url,
                                            orderNumber: o.order_number,
                                            customerName: o.customer_name,
                                            referenceNumber: p.reference_number || p.transaction_hash,
                                            submittedAt: p.submitted_at,
                                          })
                                        }
                                      }}
                                    >
                                      <ImageIcon size={10} /> View Receipt
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="table-sub">None</span>
                              )}
                            </td>
                            <td>
                              <div className="table-action-btns">
                                <button
                                  className="button button-dark btn-sm"
                                  onClick={() => setOrderToVerify(o)}
                                >
                                  Verify
                                </button>
                                <button
                                  className="button button-light btn-sm"
                                  onClick={() => setOrderToReject(o)}
                                >
                                  Reject
                                </button>
                                <button
                                  className="icon-button"
                                  title="Inspect full details"
                                  onClick={() => setSelectedOrder(o)}
                                >
                                  <Eye size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-empty-state-box">
                  <CheckCircle2 size={32} color="#16a34a" />
                  <p>All submitted payment proofs have been verified! No pending items in queue.</p>
                </div>
              )}
            </section>

            {/* Active Book Launch Summary Card */}
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Current Featured Release</p>
                  <h2>{activeLaunch.title}</h2>
                </div>
                <button className="button button-light btn-sm" onClick={() => setActiveTab('launches')}>
                  Edit Launch <Settings2 size={13} />
                </button>
              </div>
              <div className="active-launch-card">
                <img src={activeLaunch.cover_image} alt={activeLaunch.title} className="active-launch-thumb" />
                <div className="active-launch-body">
                  <div className="active-launch-top">
                    <span className="launch-badge">LIVE STOREFRONT RELEASE</span>
                  </div>
                  <h3>{activeLaunch.title}</h3>
                  <p className="launch-card-meta">
                    Target Date: <strong suppressHydrationWarning>{new Date(activeLaunch.launch_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </p>
                  <p className="launch-card-tagline">{activeLaunch.tagline}</p>
                  <div className="active-launch-actions">
                    <button className="button button-dark btn-sm" onClick={() => setActiveTab('payment-settings')}>
                      <Wallet size={13} /> Configure Pricing & MoMo/Crypto
                    </button>
                    <button className="button button-light btn-sm" onClick={() => setActiveTab('preview-editor')}>
                      <BookOpen size={13} /> Edit Preview Excerpt
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ================= TAB: PRESALES ORDERS MANAGEMENT ================= */}
      {activeTab === 'presales' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Customer Presales</p>
              <h2>Book Presale Orders & Fulfilment</h2>
            </div>
            <div className="admin-header-actions">
              <button
                className="button button-dark btn-sm"
                onClick={() => openBroadcastHub('presale_delivery')}
              >
                <Download size={14} /> Deliver Digital Books
              </button>
              <button
                className="button button-light btn-sm"
                onClick={() => exportCsv(presalesList, `presale-orders-${Date.now()}.csv`)}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="admin-filters-bar">
            <div className="filter-search-box">
              <Search size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order #, Customer Name, or Email..."
              />
              {searchQuery && (
                <button className="icon-button" onClick={() => setSearchQuery('')}>
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="filter-selects-row">
              <label>
                Payment:
                <select value={filterPaymentStatus} onChange={(e) => setFilterPaymentStatus(e.target.value)}>
                  <option value="all">All Payment Statuses</option>
                  <option value="Awaiting Payment">Awaiting Payment</option>
                  <option value="Proof Submitted">Proof Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Confirmed">Confirmed (Paid)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>

              <label>
                Fulfilment:
                <select value={filterFulfilmentStatus} onChange={(e) => setFilterFulfilmentStatus(e.target.value)}>
                  <option value="all">All Fulfilment</option>
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Awaiting Book Release">Awaiting Release</option>
                  <option value="Ready for Delivery">Ready for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>

              <label>
                Method:
                <select value={filterPaymentMethod} onChange={(e) => setFilterPaymentMethod(e.target.value)}>
                  <option value="all">All Methods</option>
                  <option value="bank_transfer">Bank Wire</option>
                  <option value="mtn_momo">MTN MoMo</option>
                  <option value="vodafone_momo">Vodafone/Telecel</option>
                  <option value="btc">Bitcoin (BTC)</option>
                  <option value="usdt_trc20">USDT (TRC20)</option>
                  <option value="usdt_erc20">USDT (ERC20)</option>
                  <option value="usdt_bep20">USDT (BEP20)</option>
                </select>
              </label>
            </div>
          </div>

          {/* Orders Table */}
          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Edition & Qty</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Payment Status</th>
                  <th>Fulfilment</th>
                  <th>Order Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {presalesList.length ? (
                  presalesList.map((o) => (
                    <tr key={o.id || o.order_number}>
                      <td>
                        <strong className="table-order-num">{o.order_number}</strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                          <button
                            type="button"
                            className="table-mini-copy"
                            title="Copy Access Token link"
                            onClick={() => {
                              const url = `${window.location.origin}/order/${o.access_token}`
                              navigator.clipboard.writeText(url)
                              showToast('Order tracking link copied to clipboard!')
                            }}
                          >
                            <Copy size={11} /> Copy Link
                          </button>
                          {o.proofs && o.proofs.some((p: any) => p.receipt_url) && (
                            <button
                              type="button"
                              className="table-receipt-chip"
                              title="Inspect attached receipt screenshot"
                              onClick={() => {
                                const p = o.proofs.find((item: any) => item.receipt_url)
                                if (p) {
                                  setViewingReceiptModal({
                                    url: p.receipt_url,
                                    orderNumber: o.order_number,
                                    customerName: o.customer_name,
                                    referenceNumber: p.reference_number || p.transaction_hash,
                                    submittedAt: p.submitted_at,
                                  })
                                }
                              }}
                            >
                              <ImageIcon size={10} /> Inspect Receipt
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{o.customer_name}</strong>
                        <p className="table-sub">{o.customer_email}</p>
                        {o.country && <small className="table-country-tag">{o.country}</small>}
                      </td>
                      <td>
                        <span className="table-format-badge">
                          {o.book_format?.includes('printed') ? <Package size={12} /> : <BookOpen size={12} />}
                          {o.book_format?.replace(/_/g, ' ')}
                        </span>
                        <small className="table-qty-sub">Qty: {o.quantity || 1}</small>
                      </td>
                      <td>
                        <strong>${Number(o.total_amount).toFixed(2)}</strong>
                        {Number(o.shipping_fee) > 0 && (
                          <small className="table-sub" style={{ display: 'block' }}>
                            (+$ {Number(o.shipping_fee).toFixed(2)} ship)
                          </small>
                        )}
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>
                        <span className="payment-method-chip">
                          {o.payment_method?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${o.payment_status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {o.payment_status}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge status-fulfilment">
                          {o.fulfilment_status}
                        </span>
                      </td>
                      <td suppressHydrationWarning>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td>
                        <div className="table-action-btns">
                          <button
                            className="button button-light btn-sm"
                            onClick={() => setSelectedOrder(o)}
                          >
                            <Eye size={13} /> View
                          </button>
                          {o.payment_status !== 'Confirmed' && (
                            <button
                              className="button button-dark btn-sm"
                              onClick={() => setOrderToVerify(o)}
                            >
                              Verify
                            </button>
                          )}
                          <button
                            className="button button-light btn-sm"
                            onClick={() => {
                              setOrderForFulfilment(o)
                              setNewFulfilmentStatus(o.fulfilment_status || 'Confirmed')
                              setTrackingReference(o.tracking_reference || '')
                              setCourierName(o.courier_name || 'Standard Express')
                            }}
                          >
                            <Truck size={13} /> Fulfilment
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                      No presale orders matched your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= TAB: PAYMENT METHODS & PRICING CONFIGURATION ================= */}
      {activeTab === 'payment-settings' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Financial Setup</p>
              <h2>Payment Methods, Wallets & Presale Pricing</h2>
            </div>
            <button
              className="button button-dark"
              disabled={savingSettings}
              onClick={handleSavePaymentSettings}
            >
              {savingSettings ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : <>Save All Settings <ArrowRight size={16} /></>}
            </button>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="settings-grid-layout">
            {/* Presale Status & Release Date */}
            <div className="settings-card">
              <div className="settings-card-head">
                <Rocket size={18} />
                <h3>Presale Controls & Launch Date</h3>
              </div>
              <div className="form-row-2">
                <label className="checkbox-label admin-checkbox">
                  <input
                    type="checkbox"
                    checked={paymentSettings.presale_active}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, presale_active: e.target.checked })
                    }
                  />
                  <span><strong>Presale Active on Storefront</strong> (accepting pre-orders)</span>
                </label>
                <label className="checkbox-label admin-checkbox">
                  <input
                    type="checkbox"
                    checked={paymentSettings.early_delivery_enabled}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, early_delivery_enabled: e.target.checked })
                    }
                  />
                  <span><strong>Enable Early eBook Access</strong> (allow download before launch date)</span>
                </label>
              </div>
              <div className="form-row-3">
                <label>
                  Official Release / Delivery Date
                  <input
                    type="datetime-local"
                    value={
                      paymentSettings.expected_release_date
                        ? new Date(new Date(paymentSettings.expected_release_date).getTime() - new Date().getTimezoneOffset() * 60000)
                            .toISOString()
                            .slice(0, 16)
                        : '2026-11-06T09:00'
                    }
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        expected_release_date: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </label>
                <label>
                  Domestic Shipping Fee ($ USD)
                  <input
                    type="number"
                    step="0.01"
                    value={paymentSettings.shipping_fee_domestic}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        shipping_fee_domestic: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  International Shipping Fee ($ USD)
                  <input
                    type="number"
                    step="0.01"
                    value={paymentSettings.shipping_fee_international}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        shipping_fee_international: Number(e.target.value),
                      })
                    }
                  />
                </label>
              </div>
            </div>

            {/* Edition Pricing Setup */}
            <div className="settings-card">
              <div className="settings-card-head">
                <BookOpen size={18} />
                <h3>Book Formats & Pricing</h3>
              </div>
              <div className="formats-pricing-list">
                {paymentSettings.formats.map((fmt, idx) => (
                  <div key={fmt.format} className="format-pricing-row">
                    <div className="format-name-col">
                      <strong>{fmt.name}</strong>
                      <small>{fmt.is_physical ? 'Physical Print Copy' : 'Instant Digital eBook'}</small>
                    </div>
                    <div className="format-price-input-col">
                      <label>Price ($ USD):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={fmt.price}
                        onChange={(e) => {
                          const newFormats = [...paymentSettings.formats]
                          newFormats[idx].price = Number(e.target.value)
                          setPaymentSettings({ ...paymentSettings, formats: newFormats })
                        }}
                      />
                    </div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={fmt.available}
                        onChange={(e) => {
                          const newFormats = [...paymentSettings.formats]
                          newFormats[idx].available = e.target.checked
                          setPaymentSettings({ ...paymentSettings, formats: newFormats })
                        }}
                      />
                      <span>Available</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Transfer Settings */}
            <div className="settings-card">
              <div className="settings-card-head">
                <Banknote size={18} />
                <h3>Bank Wire / Transfer Details</h3>
              </div>
              <div className="form-row-2">
                <label>
                  Bank Name
                  <input
                    type="text"
                    value={paymentSettings.bank.bank_name}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        bank: { ...paymentSettings.bank, bank_name: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Account Name
                  <input
                    type="text"
                    value={paymentSettings.bank.account_name}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        bank: { ...paymentSettings.bank, account_name: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
              <div className="form-row-3">
                <label>
                  Account Number
                  <input
                    type="text"
                    value={paymentSettings.bank.account_number}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        bank: { ...paymentSettings.bank, account_number: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Routing / Sort Code
                  <input
                    type="text"
                    value={paymentSettings.bank.routing_or_sort_code || ''}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        bank: { ...paymentSettings.bank, routing_or_sort_code: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  SWIFT / BIC
                  <input
                    type="text"
                    value={paymentSettings.bank.swift_bic || ''}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        bank: { ...paymentSettings.bank, swift_bic: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
              <label>
                Bank Payment Instructions for Customers
                <textarea
                  rows={2}
                  value={paymentSettings.bank.instructions}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      bank: { ...paymentSettings.bank, instructions: e.target.value },
                    })
                  }
                />
              </label>
            </div>

            {/* Mobile Money Settings (MTN & Vodafone) */}
            <div className="settings-card">
              <div className="settings-card-head">
                <Smartphone size={18} />
                <h3>Mobile Money Channels (MTN & Telecel/Vodafone)</h3>
              </div>
              <div className="form-row-2">
                {/* MTN */}
                <div className="momo-sub-box">
                  <h4>MTN Mobile Money</h4>
                  <label>
                    Account Name
                    <input
                      type="text"
                      value={paymentSettings.mtn_momo.account_name}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          mtn_momo: { ...paymentSettings.mtn_momo, account_name: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    MoMo Number / Merchant ID
                    <input
                      type="text"
                      value={paymentSettings.mtn_momo.phone_or_merchant_id}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          mtn_momo: { ...paymentSettings.mtn_momo, phone_or_merchant_id: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>

                {/* Vodafone / Telecel */}
                <div className="momo-sub-box">
                  <h4>Telecel Cash / Vodafone Cash</h4>
                  <label>
                    Account Name
                    <input
                      type="text"
                      value={paymentSettings.vodafone_momo.account_name}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          vodafone_momo: { ...paymentSettings.vodafone_momo, account_name: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Till / Number
                    <input
                      type="text"
                      value={paymentSettings.vodafone_momo.phone_or_merchant_id}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          vodafone_momo: { ...paymentSettings.vodafone_momo, phone_or_merchant_id: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Cryptocurrency Wallets (BTC & USDT) */}
            <div className="settings-card">
              <div className="settings-card-head">
                <Bitcoin size={18} />
                <h3>Cryptocurrency Receiving Addresses</h3>
              </div>
              <label>
                Bitcoin (BTC) Receiving Wallet Address (Mainnet)
                <input
                  type="text"
                  value={paymentSettings.btc.wallet_address}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      btc: { ...paymentSettings.btc, wallet_address: e.target.value },
                    })
                  }
                />
              </label>

              <div className="form-row-3" style={{ marginTop: '12px' }}>
                <label>
                  Tether USDT Address (TRC20 - TRON)
                  <input
                    type="text"
                    value={paymentSettings.usdt.trc20_address}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        usdt: { ...paymentSettings.usdt, trc20_address: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Tether USDT Address (ERC20 - Ethereum)
                  <input
                    type="text"
                    value={paymentSettings.usdt.erc20_address}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        usdt: { ...paymentSettings.usdt, erc20_address: e.target.value },
                      })
                    }
                  />
                </label>
                <label>
                  Tether USDT Address (BEP20 - BSC)
                  <input
                    type="text"
                    value={paymentSettings.usdt.bep20_address}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        usdt: { ...paymentSettings.usdt, bep20_address: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
            </div>

            <div className="settings-actions-footer">
              <button
                type="submit"
                className="button button-dark btn-lg"
                disabled={savingSettings}
              >
                {savingSettings ? <><Loader2 className="animate-spin" size={16} /> Saving Changes...</> : <>Save All Payment & Pricing Settings <ArrowRight size={16} /></>}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= TAB: BOOK PREVIEW EDITOR ================= */}
      {activeTab === 'preview-editor' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Reader Engagement</p>
              <h2>Public Book Preview & Excerpt Editor</h2>
            </div>
            <div className="admin-header-actions">
              <button
                className="button button-light btn-sm"
                onClick={() => {
                  const newChapter: PreviewChapter = {
                    id: `ch_${Date.now()}`,
                    chapter_number: `Chapter 0${bookPreview.chapters.length + 1}`,
                    title: 'New Approved Excerpt',
                    subtitle: 'Subtitle for chapter',
                    read_time: '4 min read',
                    content: '### New Chapter Excerpt\n\nWrite your excerpt text here...',
                    key_takeaways: ['Discipline is capital.'],
                  }
                  setBookPreview({
                    ...bookPreview,
                    chapters: [...bookPreview.chapters, newChapter],
                  })
                  setEditingChapter(newChapter)
                }}
              >
                <Plus size={14} /> Add New Chapter
              </button>
              <button
                className="button button-dark btn-sm"
                disabled={savingPreview}
                onClick={handleSaveBookPreview}
              >
                {savingPreview ? <><Loader2 className="animate-spin" size={14} /> Saving...</> : <>Save Preview <ArrowRight size={14} /></>}
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveBookPreview} className="preview-editor-form">
            <div className="form-row-2">
              <label>
                Preview Book Title
                <input
                  type="text"
                  value={bookPreview.title}
                  onChange={(e) => setBookPreview({ ...bookPreview, title: e.target.value })}
                />
              </label>
              <label>
                Author Name
                <input
                  type="text"
                  value={bookPreview.author}
                  onChange={(e) => setBookPreview({ ...bookPreview, author: e.target.value })}
                />
              </label>
            </div>

            <label className="checkbox-label admin-checkbox" style={{ margin: '14px 0 20px' }}>
              <input
                type="checkbox"
                checked={bookPreview.is_published}
                onChange={(e) => setBookPreview({ ...bookPreview, is_published: e.target.checked })}
              />
              <span><strong>Publish Preview on Website</strong> (accessible to public readers without payment)</span>
            </label>

            {/* Chapters List */}
            <div className="chapters-editor-list">
              <h3>Preview Excerpt Sections ({bookPreview.chapters.length})</h3>
              {bookPreview.chapters.map((ch, idx) => (
                <div key={ch.id || idx} className="chapter-editor-card">
                  <div className="chapter-editor-top">
                    <div>
                      <span className="chapter-badge">{ch.chapter_number}</span>
                      <h4>{ch.title}</h4>
                      <small>{ch.read_time} · {ch.subtitle}</small>
                    </div>
                    <div className="table-action-btns">
                      <button
                        type="button"
                        className="button button-light btn-sm"
                        onClick={() => setEditingChapter(ch)}
                      >
                        Edit Content
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        title="Delete section"
                        onClick={() => {
                          const updated = bookPreview.chapters.filter((_, i) => i !== idx)
                          setBookPreview({ ...bookPreview, chapters: updated })
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="settings-actions-footer">
              <button
                type="submit"
                className="button button-dark btn-lg"
                disabled={savingPreview}
              >
                {savingPreview ? <><Loader2 className="animate-spin" size={16} /> Saving Changes...</> : <>Save All Preview Content <ArrowRight size={16} /></>}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= TAB: AUDIT LOGS ================= */}
      {activeTab === 'audit-logs' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Security & Compliance</p>
              <h2>Administrator Audit Trail</h2>
            </div>
            <button
              className="button button-light btn-sm"
              onClick={() => exportCsv(auditLogs, `audit-logs-${Date.now()}.csv`)}
            >
              <Download size={14} /> Export Logs
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin Identity</th>
                  <th>Action</th>
                  <th>Entity Target</th>
                  <th>Details & Reference</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length ? (
                  auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                      <td><strong>{log.admin_email}</strong></td>
                      <td>
                        <span className={`status-badge ${log.action.includes('verify') ? 'status-confirmed' : log.action.includes('reject') ? 'status-rejected' : 'status-fulfilment'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td><code>{log.entity_id || log.entity_type}</code></td>
                      <td>
                        <small style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>
                          {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                        </small>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                      No audit events recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= TAB: LAUNCHES ================= */}
      {activeTab === 'launches' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Launch Management</p>
              <h2>Book Launches</h2>
            </div>
            <div className="admin-header-actions">
              <button
                className="button button-light btn-sm"
                onClick={() => openBroadcastHub('announcement')}
              >
                <Mail size={14} /> Broadcast Launch
              </button>
              <button className="button button-dark btn-sm" onClick={() => setShowNewLaunchModal(true)}>
                <Plus size={15} /> Create Dynamic Launch
              </button>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title & Author</th>
                  <th>Launch Date</th>
                  <th>Status</th>
                  <th>Waitlist</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {launchesList.map((launch) => (
                  <tr key={launch.id}>
                    <td>
                      <img src={launch.cover_image || '/practical-trading-psychology.png'} alt="Cover" className="table-book-thumb" />
                    </td>
                    <td>
                      <strong>{launch.title}</strong>
                      <p className="table-sub">By {launch.author || AUTHOR_NAME}</p>
                    </td>
                    <td suppressHydrationWarning>{new Date(launch.launch_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      {launch.is_active ? (
                        <span className="badge-sent">Live Storefront Active</span>
                      ) : (
                        <span className="table-sub">Inactive</span>
                      )}
                    </td>
                    <td>
                      <strong>{launch.registrations_count || 0} readers</strong>
                    </td>
                    <td>
                      <div className="table-action-btns">
                        <button
                          className="button button-light btn-sm"
                          onClick={() => {
                            setEditLaunchId(launch.id)
                            setEditLaunchTitle(launch.title)
                            setEditLaunchTagline(launch.tagline || '')
                            setEditLaunchDesc(launch.description || launch.intro || '')
                            setEditLaunchThemes(Array.isArray(launch.themes) ? launch.themes.join(', ') : '')
                            setEditLaunchCover(launch.cover_image)
                            setEditLaunchDate(new Date(launch.launch_date).toISOString().slice(0, 16))
                            setEditLaunchActive(launch.is_active)
                            setShowEditLaunchModal(true)
                          }}
                        >
                          <Settings2 size={13} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= TAB: BOOKS ================= */}
      {activeTab === 'books' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Storefront Collection</p>
              <h2>Manage Books</h2>
            </div>
            <button className="button button-dark" onClick={() => setShowAddBookModal(true)}>
              <Plus size={16} /> Add new book
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title & Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {booksList.length ? (
                  booksList.map((book) => (
                    <tr key={book.id}>
                      <td><img src={book.image} alt={book.title} className="table-book-thumb" /></td>
                      <td>
                        <strong>{book.title}</strong>
                        <p className="table-sub">By {book.author || AUTHOR_NAME}</p>
                      </td>
                      <td>{book.category}</td>
                      <td><strong>{book.price}</strong></td>
                      <td>
                        <div className="table-action-btns">
                          <button
                            className="button button-light btn-sm"
                            onClick={() => setBookToDelete({ id: book.id, title: book.title })}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                      No additional catalog books created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= TAB: MESSAGES ================= */}
      {activeTab === 'messages' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Reader Inquiries</p>
              <h2>Contact Messages</h2>
            </div>
            <button className="button button-light btn-sm" onClick={() => exportCsv(messagesList, 'messages.csv')}>
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Message Content</th>
                  <th>Received Date</th>
                </tr>
              </thead>
              <tbody>
                {messagesList.length ? (
                  messagesList.map((msg) => (
                    <tr key={msg.id}>
                      <td><strong>{msg.name}</strong></td>
                      <td><a href={`mailto:${msg.email}`} className="table-link">{msg.email}</a></td>
                      <td><p className="message-bubble">{msg.message}</p></td>
                      <td suppressHydrationWarning>{new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                      No reader messages received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= TAB: SUBSCRIBERS ================= */}
      {activeTab === 'subscribers' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Newsletter Audience</p>
              <h2>Reading List Subscribers</h2>
            </div>
            <button className="button button-light btn-sm" onClick={() => exportCsv(subscribersList, 'subscribers.csv')}>
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subscriber Email</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribersList.length ? (
                  subscribersList.map((sub, idx) => (
                    <tr key={sub.id || idx}>
                      <td>#{sub.id || idx + 1}</td>
                      <td><strong>{sub.email}</strong></td>
                      <td suppressHydrationWarning>{new Date(sub.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                      No newsletter subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= MODAL: ORDER DETAILS INSPECTOR ================= */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedOrder(null)
        }}>
          <div className="admin-modal-card wide-modal">
            <div className="admin-modal-header">
              <div>
                <span className="presale-header-badge">ORDER INSPECTOR</span>
                <h3>Order #{selectedOrder.order_number}</h3>
              </div>
              <button className="icon-button" onClick={() => setSelectedOrder(null)}><X /></button>
            </div>

            <div className="order-inspector-body">
              <div className="inspector-grid">
                {/* Column 1: Customer Details */}
                <div className="inspector-col">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer_phone || 'N/A'}</p>
                  <p><strong>Country:</strong> {selectedOrder.country || 'N/A'}</p>
                  {selectedOrder.shipping_address && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>Shipping Address:</strong>
                      <p className="table-sub">
                        {selectedOrder.shipping_address.street}, {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.country}
                      </p>
                    </div>
                  )}
                </div>

                {/* Column 2: Order & Pricing */}
                <div className="inspector-col">
                  <h4>Order Summary</h4>
                  <p><strong>Book:</strong> {selectedOrder.book_title}</p>
                  <p><strong>Edition Format:</strong> {selectedOrder.book_format?.replace(/_/g, ' ')}</p>
                  <p><strong>Quantity:</strong> {selectedOrder.quantity || 1}</p>
                  <p><strong>Unit Price:</strong> ${Number(selectedOrder.unit_price).toFixed(2)}</p>
                  <p><strong>Shipping Fee:</strong> ${Number(selectedOrder.shipping_fee || 0).toFixed(2)}</p>
                  <p><strong>Total Amount:</strong> <span style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>${Number(selectedOrder.total_amount).toFixed(2)} USD</span></p>
                  <p><strong>Payment Method:</strong> {selectedOrder.payment_method?.replace(/_/g, ' ')}</p>
                </div>

                {/* Column 3: Status & Tracking */}
                <div className="inspector-col">
                  <h4>Statuses & Actions</h4>
                  <p><strong>Payment Status:</strong> <span className={`status-badge status-${selectedOrder.payment_status.toLowerCase().replace(/\s+/g, '-')}`}>{selectedOrder.payment_status}</span></p>
                  <p><strong>Fulfilment:</strong> <span className="status-badge status-fulfilment">{selectedOrder.fulfilment_status}</span></p>
                  {selectedOrder.rejection_reason && (
                    <p style={{ color: '#dc2626', fontSize: '13px' }}><strong>Rejection Reason:</strong> {selectedOrder.rejection_reason}</p>
                  )}
                  {selectedOrder.tracking_reference && (
                    <p><strong>Tracking Ref:</strong> <code>{selectedOrder.tracking_reference}</code> ({selectedOrder.courier_name})</p>
                  )}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedOrder.payment_status !== 'Confirmed' && (
                      <button className="button button-dark btn-sm" onClick={() => setOrderToVerify(selectedOrder)}>
                        Verify Payment
                      </button>
                    )}
                    <button className="button button-light btn-sm" onClick={() => setOrderToReject(selectedOrder)}>
                      Reject with Reason
                    </button>
                  </div>
                </div>
              </div>

              {/* Submitted Payment Proofs Attached */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0 }}>Submitted Payment Evidence ({selectedOrder.proofs?.length || 0})</h4>
                  {selectedOrder.proofs?.some((p: any) => p.receipt_url) && (
                    <span className="badge-sent" style={{ fontSize: '11px' }}>
                      <CheckCircle2 size={12} /> Receipt Screenshot Attached
                    </span>
                  )}
                </div>
                {selectedOrder.proofs && selectedOrder.proofs.length > 0 ? (
                  <div className="proof-history-list">
                    {selectedOrder.proofs.map((p: any, idx: number) => {
                      const isPdf = p.receipt_url?.toLowerCase().endsWith('.pdf') || p.receipt_url?.includes('.pdf')
                      return (
                        <div key={p.id || idx} className="proof-history-item">
                          <div className="proof-item-top">
                            <span className={`status-badge status-${p.status?.toLowerCase().replace(/\s+/g, '-')}`}>{p.status}</span>
                            <small>{new Date(p.submitted_at).toLocaleString()}</small>
                          </div>
                          <div className="proof-details-grid">
                            <div className="proof-meta-details">
                              {p.reference_number && <p><strong>Reference Number:</strong> <code>{p.reference_number}</code></p>}
                              {p.transaction_hash && <p><strong>Tx Hash:</strong> <code>{p.transaction_hash}</code></p>}
                              {p.sender_name_or_phone && <p><strong>Sender Name/Phone:</strong> {p.sender_name_or_phone}</p>}
                              {p.notes && <p><strong>Notes:</strong> {p.notes}</p>}
                            </div>

                            {p.receipt_url && (
                              <div className="receipt-inspect-card">
                                {isPdf ? (
                                  <div className="receipt-pdf-box">
                                    <FileText size={32} className="pdf-icon" />
                                    <div className="pdf-info">
                                      <strong>Payment Document (PDF)</strong>
                                      <small>Uploaded proof for verification</small>
                                    </div>
                                    <div className="receipt-actions-row">
                                      <button
                                        type="button"
                                        className="button button-dark btn-sm"
                                        onClick={() => setViewingReceiptModal({
                                          url: p.receipt_url,
                                          orderNumber: selectedOrder.order_number,
                                          customerName: selectedOrder.customer_name,
                                          referenceNumber: p.reference_number || p.transaction_hash,
                                          submittedAt: p.submitted_at,
                                        })}
                                      >
                                        <Maximize2 size={13} /> View PDF
                                      </button>
                                      <a href={p.receipt_url} target="_blank" rel="noreferrer" className="button button-light btn-sm">
                                        <ExternalLink size={13} /> Open Tab
                                      </a>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="receipt-image-card">
                                    <div
                                      className="receipt-thumb-container"
                                      onClick={() => setViewingReceiptModal({
                                        url: p.receipt_url,
                                        orderNumber: selectedOrder.order_number,
                                        customerName: selectedOrder.customer_name,
                                        referenceNumber: p.reference_number || p.transaction_hash,
                                        submittedAt: p.submitted_at,
                                      })}
                                      title="Click to zoom receipt screenshot"
                                    >
                                      <img src={p.receipt_url} alt="Payment Receipt Screenshot" className="receipt-thumb-image" />
                                      <div className="receipt-zoom-badge">
                                        <ZoomIn size={13} /> Enlarge
                                      </div>
                                    </div>
                                    <div className="receipt-card-actions">
                                      <button
                                        type="button"
                                        className="button button-dark btn-sm"
                                        onClick={() => setViewingReceiptModal({
                                          url: p.receipt_url,
                                          orderNumber: selectedOrder.order_number,
                                          customerName: selectedOrder.customer_name,
                                          referenceNumber: p.reference_number || p.transaction_hash,
                                          submittedAt: p.submitted_at,
                                        })}
                                      >
                                        <Maximize2 size={13} /> Fullscreen
                                      </button>
                                      <a
                                        href={p.receipt_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="button button-light btn-sm"
                                        title="Open full resolution in new tab"
                                      >
                                        <ExternalLink size={13} /> Tab
                                      </a>
                                      <a
                                        href={p.receipt_url}
                                        download={`receipt-${selectedOrder.order_number}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="button button-light btn-sm"
                                        title="Download original receipt file"
                                      >
                                        <Download size={13} />
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="admin-empty-sub">No receipt or blockchain hash submitted for this order yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: VERIFY PAYMENT CONFIRMATION ================= */}
      {orderToVerify && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !verifyingPayment) setOrderToVerify(null)
        }}>
          <div className="admin-modal-card" style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <div>
                <span className="presale-header-badge">FINANCE AUDIT</span>
                <h3>Confirm Payment Verification</h3>
              </div>
              <button className="icon-button" onClick={() => setOrderToVerify(null)} disabled={verifyingPayment}><X /></button>
            </div>
            <div className="admin-modal-form">
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--muted)' }}>
                Are you sure you want to approve and confirm payment for Order <strong>#{orderToVerify.order_number}</strong>?
              </p>
              <div style={{ background: 'var(--paper)', padding: '14px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                <p style={{ margin: '0 0 4px' }}>Customer: <strong>{orderToVerify.customer_name}</strong> ({orderToVerify.customer_email})</p>
                <p style={{ margin: '0 0 4px' }}>Amount: <strong>${Number(orderToVerify.total_amount).toFixed(2)} USD</strong></p>
                <p style={{ margin: 0 }}>Method: <strong>{orderToVerify.payment_method?.replace(/_/g, ' ')}</strong></p>
              </div>

              {/* Receipt Preview in Verification dialog */}
              {orderToVerify.proofs && orderToVerify.proofs.some((p: any) => p.receipt_url) && (
                <div className="verify-proof-preview-box">
                  <div className="verify-proof-head">
                    <ImageIcon size={14} />
                    <span>Attached Payment Receipt / Proof:</span>
                  </div>
                  {orderToVerify.proofs.filter((p: any) => p.receipt_url).map((p: any, idx: number) => (
                    <div key={p.id || idx} className="verify-proof-item">
                      <div
                        className="verify-thumb-wrap"
                        onClick={() => setViewingReceiptModal({
                          url: p.receipt_url,
                          orderNumber: orderToVerify.order_number,
                          customerName: orderToVerify.customer_name,
                          referenceNumber: p.reference_number || p.transaction_hash,
                          submittedAt: p.submitted_at,
                        })}
                        title="Click to zoom receipt"
                      >
                        <img src={p.receipt_url} alt="Receipt thumbnail" className="verify-thumb-img" />
                        <div className="verify-zoom-hover"><ZoomIn size={14} /></div>
                      </div>
                      <div className="verify-thumb-meta">
                        {p.reference_number && <p style={{ margin: 0 }}><strong>Ref:</strong> <code>{p.reference_number}</code></p>}
                        {p.transaction_hash && <p style={{ margin: 0 }}><strong>Tx:</strong> <code>{p.transaction_hash.slice(0, 18)}...</code></p>}
                        {p.sender_name_or_phone && <p style={{ margin: 0 }}><strong>Sender:</strong> {p.sender_name_or_phone}</p>}
                        <button
                          type="button"
                          className="table-mini-copy"
                          style={{ marginTop: '4px', cursor: 'pointer' }}
                          onClick={() => setViewingReceiptModal({
                            url: p.receipt_url,
                            orderNumber: orderToVerify.order_number,
                            customerName: orderToVerify.customer_name,
                            referenceNumber: p.reference_number || p.transaction_hash,
                            submittedAt: p.submitted_at,
                          })}
                        >
                          <Maximize2 size={11} /> Inspect Fullscreen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <label style={{ marginTop: '14px' }}>
                Bank Audit Reference / Internal Note (optional):
                <input
                  type="text"
                  value={verifyNote}
                  onChange={(e) => setVerifyNote(e.target.value)}
                  placeholder="e.g. Verified in Standard Chartered deposit batch #4920"
                />
              </label>

              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setOrderToVerify(null)} disabled={verifyingPayment}>Cancel</button>
                <button
                  type="button"
                  className="button button-dark"
                  disabled={verifyingPayment}
                  onClick={handleConfirmPayment}
                >
                  {verifyingPayment ? <><Loader2 className="animate-spin" size={16} /> Verifying...</> : <>Confirm Payment & Notify Customer <ArrowRight size={16} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REJECT PAYMENT ================= */}
      {orderToReject && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !rejectingPayment) setOrderToReject(null)
        }}>
          <div className="admin-modal-card" style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <div>
                <span className="presale-header-badge" style={{ color: '#dc2626' }}>REJECTION WORKFLOW</span>
                <h3>Reject Payment Submission</h3>
              </div>
              <button className="icon-button" onClick={() => setOrderToReject(null)} disabled={rejectingPayment}><X /></button>
            </div>
            <div className="admin-modal-form">
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--muted)' }}>
                Specify the exact issue encountered for Order <strong>#{orderToReject.order_number}</strong>. The customer will receive this feedback with a link to re-submit proof.
              </p>

              <label>
                Rejection Reason (required):
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Deposit could not be matched with incoming wire, or transaction hash is invalid on Tronscan."
                />
              </label>

              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setOrderToReject(null)} disabled={rejectingPayment}>Cancel</button>
                <button
                  type="button"
                  className="button button-dark"
                  style={{ background: '#dc2626', borderColor: '#dc2626' }}
                  disabled={rejectingPayment}
                  onClick={handleRejectPayment}
                >
                  {rejectingPayment ? <><Loader2 className="animate-spin" size={16} /> Rejecting...</> : <>Reject Payment & Send Email <ArrowRight size={16} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: FULFILMENT STATUS UPDATE ================= */}
      {orderForFulfilment && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !updatingFulfilment) setOrderForFulfilment(null)
        }}>
          <div className="admin-modal-card" style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <div>
                <span className="presale-header-badge">DISPATCH & FULFILMENT</span>
                <h3>Update Order #{orderForFulfilment.order_number}</h3>
              </div>
              <button className="icon-button" onClick={() => setOrderForFulfilment(null)} disabled={updatingFulfilment}><X /></button>
            </div>
            <div className="admin-modal-form">
              <label>
                Fulfilment Status
                <select
                  value={newFulfilmentStatus}
                  onChange={(e) => setNewFulfilmentStatus(e.target.value as FulfilmentStatus)}
                >
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Awaiting Book Release">Awaiting Book Release</option>
                  <option value="Ready for Delivery">Ready for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>

              <label>
                Courier Name
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. DHL Express / Ghana Post Speedpost"
                />
              </label>

              <label>
                Tracking Reference Number (for physical copy)
                <input
                  type="text"
                  value={trackingReference}
                  onChange={(e) => setTrackingReference(e.target.value)}
                  placeholder="e.g. GH-POST-98234190"
                />
              </label>

              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setOrderForFulfilment(null)} disabled={updatingFulfilment}>Cancel</button>
                <button
                  type="button"
                  className="button button-dark"
                  disabled={updatingFulfilment}
                  onClick={handleUpdateFulfilment}
                >
                  {updatingFulfilment ? <><Loader2 className="animate-spin" size={16} /> Updating...</> : <>Save Fulfilment Status <ArrowRight size={16} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHAPTER CONTENT EDITOR ================= */}
      {editingChapter && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setEditingChapter(null)
        }}>
          <div className="admin-modal-card wide-modal">
            <div className="admin-modal-header">
              <div>
                <span className="presale-header-badge">CHAPTER EDITOR</span>
                <h3>{editingChapter.chapter_number}: {editingChapter.title}</h3>
              </div>
              <button className="icon-button" onClick={() => setEditingChapter(null)}><X /></button>
            </div>
            <div className="admin-modal-form">
              <div className="form-row-2">
                <label>
                  Chapter Number / Badge (e.g. Author&apos;s Preface or Chapter 01)
                  <input
                    type="text"
                    value={editingChapter.chapter_number}
                    onChange={(e) => setEditingChapter({ ...editingChapter, chapter_number: e.target.value })}
                  />
                </label>
                <label>
                  Reading Time (e.g. 5 min read)
                  <input
                    type="text"
                    value={editingChapter.read_time}
                    onChange={(e) => setEditingChapter({ ...editingChapter, read_time: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Chapter Title
                <input
                  type="text"
                  value={editingChapter.title}
                  onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                />
              </label>

              <label>
                Subtitle / Core Premise
                <input
                  type="text"
                  value={editingChapter.subtitle || ''}
                  onChange={(e) => setEditingChapter({ ...editingChapter, subtitle: e.target.value })}
                />
              </label>

              <label>
                Formatted Content (Supports ### Headings, blockquotes, bullet points):
                <textarea
                  rows={12}
                  value={editingChapter.content}
                  onChange={(e) => setEditingChapter({ ...editingChapter, content: e.target.value })}
                  style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
                />
              </label>

              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setEditingChapter(null)}>Close</button>
                <button
                  type="button"
                  className="button button-dark"
                  onClick={() => {
                    const idx = bookPreview.chapters.findIndex((c) => c.id === editingChapter.id)
                    const updated = [...bookPreview.chapters]
                    if (idx >= 0) updated[idx] = editingChapter
                    else updated.push(editingChapter)
                    setBookPreview({ ...bookPreview, chapters: updated })
                    setEditingChapter(null)
                    showToast('Chapter updated in local draft. Remember to click Save Preview!')
                  }}
                >
                  Apply Chapter Changes <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW BOOK ================= */}
      {showAddBookModal && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowAddBookModal(false)
        }}>
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Add New Book to Collection</h3>
              <button className="icon-button" onClick={() => setShowAddBookModal(false)}><X /></button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!newBookTitle || !newBookPrice) return
                setSavingBook(true)
                try {
                  const res = await fetch('/api/books', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: newBookTitle,
                      category: newBookCategory,
                      price: newBookPrice.startsWith('$') ? newBookPrice : `$${newBookPrice}`,
                      description: newBookDesc,
                      image: newBookCover || '/practical-trading-psychology.png',
                      pdf_url: newBookPdf,
                    }),
                  })
                  const data = await res.json()
                  if (res.ok && data.success) {
                    showToast(`Book "${newBookTitle}" added!`)
                    setShowAddBookModal(false)
                    refreshBooks()
                    loadAdminData()
                  } else {
                    alert(data.error || 'Failed to add book')
                  }
                } catch (err: any) {
                  alert(err.message)
                } finally {
                  setSavingBook(false)
                }
              }}
              className="admin-modal-form"
            >
              <label>
                Book Title
                <input required value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} />
              </label>
              <div className="form-row-2">
                <label>
                  Category
                  <input required value={newBookCategory} onChange={(e) => setNewBookCategory(e.target.value)} />
                </label>
                <label>
                  Price
                  <input required value={newBookPrice} onChange={(e) => setNewBookPrice(e.target.value)} />
                </label>
              </div>
              <label>
                Description
                <textarea rows={3} value={newBookDesc} onChange={(e) => setNewBookDesc(e.target.value)} />
              </label>
              <div className="cloudinary-upload-box">
                <label className="cloudinary-label">
                  <UploadCloud size={20} /> Upload Cover
                  <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, setNewBookCover)} />
                </label>
                {newBookCover && <p style={{ fontSize: '12px' }}>Attached: {newBookCover.slice(0, 40)}...</p>}
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowAddBookModal(false)}>Cancel</button>
                <button type="submit" className="button button-dark" disabled={savingBook}>
                  {savingBook ? <Loader2 className="animate-spin" size={16} /> : <>Save Book <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT LAUNCH ================= */}
      {showEditLaunchModal && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !savingLaunch) setShowEditLaunchModal(false)
        }}>
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Edit Book Launch</h3>
              <button className="icon-button" onClick={() => setShowEditLaunchModal(false)}><X /></button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setSavingLaunch(true)
                try {
                  const res = await fetch(`/api/admin/launches/${editLaunchId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: editLaunchTitle,
                      tagline: editLaunchTagline,
                      intro: editLaunchDesc,
                      description: editLaunchDesc,
                      themes: editLaunchThemes.split(',').map((t) => t.trim()).filter(Boolean),
                      cover_image: editLaunchCover,
                      launch_date: new Date(editLaunchDate).toISOString(),
                      is_active: editLaunchActive,
                    }),
                  })
                  const data = await res.json().catch(() => ({}))
                  if (res.ok && data.success) {
                    showToast('Launch updated!')
                    setShowEditLaunchModal(false)
                    refreshLaunch()
                    loadAdminData()
                  } else {
                    alert(data.error || 'Failed to update launch')
                  }
                } catch (err: any) {
                  alert(err.message || 'Error updating launch')
                } finally {
                  setSavingLaunch(false)
                }
              }}
              className="admin-modal-form"
            >
              <label>
                Launch Title
                <input required value={editLaunchTitle} onChange={(e) => setEditLaunchTitle(e.target.value)} />
              </label>
              <label>
                Launch Date & Time
                <input required type="datetime-local" value={editLaunchDate} onChange={(e) => setEditLaunchDate(e.target.value)} />
              </label>
              <label>
                Tagline
                <textarea rows={2} value={editLaunchTagline} onChange={(e) => setEditLaunchTagline(e.target.value)} />
              </label>
              <label>
                Themes (comma-separated)
                <input value={editLaunchThemes} onChange={(e) => setEditLaunchThemes(e.target.value)} />
              </label>
              <label>
                Description
                <textarea rows={3} value={editLaunchDesc} onChange={(e) => setEditLaunchDesc(e.target.value)} />
              </label>
              <label className="checkbox-label admin-checkbox">
                <input type="checkbox" checked={editLaunchActive} onChange={(e) => setEditLaunchActive(e.target.checked)} />
                <span>Set as Active Launch on Storefront</span>
              </label>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowEditLaunchModal(false)}>Cancel</button>
                <button type="submit" className="button button-dark" disabled={savingLaunch}>
                  {savingLaunch ? <Loader2 className="animate-spin" size={16} /> : <>Save Changes <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE LAUNCH ================= */}
      {showNewLaunchModal && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !savingNewLaunch) setShowNewLaunchModal(false)
        }}>
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Create Dynamic Book Launch</h3>
              <button className="icon-button" onClick={() => setShowNewLaunchModal(false)}><X /></button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setSavingNewLaunch(true)
                try {
                  const res = await fetch('/api/admin/launches', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: newLaunchTitle,
                      author: AUTHOR_NAME,
                      author_bio: AUTHOR_BIO,
                      author_image: AUTHOR_IMAGE,
                      tagline: newLaunchTagline,
                      intro: newLaunchDesc,
                      description: newLaunchDesc,
                      themes: newLaunchThemes.split(',').map((t) => t.trim()).filter(Boolean),
                      cover_image: newLaunchCover || '/practical-trading-psychology.png',
                      launch_date: new Date(newLaunchDate).toISOString(),
                      is_active: newLaunchActive,
                    }),
                  })
                  const data = await res.json()
                  if (res.ok && data.success) {
                    showToast('New Book Launch created!')
                    setShowNewLaunchModal(false)
                    refreshLaunch()
                    loadAdminData()
                  }
                } catch (err: any) {
                  alert(err.message)
                } finally {
                  setSavingNewLaunch(false)
                }
              }}
              className="admin-modal-form"
            >
              <label>
                Launch Title
                <input required value={newLaunchTitle} onChange={(e) => setNewLaunchTitle(e.target.value)} />
              </label>
              <label>
                Launch Date
                <input required type="datetime-local" value={newLaunchDate} onChange={(e) => setNewLaunchDate(e.target.value)} />
              </label>
              <label>
                Tagline
                <textarea rows={2} value={newLaunchTagline} onChange={(e) => setNewLaunchTagline(e.target.value)} />
              </label>
              <label>
                Description
                <textarea rows={3} value={newLaunchDesc} onChange={(e) => setNewLaunchDesc(e.target.value)} />
              </label>
              <label className="checkbox-label admin-checkbox">
                <input type="checkbox" checked={newLaunchActive} onChange={(e) => setNewLaunchActive(e.target.checked)} />
                <span>Immediately set as active storefront launch</span>
              </label>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowNewLaunchModal(false)}>Cancel</button>
                <button type="submit" className="button button-dark" disabled={savingNewLaunch}>
                  {savingNewLaunch ? <Loader2 className="animate-spin" size={16} /> : <>Create Launch <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: LAUNCH DISTRIBUTION & SCHEDULED SENDING HUB ================= */}
      {showBroadcastModal && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !sendingBroadcast && !deliveringBooks) {
              setShowBroadcastModal(false)
            }
          }}
        >
          <div className="admin-modal-card wide-modal" style={{ maxWidth: '840px' }}>
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">SERENDIPITY / ELVIS · LAUNCH DAY BROADCAST & FULFILLMENT</p>
                <h3>Launch Distribution & Scheduled Sending Hub</h3>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowBroadcastModal(false)}
                disabled={sendingBroadcast || deliveringBooks}
              >
                <X />
              </button>
            </div>

            {/* Modal Internal Navigation Tabs */}
            <div className="broadcast-modal-tabs">
              <button
                type="button"
                className={`broadcast-tab-btn ${broadcastTab === 'announcement' ? 'is-active' : ''}`}
                onClick={() => setBroadcastTab('announcement')}
              >
                <Mail size={14} /> Broadcast Launch to Audience
              </button>
              <button
                type="button"
                className={`broadcast-tab-btn ${broadcastTab === 'presale_delivery' ? 'is-active' : ''}`}
                onClick={() => setBroadcastTab('presale_delivery')}
              >
                <Download size={14} /> Deliver Books to Paid Presales ({audienceSummary?.confirmed_presale_orders_count ?? presalesList.filter(o => o.payment_status === 'Confirmed').length})
              </button>
              <button
                type="button"
                className={`broadcast-tab-btn ${broadcastTab === 'history' ? 'is-active' : ''}`}
                onClick={() => setBroadcastTab('history')}
              >
                <Clock size={14} /> Campaign Logs ({broadcastCampaigns.length})
              </button>
            </div>

            {/* Audience Summary Metrics Bar */}
            <div className="broadcast-summary-grid">
              <div className="broadcast-stat-chip">
                <span>Waitlist Registrants</span>
                <strong>{audienceSummary?.waitlist_count ?? stats?.registrationsCount ?? 0}</strong>
              </div>
              <div className="broadcast-stat-chip">
                <span>Newsletter Readers</span>
                <strong>{audienceSummary?.newsletter_count ?? subscribersList.length}</strong>
              </div>
              <div className="broadcast-stat-chip stat-highlight">
                <span>Unique Reach (0 Duplicates)</span>
                <strong>{audienceSummary?.total_unique_recipients ?? ((audienceSummary?.waitlist_count || 0) + (audienceSummary?.newsletter_count || 0))}</strong>
              </div>
              <div className="broadcast-stat-chip">
                <span>Confirmed Presales</span>
                <strong>{audienceSummary?.confirmed_presale_orders_count ?? presalesList.filter(o => o.payment_status === 'Confirmed').length}</strong>
              </div>
            </div>

            {/* TAB 1: BROADCAST LAUNCH ANNOUNCEMENT */}
            {broadcastTab === 'announcement' && (
              <form onSubmit={handleSendLaunchBroadcast} className="admin-modal-form">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', background: 'var(--paper)', padding: '12px 16px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                  <label className="checkbox-label admin-checkbox" style={{ margin: 0, textTransform: 'none', color: 'var(--ink)' }}>
                    <input
                      type="checkbox"
                      checked={includeWaitlist}
                      onChange={(e) => setIncludeWaitlist(e.target.checked)}
                    />
                    <span>Include Priority Waitlist ({audienceSummary?.waitlist_count ?? 0})</span>
                  </label>
                  <label className="checkbox-label admin-checkbox" style={{ margin: 0, textTransform: 'none', color: 'var(--ink)' }}>
                    <input
                      type="checkbox"
                      checked={includeNewsletter}
                      onChange={(e) => setIncludeNewsletter(e.target.checked)}
                    />
                    <span>Include Newsletter Subscribers ({audienceSummary?.newsletter_count ?? 0})</span>
                  </label>
                </div>

                <div className="zero-duplicate-banner">
                  <CheckCircle2 size={15} />
                  <span>
                    <strong>Zero-Duplicate Engine Active:</strong> Subscribers present on both waitlist and newsletter are automatically merged. Each recipient receives exactly 1 email.
                  </span>
                </div>

                <label>
                  Announcement Subject Line
                  <input
                    type="text"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    placeholder={`Out Now: ${audienceSummary?.launch_title || activeLaunch.title} by Dr Elvis Justice Bedi`}
                  />
                </label>

                <label>
                  Custom Author Message or Launch Note (Optional)
                  <textarea
                    rows={3}
                    value={broadcastCustomMsg}
                    onChange={(e) => setBroadcastCustomMsg(e.target.value)}
                    placeholder="e.g. Thank you for your patience and enthusiasm. The book is officially available worldwide as of today..."
                  />
                </label>

                <div>
                  <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', margin: '0 0 6px' }}>
                    Delivery Dispatch Mode
                  </p>
                  <div className="schedule-mode-selector">
                    <div
                      className={`schedule-card-option ${broadcastScheduleMode === 'scheduled' ? 'is-selected' : ''}`}
                      onClick={() => setBroadcastScheduleMode('scheduled')}
                    >
                      <div className="schedule-card-top">
                        <Clock size={15} color={broadcastScheduleMode === 'scheduled' ? 'var(--accent)' : 'var(--muted)'} />
                        <span>Schedule for Launch Date</span>
                      </div>
                      <p className="schedule-card-desc">
                        Queues with Resend bulk delivery engine to send at the exact launch time.
                      </p>
                    </div>

                    <div
                      className={`schedule-card-option ${broadcastScheduleMode === 'immediate' ? 'is-selected' : ''}`}
                      onClick={() => setBroadcastScheduleMode('immediate')}
                    >
                      <div className="schedule-card-top">
                        <Sparkles size={15} color={broadcastScheduleMode === 'immediate' ? 'var(--accent)' : 'var(--muted)'} />
                        <span>Send Immediately (Bulk Dispatch)</span>
                      </div>
                      <p className="schedule-card-desc">
                        Dispatches immediately to all unique audience members in batched API calls.
                      </p>
                    </div>
                  </div>
                </div>

                {broadcastScheduleMode === 'scheduled' && (
                  <label>
                    Scheduled Release Date & Time (Local / UTC)
                    <input
                      type="datetime-local"
                      required
                      value={broadcastScheduledDate}
                      onChange={(e) => setBroadcastScheduledDate(e.target.value)}
                    />
                  </label>
                )}

                <div className="admin-modal-actions" style={{ marginTop: '12px' }}>
                  <button type="button" className="text-button" onClick={() => setShowBroadcastModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="button button-dark" disabled={sendingBroadcast || (!includeWaitlist && !includeNewsletter)}>
                    {sendingBroadcast ? (
                      <><Loader2 className="animate-spin" size={15} /> Processing Bulk Broadcast...</>
                    ) : broadcastScheduleMode === 'scheduled' ? (
                      <><Clock size={15} /> Schedule Launch Broadcast</>
                    ) : (
                      <><Mail size={15} /> Send Broadcast Now ({audienceSummary?.total_unique_recipients ?? 'Audience'})</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: DELIVER BOOKS TO PAID PRESALES */}
            {broadcastTab === 'presale_delivery' && (
              <form onSubmit={handleDeliverPresaleBooks} className="admin-modal-form">
                <div style={{ background: '#f4fbf7', border: '1px solid #c3e6cb', padding: '16px 20px', borderRadius: '4px', color: '#155724' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>Presale Digital Book Delivery</h4>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
                    This action delivers complete digital editions (PDF / eBook download links with personalized license entitlements) to all confirmed, paid presale customers. Physical hardcover orders will receive their dispatch preparation notification.
                  </p>
                </div>

                <div style={{ background: 'var(--paper)', padding: '12px 16px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                  <label className="checkbox-label admin-checkbox" style={{ margin: 0, textTransform: 'none', color: 'var(--ink)' }}>
                    <input
                      type="checkbox"
                      checked={onlyUndeliveredOrders}
                      onChange={(e) => setOnlyUndeliveredOrders(e.target.checked)}
                    />
                    <span>Only send to orders that haven&apos;t received books yet (skip already fulfilled)</span>
                  </label>
                </div>

                <div>
                  <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', margin: '0 0 6px' }}>
                    Delivery Dispatch Mode
                  </p>
                  <div className="schedule-mode-selector">
                    <div
                      className={`schedule-card-option ${deliveryScheduleMode === 'scheduled' ? 'is-selected' : ''}`}
                      onClick={() => setDeliveryScheduleMode('scheduled')}
                    >
                      <div className="schedule-card-top">
                        <Clock size={15} color={deliveryScheduleMode === 'scheduled' ? 'var(--accent)' : 'var(--muted)'} />
                        <span>Schedule Delivery on Launch Date</span>
                      </div>
                      <p className="schedule-card-desc">
                        Schedules book download link emails for the official launch release date.
                      </p>
                    </div>

                    <div
                      className={`schedule-card-option ${deliveryScheduleMode === 'immediate' ? 'is-selected' : ''}`}
                      onClick={() => setDeliveryScheduleMode('immediate')}
                    >
                      <div className="schedule-card-top">
                        <Download size={15} color={deliveryScheduleMode === 'immediate' ? 'var(--accent)' : 'var(--muted)'} />
                        <span>Deliver Immediately to Paid Orders</span>
                      </div>
                      <p className="schedule-card-desc">
                        Immediately provisions tokens and emails download links to confirmed buyers.
                      </p>
                    </div>
                  </div>
                </div>

                {deliveryScheduleMode === 'scheduled' && (
                  <label>
                    Scheduled Release Date & Time
                    <input
                      type="datetime-local"
                      required
                      value={deliveryScheduledDate}
                      onChange={(e) => setDeliveryScheduledDate(e.target.value)}
                    />
                  </label>
                )}

                <div className="admin-modal-actions" style={{ marginTop: '12px' }}>
                  <button type="button" className="text-button" onClick={() => setShowBroadcastModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="button button-dark"
                    disabled={deliveringBooks || (audienceSummary?.confirmed_presale_orders_count === 0 && presalesList.filter(o => o.payment_status === 'Confirmed').length === 0)}
                  >
                    {deliveringBooks ? (
                      <><Loader2 className="animate-spin" size={15} /> Delivering Digital Books...</>
                    ) : deliveryScheduleMode === 'scheduled' ? (
                      <><Clock size={15} /> Schedule Presale Fulfillment</>
                    ) : (
                      <><Download size={15} /> Deliver Books Now ({audienceSummary?.confirmed_presale_orders_count ?? presalesList.filter(o => o.payment_status === 'Confirmed').length} Orders)</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: CAMPAIGN LOGS */}
            {broadcastTab === 'history' && (
              <div>
                {broadcastCampaigns.length > 0 ? (
                  <div className="admin-table-wrap">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Campaign Type</th>
                          <th>Subject / Details</th>
                          <th>Recipients</th>
                          <th>Schedule / Status</th>
                          <th>Dispatched By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {broadcastCampaigns.map((camp) => (
                          <tr key={camp.id}>
                            <td>
                              <span className={camp.campaign_type === 'launch_announcement' ? 'badge-confirmed' : 'badge-sent'}>
                                {camp.campaign_type === 'launch_announcement' ? 'Launch Announcement' : 'Presale Delivery'}
                              </span>
                            </td>
                            <td>
                              <strong>{camp.subject}</strong>
                              {camp.details?.custom_message && (
                                <p className="table-sub">&ldquo;{camp.details.custom_message.slice(0, 50)}...&rdquo;</p>
                              )}
                            </td>
                            <td><strong>{camp.total_recipients}</strong></td>
                            <td>
                              {camp.scheduled_at ? (
                                <div>
                                  <span className="badge-pending" style={{ fontSize: '11px' }}>
                                    <Clock size={10} /> Scheduled
                                  </span>
                                  <p className="table-sub">{new Date(camp.scheduled_at).toLocaleString()}</p>
                                </div>
                              ) : (
                                <div>
                                  <span className="badge-confirmed" style={{ fontSize: '11px' }}>
                                    <Check size={10} /> Dispatched
                                  </span>
                                  <p className="table-sub">{new Date(camp.created_at).toLocaleString()}</p>
                                </div>
                              )}
                            </td>
                            <td><span className="table-sub">{camp.sent_by || 'Admin'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-empty-state-box">
                    <Clock size={28} color="var(--muted)" />
                    <p>No bulk broadcasts or delivery campaigns recorded yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: CHANGE PASSWORD ================= */}
      {showChangePasswordModal && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !passLoading) setShowChangePasswordModal(false)
        }}>
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Admin Security</p>
                <h3>Change Administrator Password</h3>
              </div>
              <button className="icon-button" onClick={() => setShowChangePasswordModal(false)}><X /></button>
            </div>
            {passError && <p className="admin-error-banner">{passError}</p>}
            <form onSubmit={handleChangePassword} className="admin-modal-form">
              <label>
                Current Password
                <input
                  type="password"
                  required
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </label>
              <label>
                New Password (minimum 6 characters)
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Enter new strong password"
                />
              </label>
              <label>
                Confirm New Password
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmAdminPassword}
                  onChange={(e) => setConfirmAdminPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </label>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowChangePasswordModal(false)}>Cancel</button>
                <button type="submit" className="button button-dark" disabled={passLoading}>
                  {passLoading ? <Loader2 className="animate-spin" size={16} /> : <>Update Password <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM DELETE BOOK ================= */}
      {bookToDelete && (
        <div className="admin-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !deletingBook) setBookToDelete(null)
        }}>
          <div className="admin-modal-card" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(180, 40, 40, 0.1)', color: '#b42828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={20} />
                </div>
                <h3>Delete Book</h3>
              </div>
              <button className="icon-button" onClick={() => setBookToDelete(null)} disabled={deletingBook}><X /></button>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: '14px 0 24px' }}>
              Are you sure you want to delete <strong>&quot;{bookToDelete.title}&quot;</strong> permanently?
            </p>
            <div className="admin-modal-actions">
              <button type="button" className="text-button" onClick={() => setBookToDelete(null)}>Cancel</button>
              <button
                type="button"
                className="button button-dark"
                style={{ background: '#b42828', borderColor: '#b42828' }}
                disabled={deletingBook}
                onClick={confirmDeleteBook}
              >
                {deletingBook ? <Loader2 className="animate-spin" size={16} /> : <>Yes, Delete Book</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RECEIPT LIGHTBOX INSPECTOR ================= */}
      {viewingReceiptModal && (
        <div
          className="admin-modal-overlay receipt-lightbox-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingReceiptModal(null)
          }}
        >
          <div className="receipt-lightbox-card">
            <div className="receipt-lightbox-header">
              <div className="receipt-header-meta">
                <span className="presale-header-badge">PAYMENT RECEIPT INSPECTION</span>
                <h3>Order #{viewingReceiptModal.orderNumber}</h3>
                <div className="receipt-sub-details">
                  {viewingReceiptModal.customerName && <span>Customer: <strong>{viewingReceiptModal.customerName}</strong></span>}
                  {viewingReceiptModal.referenceNumber && <span>Reference: <code>{viewingReceiptModal.referenceNumber}</code></span>}
                  {viewingReceiptModal.submittedAt && <span>Submitted: {new Date(viewingReceiptModal.submittedAt).toLocaleString()}</span>}
                </div>
              </div>
              <div className="receipt-lightbox-actions">
                <a
                  href={viewingReceiptModal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-light btn-sm"
                  title="Open full resolution in new window"
                >
                  <ExternalLink size={14} /> Open in New Tab
                </a>
                <a
                  href={viewingReceiptModal.url}
                  download={`receipt-${viewingReceiptModal.orderNumber || 'proof'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-light btn-sm"
                  title="Download receipt file"
                >
                  <Download size={14} /> Download
                </a>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setViewingReceiptModal(null)}
                  title="Close viewer (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="receipt-lightbox-body">
              {viewingReceiptModal.url.toLowerCase().endsWith('.pdf') || viewingReceiptModal.url.includes('.pdf') ? (
                <div className="pdf-embed-wrapper">
                  <iframe
                    src={viewingReceiptModal.url}
                    title="PDF Receipt Viewer"
                    className="pdf-iframe-view"
                  />
                </div>
              ) : (
                <div className="receipt-image-wrapper">
                  <img
                    src={viewingReceiptModal.url}
                    alt={`Receipt for order ${viewingReceiptModal.orderNumber}`}
                    className="receipt-full-image"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Link href="/" className="admin-storefront-link">
        <ArrowLeft size={14} /> Back to live storefront
      </Link>
    </main>
  )
}

export function AdminView() {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAdminAuthenticated(true)
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false))
  }, [])

  if (checkingAuth) {
    return (
      <main className="admin-auth-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: 'var(--accent)' }} />
      </main>
    )
  }

  if (!adminAuthenticated) {
    return <AdminLogin onLogin={() => setAdminAuthenticated(true)} />
  }

  return (
    <AdminDashboard
      onLogout={async () => {
        try {
          await fetch('/api/admin/auth', { method: 'DELETE' })
        } catch {}
        setAdminAuthenticated(false)
      }}
    />
  )
}
