'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  LogOut, 
  ShieldCheck, 
  BookOpen, 
  ShoppingBag, 
  Clock, 
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getStoredRSVPs, getStoredOrders } from '@/lib/data-store'

export default function AuthModal() {
  const { 
    user, 
    login, 
    logout, 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    isProfileModalOpen, 
    setIsProfileModalOpen 
  } = useAuth()

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    const role = email.toLowerCase().includes('elvis') || email.toLowerCase().includes('admin') || email.toLowerCase().includes('author') 
      ? 'author' 
      : 'reader'
    login(email, name || email.split('@')[0], role)
    setEmail('')
    setPassword('')
    setName('')
  }

  const handleDemoLogin = (role: 'reader' | 'author') => {
    if (role === 'author') {
      login('dr.elvis@elvisjusticebedi.com', 'Dr. Elvis Justice Bedi', 'author')
    } else {
      login('reader@elvisjusticebedi.com', 'Devoted Reader', 'reader')
    }
  }

  const orders = user ? getStoredOrders().filter(o => o.customerEmail?.toLowerCase() === user.email.toLowerCase()) : []
  const rsvps = user ? getStoredRSVPs().filter(r => r.email?.toLowerCase() === user.email.toLowerCase()) : []

  return (
    <>
      {/* ============================================================== */}
      {/* 1. SIGN IN / REGISTER MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isAuthModalOpen && !user && (
          <div className="fixed inset-0 z-50 bg-[#1d1b18]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#f8f5ef] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[rgba(80,60,40,0.12)] space-y-6 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f1ece3] text-[#77716a] hover:text-[#1d1b18] flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="space-y-1.5 text-center">
                <span className="editorial-script text-2xl text-[#c79a68]">
                  Literary Portal
                </span>
                <h3 className="editorial-heading text-2xl sm:text-3xl text-[#1d1b18]">
                  {authMode === 'signin' ? 'Welcome Back' : 'Create Reader Account'}
                </h3>
                <p className="body-text text-xs text-[#77716a] max-w-xs mx-auto">
                  {authMode === 'signin' 
                    ? 'Access your purchased book editions, digital downloads, and launch passes.' 
                    : 'Join the readership for early access to book premieres and signed editions.'}
                </p>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex bg-[#f1ece3] p-1 rounded-full border border-[rgba(80,60,40,0.08)]">
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    authMode === 'signin' 
                      ? 'bg-[#2a211c] text-white shadow-xs' 
                      : 'text-[#77716a] hover:text-[#1d1b18]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    authMode === 'signup' 
                      ? 'bg-[#2a211c] text-white shadow-xs' 
                      : 'text-[#77716a] hover:text-[#1d1b18]'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716a]" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Elvis Reader"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716a]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="reader@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716a]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="editorial-btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md mt-2 flex items-center justify-center gap-1.5"
                >
                  <span>{authMode === 'signin' ? 'Sign In to Profile' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Logins */}
              <div className="border-t border-[rgba(80,60,40,0.08)] pt-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider text-center block font-sans">
                  Quick Demo Access
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('reader')}
                    className="py-2 px-3 bg-white border border-[rgba(80,60,40,0.12)] rounded-xl text-[11px] font-semibold text-[#1d1b18] hover:border-[#c79a68] transition-colors cursor-pointer text-center"
                  >
                    👤 Reader Account
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('author')}
                    className="py-2 px-3 bg-[#2a211c] text-[#f8f5ef] rounded-xl text-[11px] font-semibold hover:bg-black transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c79a68]" /> Author Desk
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 2. USER PROFILE / ACCOUNT MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isProfileModalOpen && user && (
          <div className="fixed inset-0 z-50 bg-[#1d1b18]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#f8f5ef] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[rgba(80,60,40,0.12)] space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f1ece3] text-[#77716a] hover:text-[#1d1b18] flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Profile Card Header */}
              <div className="flex items-center gap-4 border-b border-[rgba(80,60,40,0.08)] pb-5">
                <div className="w-14 h-14 rounded-full bg-[#2a211c] text-[#c79a68] border-2 border-[#c79a68]/40 flex items-center justify-center font-serif font-bold text-xl shadow-md shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="editorial-heading text-xl sm:text-2xl text-[#1d1b18] leading-tight">
                      {user.name}
                    </h3>
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold font-sans ${
                      user.role === 'author' || user.role === 'admin'
                        ? 'bg-[#c79a68] text-white'
                        : 'bg-[#2a211c]/10 text-[#2a211c]'
                    }`}>
                      {user.role === 'author' ? 'Author' : 'Reader'}
                    </span>
                  </div>
                  <p className="text-xs text-[#77716a] font-sans mt-0.5">{user.email}</p>
                  <p className="text-[10px] text-[#77716a]/70 font-sans mt-0.5">Member since {user.joinedDate}</p>
                </div>
              </div>

              {/* Author Desk Quick Portal (if author/admin) */}
              {(user.role === 'author' || user.role === 'admin') && (
                <div className="p-4 rounded-2xl bg-[#2a211c] text-[#f8f5ef] space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#c79a68] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                      <ShieldCheck className="w-4 h-4 text-[#c79a68]" /> Author Operations Desk
                    </span>
                    <span className="text-[10px] text-[#f8f5ef]/60 font-sans">Full Admin Access</span>
                  </div>
                  <p className="text-xs text-[#f8f5ef]/80 font-sans leading-relaxed">
                    Manage book launches, bookstore inventory, event broadcast streams, and global RSVPs.
                  </p>
                  <Link
                    href="/admin"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c79a68] hover:bg-[#b58b5b] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors font-sans shadow-sm"
                  >
                    <span>Open Author Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Reader Activity & Library */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider block font-sans">
                  Account Activity &amp; Passes
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-[rgba(80,60,40,0.08)] space-y-1">
                    <span className="text-[10px] text-[#77716a] uppercase font-bold font-sans flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#c79a68]" /> Orders
                    </span>
                    <p className="font-serif text-lg font-bold text-[#1d1b18]">
                      {orders.length} <span className="text-xs font-normal text-[#77716a] font-sans">Editions</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[rgba(80,60,40,0.08)] space-y-1">
                    <span className="text-[10px] text-[#77716a] uppercase font-bold font-sans flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#c79a68]" /> RSVPs
                    </span>
                    <p className="font-serif text-lg font-bold text-[#1d1b18]">
                      {rsvps.length} <span className="text-xs font-normal text-[#77716a] font-sans">Passes</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[rgba(80,60,40,0.08)]">
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors cursor-pointer font-sans"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>

                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="editorial-btn-secondary text-xs py-2 px-5"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
