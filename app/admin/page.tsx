import type { Metadata } from 'next'
import { AdminView } from '@/components/views/admin-view'

export const metadata: Metadata = {
  title: 'Admin Control Center — SERENDIPITY / ELVIS',
  description: 'Manage catalog, launches, orders, and reader communications.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminView />
}
