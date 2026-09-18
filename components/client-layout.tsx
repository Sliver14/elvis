'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/navigation'
import CartDrawer from '@/components/cart-drawer'
import AuthModal from '@/components/auth-modal'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-context'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <CartProvider>
        {!isAdmin && <Navigation />}
        {children}
        <CartDrawer />
        <AuthModal />
      </CartProvider>
    </AuthProvider>
  )
}
