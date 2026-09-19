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

export const DEFAULT_BOOKS: Book[] = [
  {
    id: 'practical-trading-psychology',
    title: 'Practical Trading Psychology',
    author: 'Dr Elvis Justice Bedi',
    authorImage: '/elvis.jpeg',
    category: 'Mind & Money',
    price: '$24.00',
    description: 'A thoughtful guide to the emotional discipline and clear process behind better trading decisions.',
    bio: 'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.',
    image: '/practical-trading-psychology.png',
    pdf_url: '',
    featured: true,
  },
  {
    id: 'the-art-of-attention',
    title: 'The Art of Attention',
    author: 'Mara Linde',
    authorImage: '/elvis.jpeg',
    category: 'Mindfulness',
    price: '$19.00',
    description: 'A quiet invitation to notice more, do less, and make room for what matters.',
    bio: 'Mara Linde writes about attention, rest, and the small rituals that help us return to ourselves. She lives between long walks, marked-up notebooks, and quiet rooms.',
    image: '/just.jpeg',
    pdf_url: '',
  },
  {
    id: 'small-courage',
    title: 'Small Courage',
    author: 'Jonas Vale',
    authorImage: '/elvis.jpeg',
    category: 'Personal Growth',
    price: '$21.00',
    description: 'Notes on showing up for the meaningful work, one ordinary day at a time.',
    bio: 'Jonas Vale is an essayist and teacher interested in creative practice, resilience, and the courage found in ordinary routines. He writes from a small studio by the sea.',
    image: '/elvis.jpeg',
    pdf_url: '',
  },
]

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
