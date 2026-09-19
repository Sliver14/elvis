import type { Metadata } from 'next'
import { ContactView } from '@/components/views/contact-view'

export const metadata: Metadata = {
  title: 'Contact Us — SERENDIPITY / ELVIS',
  description: 'Have a question about an order or book recommendation? Get in touch with Serendipity / Elvis.',
}

export default function ContactPage() {
  return <ContactView />
}
