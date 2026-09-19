import type { Metadata } from 'next'
import { BookDetailsView } from '@/components/views/book-details-view'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const formattedTitle = id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: `${formattedTitle} — SERENDIPITY / ELVIS`,
    description: `Read more about ${formattedTitle} and explore ideas with staying power.`,
  }
}

export default async function BookDetailsPage({ params }: PageProps) {
  const { id } = await params
  return <BookDetailsView bookId={id} />
}
