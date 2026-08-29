'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/navigation'
import CartDrawer from '@/components/cart-drawer'
import { CartProvider } from '@/lib/cart-context'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <CartProvider>
      {!isAdmin && <Navigation />}
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
