import type { Metadata } from 'next'
import { CatalogView } from '@/components/views/catalog-view'

export const metadata: Metadata = {
  title: 'Books Collection — SERENDIPITY / ELVIS',
  description: 'Browse a curated collection of books on trading psychology, mindfulness, and personal growth.',
}

export default function BooksPage() {
  return <CatalogView />
}
