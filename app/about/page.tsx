import type { Metadata } from 'next'
import { AboutView } from '@/components/views/about-view'

export const metadata: Metadata = {
  title: 'About Us — SERENDIPITY / ELVIS',
  description: 'An independent bookstore for ideas with staying power. Meet the author and explore our philosophy.',
}

export default function AboutPage() {
  return <AboutView />
}
