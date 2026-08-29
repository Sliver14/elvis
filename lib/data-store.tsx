'use client'

export interface Product {
  id: string
  name: string
  book: string
  price: number
  image: string
  description: string
  category: string
  type: 'digital' | 'physical'
}

export interface ScheduleItem {
  id: string
  time: string
  activity: string
  speaker: string
}

export const defaultProducts: Product[] = [
  {
    id: 'aurora-ebook',
    name: "JUST ELVIS JUSTICE (eBook)",
    book: "JUST ELVIS JUSTICE",
    price: 9.99,
    image: '/book.jpeg',
    description: 'Instant PDF/EPUB download. Read on Kindle, iPad, or mobile.',
    category: 'New Release',
    type: 'digital',
  },
  {
    id: 'aurora-audio',
    name: "JUST ELVIS JUSTICE (Audiobook)",
    book: "JUST ELVIS JUSTICE",
    price: 14.99,
    image: '/book.jpeg',
    description: 'High-res audio recording narrated by professional voice talent.',
    category: 'New Release',
    type: 'digital',
  },
  {
    id: 'aurora-paperback',
    name: "JUST ELVIS JUSTICE (Paperback)",
    book: "JUST ELVIS JUSTICE",
    price: 19.99,
    image: '/book.jpeg',
    description: 'Beautifully printed softcover delivered to your doorstep.',
    category: 'New Release',
    type: 'physical',
  },
  {
    id: 'aurora-hardcover',
    name: "JUST ELVIS JUSTICE (Hardcover)",
    book: "JUST ELVIS JUSTICE",
    price: 29.99,
    image: '/book.jpeg',
    description: 'Premium hardcover with custom gold foil dust jacket.',
    category: 'New Release',
    type: 'physical',
  },
  {
    id: 'silent-ebook',
    name: 'The Silent Echo (eBook)',
    book: 'The Silent Echo',
    price: 8.99,
    image: '/products-ebook.png',
    description: "Dr. Elvis's award-winning suspense novel. Digital edition.",
    category: 'Backlist Bestseller',
    type: 'digital',
  },
  {
    id: 'silent-paperback',
    name: 'The Silent Echo (Paperback)',
    book: 'The Silent Echo',
    price: 17.99,
    image: '/products-paperback.png',
    description: "Dr. Elvis's award-winning suspense novel. Softcover edition.",
    category: 'Backlist Bestseller',
    type: 'physical',
  },
]

export const defaultSchedule: ScheduleItem[] = [
  { id: '1', time: '6:00 PM', activity: 'Virtual Lobby Opens & Pre-show Audio', speaker: '' },
  { id: '2', time: '6:30 PM', activity: 'Opening Remarks', speaker: 'Dr. Elvis' },
  { id: '3', time: '7:00 PM', activity: 'Digital Book Reading', speaker: 'Dr. Elvis' },
  { id: '4', time: '7:30 PM', activity: 'Live Interactive Interview', speaker: 'With Literary Critic' },
  { id: '5', time: '8:00 PM', activity: 'Virtual Panel Discussion', speaker: '4 Industry Experts' },
  { id: '6', time: '8:30 PM', activity: 'Live Q&A Session', speaker: 'Audience Questions' },
  { id: '7', time: '9:00 PM', activity: 'Closing Remarks & VIP After-Party Room', speaker: '' },
]

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return defaultProducts
  const stored = localStorage.getItem('aurora_store_products')
  if (!stored) {
    localStorage.setItem('aurora_store_products', JSON.stringify(defaultProducts))
    return defaultProducts
  }
  try {
    return JSON.parse(stored)
  } catch (e) {
    return defaultProducts
  }
}

export function setStoredProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aurora_store_products', JSON.stringify(products))
  }
}

export function getStoredSchedule(): ScheduleItem[] {
  if (typeof window === 'undefined') return defaultSchedule
  const stored = localStorage.getItem('aurora_store_schedule')
  if (!stored) {
    localStorage.setItem('aurora_store_schedule', JSON.stringify(defaultSchedule))
    return defaultSchedule
  }
  try {
    return JSON.parse(stored)
  } catch (e) {
    return defaultSchedule
  }
}

export function setStoredSchedule(schedule: ScheduleItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aurora_store_schedule', JSON.stringify(schedule))
  }
}
