import type { Metadata } from 'next'
import { LaunchView } from '@/components/views/launch-view'

export const metadata: Metadata = {
  title: 'Practical Trading Psychology — Official Book Launch | SERENDIPITY / ELVIS',
  description:
    'Join the official book launch of Practical Trading Psychology by Dr Elvis Justice Bedi. Register now for priority updates.',
}

export default function LaunchPage() {
  return <LaunchView />
}
