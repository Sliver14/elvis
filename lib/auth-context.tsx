'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'reader' | 'author' | 'admin'
  avatar?: string
  joinedDate: string
}

interface AuthContextType {
  user: UserProfile | null
  login: (email: string, name?: string, role?: 'reader' | 'author' | 'admin') => void
  logout: () => void
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
  isProfileModalOpen: boolean
  setIsProfileModalOpen: (open: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aurora_user_profile')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
  }, [])

  const login = (email: string, name?: string, role: 'reader' | 'author' | 'admin' = 'reader') => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0].replace(/[._]/g, ' '),
      email,
      role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    setUser(newUser)
    localStorage.setItem('aurora_user_profile', JSON.stringify(newUser))
    setIsAuthModalOpen(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('aurora_user_profile')
    setIsProfileModalOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
