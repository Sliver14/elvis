'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Download,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  Plus,
  Rocket,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UploadCloud,
  Users,
  X,
} from 'lucide-react'
import { Book, BookLaunch } from '@/lib/types'
import { useStore } from '@/components/store-provider'

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  )
}

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
            <h1>Welcome <em>back.</em></h1>
            <p className="admin-auth-copy">
              Sign in to manage your collection, dynamic launches, orders, and reader conversations.
            </p>
            {successMsg && <p className="admin-success-banner"><CheckCircle2 /> {successMsg}</p>}
            {error && <p className="admin-error-banner">{error}</p>}
            <form onSubmit={handleSignIn} className="admin-auth-form">
              <label>
                Email address
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elvisjusticebooks.com"
                />
              </label>
              <label>
                <div className="admin-auth-header-row">
                  <span>Password</span>
                  <button
                    type="button"
                    className="admin-forgot-btn"
                    onClick={() => {
                      setError('')
                      setSuccessMsg('')
                      setAuthMode('forgot')
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </label>
              <button className="button button-dark" type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <>Sign in <ArrowRight /></>}
              </button>
            </form>
            <Link href="/" className="text-button">
              <ArrowLeft /> Return to storefront
            </Link>
          </>
        )}

        {/* MODE 2: FORGOT PASSWORD */}
        {authMode === 'forgot' && (
          <>
            <h1>Reset <em>password.</em></h1>
            <p className="admin-auth-copy">
              Enter your admin email. A secure 6-digit verification code will be sent via Resend to authorize your password change.
            </p>
            {error && <p className="admin-error-banner">{error}</p>}
            <form onSubmit={handleRequestResetCode} className="admin-auth-form">
              <label>
                Admin email address
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elvisjusticebooks.com"
                />
              </label>
              <p className="admin-info-note">
                <ShieldCheck style={{ width: 14, height: 14, verticalAlign: 'middle', marginRight: 4 }} />
                Code will be delivered to <strong>{email || 'your admin email'}</strong>
              </p>
              <button className="button button-dark" type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <>Send Verification Code <ArrowRight /></>}
              </button>
            </form>
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
          </>
        )}

        {/* MODE 3: ENTER OTP & NEW PASSWORD */}
        {authMode === 'verify' && (
          <>
            <h1>Enter <em>code.</em></h1>
            <p className="admin-auth-copy">
              A 6-digit verification code has been dispatched to <strong>{email}</strong>. Enter it below with your new password.
            </p>
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
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'launches' | 'orders' | 'messages' | 'subscribers'>('overview')
  const [stats, setStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Launches
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

  // Edit Launch State
  const [showEditLaunchModal, setShowEditLaunchModal] = useState(false)
  const [editLaunchId, setEditLaunchId] = useState('')
  const [editLaunchTitle, setEditLaunchTitle] = useState('')
  const [editLaunchTagline, setEditLaunchTagline] = useState('')
  const [editLaunchIntro, setEditLaunchIntro] = useState('')
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

  // Data lists
  const [ordersList, setOrdersList] = useState<any[]>([])
  const [messagesList, setMessagesList] = useState<any[]>([])
  const [subscribersList, setSubscribersList] = useState<any[]>([])
  const [, setLoadingData] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  // Change Password State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [currPassword, setCurrPassword] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('')
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState('')

  // Close modals when user presses Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddBookModal(false)
        setShowEditLaunchModal(false)
        setShowNewLaunchModal(false)
        setSelectedLaunchRegs(null)
        setShowChangePasswordModal(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const loadAdminData = async () => {
    setLoadingData(true)
    try {
      const [statsRes, launchesRes, ordersRes, msgsRes, subsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/launches'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/messages'),
        fetch('/api/admin/subscribers'),
      ])

      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
        setRecentActivity(statsData.recentActivity || [])
      }

      const launchesData = await launchesRes.json()
      if (launchesData.success) setLaunchesList(launchesData.launches || [])

      const ordersData = await ordersRes.json()
      if (ordersData.success) setOrdersList(ordersData.orders || [])

      const msgsData = await msgsRes.json()
      if (msgsData.success) setMessagesList(msgsData.messages || [])

      const subsData = await subsRes.json()
      if (subsData.success) setSubscribersList(subsData.subscribers || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

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
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setUrlCallback(data.url)
        showToast('Image uploaded to Cloudinary successfully!')
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBookTitle || !newBookPrice) return
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBookTitle,
          author: AUTHOR_NAME,
          author_image: AUTHOR_IMAGE,
          bio: AUTHOR_BIO,
          category: newBookCategory,
          price: newBookPrice.startsWith('$') ? newBookPrice : `$${newBookPrice}`,
          description: newBookDesc,
          image: newBookCover || '/practical-trading-psychology.png',
          pdf_url: newBookPdf,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Book "${newBookTitle}" added to collection!`)
        setShowAddBookModal(false)
        setNewBookTitle('')
        setNewBookDesc('')
        setNewBookCover('')
        setNewBookPdf('')
        refreshBooks()
        loadAdminData()
      } else {
        alert(data.error || 'Failed to add book')
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteBook = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast(`Book "${title}" deleted.`)
        refreshBooks()
        loadAdminData()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const openEditLaunchModal = (launch: BookLaunch) => {
    setEditLaunchId(launch.id)
    setEditLaunchTitle(launch.title || '')
    setEditLaunchTagline(launch.tagline || '')
    setEditLaunchIntro(launch.intro || '')
    setEditLaunchDesc(launch.description || '')
    const themesStr = Array.isArray(launch.themes)
      ? launch.themes.join(', ')
      : typeof launch.themes === 'string'
      ? (() => {
          try {
            const parsed = JSON.parse(launch.themes)
            return Array.isArray(parsed) ? parsed.join(', ') : launch.themes
          } catch {
            return launch.themes
          }
        })()
      : ''
    setEditLaunchThemes(themesStr)
    setEditLaunchCover(launch.cover_image || '')
    try {
      const d = new Date(launch.launch_date)
      if (!isNaN(d.getTime())) {
        const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
        setEditLaunchDate(localIso)
      } else {
        setEditLaunchDate('2026-11-06T09:00')
      }
    } catch {
      setEditLaunchDate('2026-11-06T09:00')
    }
    setEditLaunchActive(Boolean(launch.is_active))
    setShowEditLaunchModal(true)
  }

  const handleCreateLaunch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLaunchTitle || !newLaunchDate) return

    const themesArray = newLaunchThemes.split(',').map((t) => t.trim()).filter(Boolean)

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
          themes: themesArray,
          cover_image: newLaunchCover || '/practical-trading-psychology.png',
          launch_date: new Date(newLaunchDate).toISOString(),
          is_active: newLaunchActive,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`New Book Launch "${newLaunchTitle}" created and activated!`)
        setShowNewLaunchModal(false)
        refreshLaunch()
        loadAdminData()
      } else {
        alert(data.error || 'Failed to create launch')
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleUpdateLaunch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editLaunchTitle || !editLaunchDate || !editLaunchId) return

    setSavingLaunch(true)
    const themesArray = editLaunchThemes.split(',').map((t) => t.trim()).filter(Boolean)

    try {
      const res = await fetch('/api/admin/launches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editLaunchId,
          title: editLaunchTitle,
          author: AUTHOR_NAME,
          author_bio: AUTHOR_BIO,
          author_image: AUTHOR_IMAGE,
          tagline: editLaunchTagline,
          intro: editLaunchIntro || editLaunchDesc,
          description: editLaunchDesc,
          themes: themesArray,
          cover_image: editLaunchCover || '/practical-trading-psychology.png',
          launch_date: new Date(editLaunchDate).toISOString(),
          is_active: editLaunchActive,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Book Launch "${editLaunchTitle}" updated successfully!`)
        setShowEditLaunchModal(false)
        refreshLaunch()
        loadAdminData()
      } else {
        alert(data.error || 'Failed to update launch')
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update launch')
    } finally {
      setSavingLaunch(false)
    }
  }

  const handleToggleLaunch = async (launchId: string, title: string) => {
    try {
      const res = await fetch('/api/admin/launches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ launch_id: launchId, is_active: true }),
      })
      if (res.ok) {
        showToast(`"${title}" is now the active Book Launch on storefront!`)
        refreshLaunch()
        loadAdminData()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleViewRegistrations = async (launchId: string, title: string) => {
    setSelectedLaunchTitle(title)
    try {
      const res = await fetch(`/api/admin/launches/${launchId}/registrations`)
      const data = await res.json()
      if (data.success) {
        setSelectedLaunchRegs(data.registrations || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const exportCsv = (rows: any[], filename: string) => {
    if (!rows.length) return
    const headers = Object.keys(rows[0]).join(',')
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers,
        ...rows.map((r) =>
          Object.values(r)
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(',')
        ),
      ].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="admin-page section-shell">
      {toastMsg && (
        <div className="admin-toast-banner">
          <CheckCircle2 /> {toastMsg}
        </div>
      )}

      <div className="admin-topbar">
        <div>
          <p className="eyebrow">Serendipity / Elvis Admin Control Center</p>
          <h1>Good morning, <em>Elvis.</em></h1>
        </div>
        <div className="admin-topbar-actions">
          <button
            className="text-button"
            onClick={() => {
              refreshBooks()
              refreshLaunch()
              loadAdminData()
            }}
          >
            <RefreshIcon /> Refresh
          </button>
          <button
            className="button button-light btn-sm"
            onClick={() => {
              setPassError('')
              setShowChangePasswordModal(true)
            }}
          >
            <KeyRound /> Change Password
          </button>
          <button className="button button-dark" onClick={onLogout}>
            <LogOut /> Sign out
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs">
        <button className={activeTab === 'overview' ? 'is-active' : ''} onClick={() => setActiveTab('overview')}>
          <BarChart3 /> Overview
        </button>
        <button className={activeTab === 'books' ? 'is-active' : ''} onClick={() => setActiveTab('books')}>
          <BookOpen /> Books ({booksList.length})
        </button>
        <button className={activeTab === 'launches' ? 'is-active' : ''} onClick={() => setActiveTab('launches')}>
          <Rocket /> Book Launches ({launchesList.length})
        </button>
        <button className={activeTab === 'orders' ? 'is-active' : ''} onClick={() => setActiveTab('orders')}>
          <ShoppingBag /> Orders ({ordersList.length})
        </button>
        <button className={activeTab === 'messages' ? 'is-active' : ''} onClick={() => setActiveTab('messages')}>
          <Mail /> Inquiries ({messagesList.length})
        </button>
        <button className={activeTab === 'subscribers' ? 'is-active' : ''} onClick={() => setActiveTab('subscribers')}>
          <Users /> Reading List ({subscribersList.length})
        </button>
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div className="admin-stats">
            <article>
              <span><BookOpen /></span>
              <p>Books in collection</p>
              <strong>{String(stats?.booksCount !== undefined ? stats.booksCount : booksList.length).padStart(2, '0')}</strong>
              <small>Live catalog</small>
            </article>
            <article>
              <span><Users /></span>
              <p>Reader subscribers</p>
              <strong>{stats?.subscribersCount ?? subscribersList.length ?? 0}</strong>
              <small>Active reading list</small>
            </article>
            <article>
              <span><Rocket /></span>
              <p>Launch registrants</p>
              <strong>{stats?.registrationsCount ?? 0}</strong>
              <small>Launch waitlist</small>
            </article>
            <article>
              <span><ShoppingBag /></span>
              <p>Completed orders</p>
              <strong>{stats?.salesCount ?? ordersList.length ?? 0}</strong>
              <small>Automated Paystack</small>
            </article>
            <article>
              <span><span className="admin-currency">$</span></span>
              <p>Total Revenue</p>
              <strong>${Number(stats?.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              <small>Ebook sales</small>
            </article>
          </div>

          <div className="admin-content-grid">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Active Book Launch</p>
                  <h2>{activeLaunch.title}</h2>
                </div>
                <div className="admin-header-actions">
                  <button className="button button-dark btn-sm" onClick={() => openEditLaunchModal(activeLaunch)}>
                    <Settings2 /> Edit Active Launch
                  </button>
                  <button className="button button-light btn-sm" onClick={() => setActiveTab('launches')}>
                    All Launches <ArrowRight />
                  </button>
                </div>
              </div>
              <div className="active-launch-card">
                <img src={activeLaunch.cover_image} alt={activeLaunch.title} className="active-launch-thumb" />
                <div className="active-launch-body">
                  <div className="active-launch-top">
                    <span className="launch-badge">CURRENT STOREFRONT LAUNCH</span>
                    <button className="button button-light btn-sm" onClick={() => openEditLaunchModal(activeLaunch)}>
                      <Settings2 /> Edit Details
                    </button>
                  </div>
                  <h3>{activeLaunch.title}</h3>
                  <p className="launch-card-meta">
                    Author: {activeLaunch.author} · Target: {new Date(activeLaunch.launch_date).toLocaleDateString()}
                  </p>
                  <p className="launch-card-tagline">{activeLaunch.tagline}</p>
                  <div className="active-launch-actions">
                    <button className="button button-dark btn-sm" onClick={() => openEditLaunchModal(activeLaunch)}>
                      <Settings2 /> Update Launch Information
                    </button>
                    <button
                      className="button button-light btn-sm"
                      onClick={() => handleViewRegistrations(activeLaunch.id, activeLaunch.title)}
                    >
                      <Users /> View Waitlist ({activeLaunch.registrations_count || stats?.registrationsCount || 0})
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-panel admin-activity">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Recent Activity</p>
                  <h2>Live feed</h2>
                </div>
              </div>
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((item, idx) => (
                  <div className="activity-item" key={idx}>
                    <span>{item.type === 'order' ? <ShoppingBag /> : <Mail />}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                      <small>{item.time}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="admin-empty-sub">No recent transactions or messages recorded yet.</p>
              )}
            </section>
          </div>
        </>
      )}

      {/* TAB: BOOKS */}
      {activeTab === 'books' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Storefront Collection</p>
              <h2>Manage Books</h2>
            </div>
            <button className="button button-dark" onClick={() => setShowAddBookModal(true)}>
              <Plus /> Add new book
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
                  <th>Ebook / PDF Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {booksList.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <img src={book.image} alt={book.title} className="table-book-thumb" />
                    </td>
                    <td>
                      <strong>{book.title}</strong>
                      <p className="table-sub">{book.author}</p>
                    </td>
                    <td><span className="table-tag">{book.category}</span></td>
                    <td><strong>{book.price}</strong></td>
                    <td>
                      {book.pdf_url ? (
                        <a href={book.pdf_url} target="_blank" rel="noreferrer" className="table-link">
                          <Download /> PDF Attached
                        </a>
                      ) : (
                        <span className="table-sub">None</span>
                      )}
                    </td>
                    <td>
                      <button className="table-delete-btn" onClick={() => handleDeleteBook(book.id, book.title)} aria-label="Delete">
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB: LAUNCHES */}
      {activeTab === 'launches' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Dynamic Launch Controller</p>
              <h2>Manage Book Launches</h2>
            </div>
            <button className="button button-dark" onClick={() => setShowNewLaunchModal(true)}>
              <Plus /> Create New Book Launch
            </button>
          </div>

          <p className="admin-desc-note">
            Manage your book launches, customize live countdowns, update book titles, author profiles, cover artwork, and key themes across the entire storefront in real-time.
          </p>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Cover</th>
                  <th>Launch Title</th>
                  <th>Author</th>
                  <th>Launch Date</th>
                  <th>Registrants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {launchesList.map((launch) => (
                  <tr key={launch.id} className={launch.is_active ? 'row-active-launch' : ''}>
                    <td>
                      {launch.is_active ? (
                        <span className="badge-active"><Check /> ACTIVE ON STORE</span>
                      ) : (
                        <button className="text-button" onClick={() => handleToggleLaunch(launch.id, launch.title)}>
                          Set Active
                        </button>
                      )}
                    </td>
                    <td>
                      <img src={launch.cover_image} alt={launch.title} className="table-book-thumb" />
                    </td>
                    <td>
                      <strong>{launch.title}</strong>
                      <p className="table-sub">{launch.slug}</p>
                    </td>
                    <td>{launch.author}</td>
                    <td>{new Date(launch.launch_date).toLocaleDateString()}</td>
                    <td>
                      <strong>{launch.registrations_count || 0} readers</strong>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button className="button button-light btn-sm" onClick={() => openEditLaunchModal(launch)}>
                          <Settings2 /> Edit Details
                        </button>
                        <button className="button button-light btn-sm" onClick={() => handleViewRegistrations(launch.id, launch.title)}>
                          <Users /> Registrants ({launch.registrations_count || 0})
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

      {/* TAB: ORDERS */}
      {activeTab === 'orders' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Paystack Transactions</p>
              <h2>Customer Orders</h2>
            </div>
            <button className="button button-light btn-sm" onClick={() => exportCsv(ordersList, 'serendipity-orders.csv')}>
              <Download /> Export CSV
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Items Purchased</th>
                  <th>Status</th>
                  <th>Ebook Delivery</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.length ? (
                  ordersList.map((order) => (
                    <tr key={order.id || order.reference}>
                      <td><code>{order.reference}</code></td>
                      <td>
                        <strong>{order.customer_name || 'Reader'}</strong>
                        <p className="table-sub">{order.customer_email}</p>
                      </td>
                      <td><strong>${Number(order.total_amount).toFixed(2)}</strong></td>
                      <td>
                        <span className="table-sub">
                          {Array.isArray(order.items) ? order.items.map((i: any) => `${i.title} (x${i.quantity || 1})`).join(', ') : '1 Book'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${order.status}`}>{order.status}</span>
                      </td>
                      <td>
                        {order.pdf_sent ? <span className="badge-sent"><Check /> Sent via Resend</span> : <span className="table-sub">Pending</span>}
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                      No customer orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB: MESSAGES */}
      {activeTab === 'messages' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Contact Form Engagement</p>
              <h2>Reader Messages</h2>
            </div>
            <button className="button button-light btn-sm" onClick={() => exportCsv(messagesList, 'serendipity-messages.csv')}>
              <Download /> Export CSV
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
                      <td>{new Date(msg.created_at).toLocaleDateString()}</td>
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

      {/* TAB: SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Newsletter Audience</p>
              <h2>Reading List Subscribers</h2>
            </div>
            <button className="button button-light btn-sm" onClick={() => exportCsv(subscribersList, 'serendipity-subscribers.csv')}>
              <Download /> Export CSV
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                      <td>{new Date(sub.created_at || Date.now()).toLocaleDateString()}</td>
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

      {/* MODAL: ADD BOOK */}
      {showAddBookModal && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddBookModal(false)
          }}
        >
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Add New Book to Collection</h3>
              <button className="icon-button" onClick={() => setShowAddBookModal(false)}><X /></button>
            </div>
            <form onSubmit={handleCreateBook} className="admin-modal-form">
              <label>
                Book Title
                <input required value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} placeholder="e.g. Practical Trading Psychology" />
              </label>
              <div className="form-row-2">
                <label>
                  Category
                  <input required value={newBookCategory} onChange={(e) => setNewBookCategory(e.target.value)} placeholder="e.g. Mind & Money" />
                </label>
                <label>
                  Price
                  <input required value={newBookPrice} onChange={(e) => setNewBookPrice(e.target.value)} placeholder="$24.00" />
                </label>
              </div>
              <label>
                Downloadable Ebook / PDF URL
                <input value={newBookPdf} onChange={(e) => setNewBookPdf(e.target.value)} placeholder="https://..." />
              </label>
              <label>
                Description
                <textarea rows={3} value={newBookDesc} onChange={(e) => setNewBookDesc(e.target.value)} placeholder="Brief summary for catalog..." />
              </label>
              <div className="cloudinary-upload-box">
                <label className="cloudinary-label">
                  <UploadCloud /> Upload Cover to Cloudinary
                  <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, setNewBookCover)} />
                </label>
                {uploadingImage && <p className="uploading-text"><Loader2 className="animate-spin" /> Uploading to Cloudinary CDN...</p>}
                {newBookCover && (
                  <div className="cover-preview-row">
                    <img src={newBookCover} alt="Cover preview" className="cover-preview-img" />
                    <span>{newBookCover.slice(0, 45)}...</span>
                  </div>
                )}
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowAddBookModal(false)}>Cancel</button>
                <button type="submit" className="button button-dark">Save Book <ArrowRight /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BOOK LAUNCH */}
      {showEditLaunchModal && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !savingLaunch) setShowEditLaunchModal(false)
          }}
        >
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Launch Editor</p>
                <h3>Edit Book Launch Details</h3>
              </div>
              <button className="icon-button" onClick={() => setShowEditLaunchModal(false)}><X /></button>
            </div>
            <form onSubmit={handleUpdateLaunch} className="admin-modal-form">
              <label>
                Launch Title
                <input required value={editLaunchTitle} onChange={(e) => setEditLaunchTitle(e.target.value)} placeholder="e.g. Practical Trading Psychology" />
              </label>
              <label>
                Launch Date & Time (Countdown Target)
                <input required type="datetime-local" value={editLaunchDate} onChange={(e) => setEditLaunchDate(e.target.value)} />
              </label>
              <label>
                Tagline (appears in hero & launch countdown banner)
                <textarea rows={2} value={editLaunchTagline} onChange={(e) => setEditLaunchTagline(e.target.value)} />
              </label>
              <label>
                Key Takeaways / Themes (comma-separated)
                <input value={editLaunchThemes} onChange={(e) => setEditLaunchThemes(e.target.value)} />
              </label>
              <label>
                About Book Description
                <textarea rows={3} value={editLaunchDesc} onChange={(e) => setEditLaunchDesc(e.target.value)} />
              </label>
              <div className="cloudinary-upload-box">
                <label className="cloudinary-label">
                  <UploadCloud /> Upload Book Cover to Cloudinary
                  <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, setEditLaunchCover)} />
                </label>
                {uploadingImage && <p className="uploading-text"><Loader2 className="animate-spin" /> Uploading to Cloudinary CDN...</p>}
                {editLaunchCover && (
                  <div className="cover-preview-row">
                    <img src={editLaunchCover} alt="Cover preview" className="cover-preview-img" />
                    <span>{editLaunchCover.slice(0, 45)}...</span>
                  </div>
                )}
              </div>
              <label className="checkbox-label admin-checkbox">
                <input type="checkbox" checked={editLaunchActive} onChange={(e) => setEditLaunchActive(e.target.checked)} />
                <span>Keep as ACTIVE Book Launch on the live storefront</span>
              </label>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowEditLaunchModal(false)} disabled={savingLaunch}>Cancel</button>
                <button type="submit" className="button button-dark" disabled={savingLaunch}>
                  {savingLaunch ? <><Loader2 className="animate-spin" /> Saving...</> : <>Save Changes <ArrowRight /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW LAUNCH */}
      {showNewLaunchModal && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNewLaunchModal(false)
          }}
        >
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Create Dynamic Book Launch</h3>
              <button className="icon-button" onClick={() => setShowNewLaunchModal(false)}><X /></button>
            </div>
            <form onSubmit={handleCreateLaunch} className="admin-modal-form">
              <label>
                Launch Title
                <input required value={newLaunchTitle} onChange={(e) => setNewLaunchTitle(e.target.value)} placeholder="e.g. Practical Trading Psychology" />
              </label>
              <label>
                Launch Date & Time (Countdown Target)
                <input required type="datetime-local" value={newLaunchDate} onChange={(e) => setNewLaunchDate(e.target.value)} />
              </label>
              <label>
                Tagline (appears in header strip & hero)
                <textarea rows={2} value={newLaunchTagline} onChange={(e) => setNewLaunchTagline(e.target.value)} />
              </label>
              <label>
                Themes (comma-separated for key takeaways grid)
                <input value={newLaunchThemes} onChange={(e) => setNewLaunchThemes(e.target.value)} placeholder="Emotional discipline, Process over outcome, Managing psychology" />
              </label>
              <label>
                About Book Description
                <textarea rows={3} value={newLaunchDesc} onChange={(e) => setNewLaunchDesc(e.target.value)} />
              </label>
              <div className="cloudinary-upload-box">
                <label className="cloudinary-label">
                  <UploadCloud /> Upload Launch Cover to Cloudinary
                  <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, setNewLaunchCover)} />
                </label>
                {uploadingImage && <p className="uploading-text"><Loader2 className="animate-spin" /> Uploading to Cloudinary CDN...</p>}
                {newLaunchCover && (
                  <div className="cover-preview-row">
                    <img src={newLaunchCover} alt="Cover preview" className="cover-preview-img" />
                    <span>{newLaunchCover.slice(0, 45)}...</span>
                  </div>
                )}
              </div>
              <label className="checkbox-label admin-checkbox">
                <input type="checkbox" checked={newLaunchActive} onChange={(e) => setNewLaunchActive(e.target.checked)} />
                <span>Immediately set as the ACTIVE Book Launch on the live storefront</span>
              </label>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowNewLaunchModal(false)}>Cancel</button>
                <button type="submit" className="button button-dark">Create & Deploy Launch <ArrowRight /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW LAUNCH REGISTRANTS */}
      {selectedLaunchRegs !== null && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLaunchRegs(null)
          }}
        >
          <div className="admin-modal-card wide-modal">
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Launch Registrations</p>
                <h3>{selectedLaunchTitle} ({selectedLaunchRegs.length} Readers)</h3>
              </div>
              <div className="admin-header-actions">
                <button className="button button-light btn-sm" onClick={() => exportCsv(selectedLaunchRegs, `${selectedLaunchTitle}-registrants.csv`)}>
                  <Download /> Export CSV
                </button>
                <button className="icon-button" onClick={() => setSelectedLaunchRegs(null)}><X /></button>
              </div>
            </div>
            <div className="admin-table-wrap">
              {selectedLaunchRegs.length ? (
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Reader Name</th>
                      <th>Email Address</th>
                      <th>Phone</th>
                      <th>Updates Opt-In</th>
                      <th>Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLaunchRegs.map((r, i) => (
                      <tr key={r.id || i}>
                        <td>{i + 1}</td>
                        <td><strong>{r.name}</strong></td>
                        <td><a href={`mailto:${r.email}`} className="table-link">{r.email}</a></td>
                        <td>{r.phone || 'N/A'}</td>
                        <td>
                          {r.agreed_updates !== false ? (
                            <span className="badge-sent">Yes (Opted in)</span>
                          ) : (
                            <span className="table-sub">No</span>
                          )}
                        </td>
                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="admin-empty-sub">No readers registered for this launch yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE PASSWORD */}
      {showChangePasswordModal && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !passLoading) setShowChangePasswordModal(false)
          }}
        >
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
              <p className="admin-info-note">
                <ShieldCheck style={{ width: 14, height: 14, verticalAlign: 'middle', marginRight: 4 }} />
                A security alert will be sent to <strong>hello@elvisjusticebooks.com</strong> once changed.
              </p>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowChangePasswordModal(false)}>Cancel</button>
                <button type="submit" className="button button-dark" disabled={passLoading}>
                  {passLoading ? <Loader2 className="animate-spin" /> : <>Update Password <ArrowRight /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Link href="/" className="admin-storefront-link">
        <ArrowLeft /> Back to storefront
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
