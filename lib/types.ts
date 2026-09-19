export interface Book {
  id: string
  title: string
  author: string
  authorImage?: string
  author_image?: string
  category: string
  price: string
  description: string
  bio?: string
  image: string
  pdf_url?: string
  featured?: boolean
}

export interface BookLaunch {
  id: string
  slug: string
  title: string
  author: string
  author_bio?: string
  author_image?: string
  tagline?: string
  intro?: string
  description?: string
  themes: string[]
  cover_image: string
  launch_date: string
  is_active: boolean
  registrations_count?: number
}

export const DEFAULT_BOOKS: Book[] = []

export const DEFAULT_LAUNCH: BookLaunch = {
  id: 'practical-trading-psychology-launch',
  slug: 'practical-trading-psychology',
  title: 'Practical Trading Psychology',
  author: 'Dr Elvis Justice Bedi',
  author_bio: 'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.',
  author_image: '/elvis.jpeg',
  tagline: 'Process over profit.\nWin in the mind first.',
  intro: 'A practical exploration of the mindset, discipline, emotional control, and decision-making processes that shape a trader\'s journey.',
  description: 'Practical Trading Psychology explores the mindset, discipline, emotional control, and decision-making processes that shape a trader\'s journey. It emphasizes the importance of mastering the mind and building a consistent process rather than being driven solely by profit.',
  themes: [
    'Emotional discipline',
    'Process-driven decision-making',
    'Managing trading psychology',
    'Developing consistency',
    'Building the right mindset'
  ],
  cover_image: '/practical-trading-psychology.png',
  launch_date: '2026-11-06T09:00:00+01:00',
  is_active: true
}
