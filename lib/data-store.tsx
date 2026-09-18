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
  launchId?: string
}

export interface ScheduleItem {
  id: string
  time: string
  activity: string
  speaker: string
}

export interface LaunchFormat {
  id: string
  name: string
  price: number
  type: 'digital' | 'physical'
  description: string
}

export interface LaunchChapter {
  num: string
  title: string
  desc: string
}

export interface LaunchPillar {
  number: string
  title: string
  description: string
}

export interface LaunchSpeaker {
  name: string
  title: string
  bio: string
  initials: string
}

export interface LaunchSpec {
  label: string
  value: string
}

export interface LaunchRSVP {
  id: string
  launchId: string
  launchSlug: string
  launchTitle: string
  name: string
  email: string
  date: string
}

export interface BookLaunch {
  id: string
  slug: string
  title: string
  subtitle: string
  author: string
  tagline: string
  genre: string
  coverImage: string
  launchDate: string // ISO date string e.g. "2026-07-21T18:00:00"
  launchDateFormatted: string // e.g. "July 21, 2026"
  launchTimeFormatted: string // e.g. "6:00 PM – 9:00 PM EST"
  location: string // e.g. "Virtual Mainstage"
  streamUrl?: string
  trailerUrl?: string
  status: 'upcoming' | 'live' | 'completed'
  isFeatured?: boolean
  inStore?: boolean
  synopsis: string[]
  quote: string
  pagesCount: number
  formats: LaunchFormat[]
  chapters: LaunchChapter[]
  pillars: LaunchPillar[]
  schedule: ScheduleItem[]
  speakers: LaunchSpeaker[]
  specs: LaunchSpec[]
}

export const defaultBookLaunches: BookLaunch[] = [
  {
    id: 'launch-quiet-hearts',
    slug: 'the-weight-of-quiet-hearts',
    title: 'The Weight of Quiet Hearts',
    subtitle: 'A transformative manual of mindset, strategy, and sovereign execution.',
    author: 'Dr. Elvis Justice Bedi',
    tagline: 'Where ambition, human mastery, and relentless focus meet the edge of destiny.',
    genre: 'Mindset Mastery & Strategic Performance',
    coverImage: '/book.jpeg',
    launchDate: '2026-07-21T18:00:00',
    launchDateFormatted: 'July 21, 2026',
    launchTimeFormatted: '6:00 PM – 9:00 PM EST',
    location: 'Virtual Mainstage',
    streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'upcoming',
    isFeatured: true,
    inStore: true,
    quote: 'True freedom is not found in ease, but in deliberate mastery.',
    pagesCount: 384,
    synopsis: [
      'The Weight of Quiet Hearts is an extraordinary blueprint of personal development, mindset optimization, and structural leadership. Through practical execution models, readers are invited to dismantle self-limiting mindsets and unlock their true performance potential.',
      'Dr. Elvis Justice Bedi weaves a captivating blueprint that blends strategy, habit design, and elite performance. Designed to inspire immediate action long after the final page is read.'
    ],
    formats: [
      { id: 'quiet-ebook', name: 'Instant eBook (PDF/EPUB)', price: 9.99, type: 'digital', description: 'Instant PDF/EPUB download. Read on Kindle, iPad, or mobile.' },
      { id: 'quiet-audio', name: 'Masterclass Audiobook', price: 14.99, type: 'digital', description: 'High-res audio recording narrated with companion worksheets.' },
      { id: 'quiet-paperback', name: 'Deluxe Softcover Edition', price: 19.99, type: 'physical', description: 'Beautifully printed softcover delivered to your doorstep.' },
      { id: 'quiet-hardcover', name: 'Collector Gold-Foil Hardcover', price: 29.99, type: 'physical', description: 'Premium hardcover with custom gold foil dust jacket.' }
    ],
    chapters: [
      { num: 'Chapter 01', title: 'The Architecture of Conviction', desc: 'Deconstructing passive thinking and building an uncompromising mindset foundation.' },
      { num: 'Chapter 02', title: 'The Silent Arena of Mastery', desc: 'Why the greatest breakthroughs happen in unseen, deliberate preparation.' },
      { num: 'Chapter 03', title: 'High-Stakes Decision Models', desc: 'Navigating ambiguity, risk calibration, and sovereign execution under pressure.' },
      { num: 'Chapter 04', title: 'Constructing Enduring Momentum', desc: 'Designing daily behavioral operating loops that compound exponentially over time.' }
    ],
    pillars: [
      { number: '01', title: 'Mindset Architecture', description: 'Systematic frameworks to dismantle limiting conditioning and build unshakable mental discipline.' },
      { number: '02', title: 'High-Stakes Execution', description: 'Practical playbooks drawn from global venture strategy to execute high-impact decisions daily.' },
      { number: '03', title: 'Lyrical Narrative', description: 'Compelling autobiographical lessons woven with profound philosophies on personal sovereignty.' },
      { number: '04', title: 'Global Performance Edge', description: 'Proven tactics utilized by elite achievers and industry leaders across multiple continents.' }
    ],
    schedule: [
      { id: '1', time: '6:00 PM', activity: 'Virtual Lobby Opens & Pre-show Audio', speaker: '' },
      { id: '2', time: '6:30 PM', activity: 'Opening Remarks & Keynote Address', speaker: 'Dr. Elvis Justice Bedi' },
      { id: '3', time: '7:00 PM', activity: 'Live Digital Chapter Reading', speaker: 'Dr. Elvis Justice Bedi' },
      { id: '4', time: '7:30 PM', activity: 'Interactive Critical Dialogue', speaker: 'Marcus Thompson & Dr. Elvis' },
      { id: '5', time: '8:00 PM', activity: 'Global Thought Leader Panel', speaker: 'Sarah Chen, David Rodriguez' },
      { id: '6', time: '8:30 PM', activity: 'Live Worldwide Audience Q&A', speaker: 'Audience Submissions' },
      { id: '7', time: '9:00 PM', activity: 'VIP Closing Lounge & Digital Signings', speaker: '' }
    ],
    speakers: [
      { name: 'Dr. Elvis Justice Bedi', title: 'Author & Keynote Speaker', bio: 'Founder, venture strategist, and author of The Weight of Quiet Hearts.', initials: 'EJ' },
      { name: 'Marcus Thompson', title: 'Literary Critic & Host', bio: 'Renowned essayist and international cultural commentator.', initials: 'MT' },
      { name: 'Sarah Chen', title: 'Publishing Director', bio: 'Leading innovator in modern digital media and authorship.', initials: 'SC' },
      { name: 'David Rodriguez', title: 'Executive Interviewer', bio: 'Award-winning journalist and host of Global Leadership Series.', initials: 'DR' }
    ],
    specs: [
      { label: 'Title', value: 'The Weight of Quiet Hearts' },
      { label: 'Author', value: 'Dr. Elvis Justice Bedi' },
      { label: 'Genre', value: 'Mindset Mastery & Strategic Performance' },
      { label: 'Formats Available', value: 'Hardcover, Paperback, Instant eBook (EPUB/PDF), Audiobook' },
      { label: 'Print Pricing', value: '$19.99 (Paperback) / $29.99 (Collector Hardcover)' },
      { label: 'Digital Pricing', value: '$9.99 (Instant eBook) / $14.99 (Audiobook)' },
      { label: 'Publication Date', value: 'July 21, 2026' },
      { label: 'Pages / Length', value: '384 Pages / 8 hrs 42 mins Audio' }
    ]
  },
  {
    id: 'launch-silent-echo',
    slug: 'the-silent-echo',
    title: 'The Silent Echo: Architect of Conviction',
    subtitle: 'Navigating quiet discipline, high-altitude strategy, and psychological sovereignty.',
    author: 'Dr. Elvis Justice Bedi',
    tagline: 'When the world is loud, silence becomes the supreme strategic advantage.',
    genre: 'Strategic Sovereignty & Modern Leadership',
    coverImage: '/products-paperback.png',
    launchDate: '2026-10-15T18:30:00',
    launchDateFormatted: 'October 15, 2026',
    launchTimeFormatted: '6:30 PM – 9:30 PM EST',
    location: 'Global Virtual Amphitheater',
    streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'upcoming',
    isFeatured: false,
    inStore: false,
    quote: 'True power is never announced; it is demonstrated through quiet execution.',
    pagesCount: 320,
    synopsis: [
      'The Silent Echo explores the subtle art of internal mastery, strategic focus, and the high price of enduring conviction in an era of relentless distraction.',
      'Through clinical analysis and real-world executive case studies, Dr. Elvis provides a roadmap for individuals seeking to command their time, protect their focus, and lead from within.'
    ],
    formats: [
      { id: 'silent-ebook-fmt', name: 'Digital Edition (eBook)', price: 8.99, type: 'digital', description: 'EPUB & PDF with interactive reader notes.' },
      { id: 'silent-audio-fmt', name: 'Audiobook Experience', price: 12.99, type: 'digital', description: 'Narrated author commentary with bonus audio chapters.' },
      { id: 'silent-paper-fmt', name: 'Trade Paperback Edition', price: 17.99, type: 'physical', description: 'Matte-finish softcover edition with high-grade paper.' }
    ],
    chapters: [
      { num: 'Chapter 01', title: 'The Noise of the Modern Arena', desc: 'Filtering out external turbulence to discover sovereign cognitive clarity.' },
      { num: 'Chapter 02', title: 'Calibrating the Internal Compass', desc: 'Developing non-negotiable core values that withstand societal pressure.' },
      { num: 'Chapter 03', title: 'The Discipline of Strategic Reticence', desc: 'Why keeping your strategic moves silent generates exponential leverage.' },
      { num: 'Chapter 04', title: 'The Echo of Enduring Impact', desc: 'Building legacies that outlast temporary hype and market cycles.' }
    ],
    pillars: [
      { number: '01', title: 'Cognitive Sovereignty', description: 'Techniques for insulating your mind against digital clutter and external demands.' },
      { number: '02', title: 'Subtle Power Dynamics', description: 'Commanding rooms and negotiations without raising your voice.' },
      { number: '03', title: 'Long-Horizon Vision', description: 'Mapping out five-to-ten-year execution horizons with calmness and precision.' },
      { number: '04', title: 'The Art of Deep Rest', description: 'Recharging mental reserves to sustain relentless high performance.' }
    ],
    schedule: [
      { id: 's1', time: '6:30 PM', activity: 'Worldwide Digital Check-in & Prelude', speaker: '' },
      { id: 's2', time: '7:00 PM', activity: 'The Genesis of The Silent Echo (Keynote)', speaker: 'Dr. Elvis Justice Bedi' },
      { id: 's3', time: '7:45 PM', activity: 'Executive Panel on Quiet Leadership', speaker: 'Guest Industry Pioneers' },
      { id: 's4', time: '8:30 PM', activity: 'Live Audience Discussion & AMA', speaker: 'Dr. Elvis Justice Bedi' },
      { id: 's5', time: '9:15 PM', activity: 'Special Launch Bundles & Closing Remarks', speaker: '' }
    ],
    speakers: [
      { name: 'Dr. Elvis Justice Bedi', title: 'Author & Keynote Speaker', bio: 'Founder, venture strategist, and author.', initials: 'EJ' },
      { name: 'Elena Rostova', title: 'Leadership Psychologist', bio: 'Specialist in elite executive resilience and cognitive stamina.', initials: 'ER' },
      { name: 'Kofi Mensah', title: 'Global Enterprise Strategist', bio: 'Adviser to fast-growing tech and capital ventures across EMEA.', initials: 'KM' }
    ],
    specs: [
      { label: 'Title', value: 'The Silent Echo: Architect of Conviction' },
      { label: 'Author', value: 'Dr. Elvis Justice Bedi' },
      { label: 'Genre', value: 'Strategic Sovereignty & Modern Leadership' },
      { label: 'Formats Available', value: 'Trade Paperback, eBook, Audiobook' },
      { label: 'Publication Date', value: 'October 15, 2026' },
      { label: 'Pages / Length', value: '320 Pages / 6 hrs 50 mins Audio' }
    ]
  },
  {
    id: 'launch-sovereign-execution',
    slug: 'sovereign-execution',
    title: 'Sovereign Execution: High-Velocity Playbook',
    subtitle: 'Venture strategy, daily discipline, and uncompromised results.',
    author: 'Dr. Elvis Justice Bedi',
    tagline: 'Ideas are common. Sovereign execution is the rare currency of the exceptional.',
    genre: 'Venture Strategy & Capital Systems',
    coverImage: '/products-ebook.png',
    launchDate: '2026-03-10T18:00:00',
    launchDateFormatted: 'March 10, 2026',
    launchTimeFormatted: '6:00 PM EST',
    location: 'Recorded Virtual Premiere',
    streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'completed',
    isFeatured: false,
    inStore: true,
    quote: 'The gap between aspiration and realization is bridged solely by sovereign execution.',
    pagesCount: 290,
    synopsis: [
      'Sovereign Execution breaks down the daily tactical rhythms and structural capital models used to build scalable enterprises and self-directed wealth.',
      'This volume provides direct frameworks for eliminating hesitation, mastering capital deployment, and executing at an elite global standard.'
    ],
    formats: [
      { id: 'sovereign-ebook-fmt', name: 'Digital Edition (Instant Download)', price: 7.99, type: 'digital', description: 'Universal PDF and EPUB formatting.' },
      { id: 'sovereign-paper-fmt', name: 'Physical Print Edition', price: 16.99, type: 'physical', description: 'Hardcover collector printing.' }
    ],
    chapters: [
      { num: 'Chapter 01', title: 'Velocity Over Hesitation', desc: 'Why speed of implementation compounds faster than exhaustive planning.' },
      { num: 'Chapter 02', title: 'Asymmetric Opportunity Design', desc: 'Structuring decisions where downside is capped and upside is exponential.' },
      { num: 'Chapter 03', title: 'Capital Calibration', desc: 'Deploying resources strategically across high-conviction ventures.' },
      { num: 'Chapter 04', title: 'The Sovereign Operator', desc: 'Building systems that run independent of continuous micromanagement.' }
    ],
    pillars: [
      { number: '01', title: 'High-Velocity Loops', description: 'Rapid iteration cycles that outpace conventional corporate bureaucracies.' },
      { number: '02', title: 'Risk Calibration', description: 'Mathematical framing of venture bets for maximum asymmetrical reward.' },
      { number: '03', title: 'Execution Stamina', description: 'Maintaining consistency across multi-year build phases.' },
      { number: '04', title: 'Capital Architecture', description: 'Designing capital stacks that preserve long-term independence.' }
    ],
    schedule: [
      { id: 'sov1', time: 'Broadcast Recording', activity: 'Complete Keynote & Launch Panel Replay', speaker: 'Dr. Elvis Justice Bedi' }
    ],
    speakers: [
      { name: 'Dr. Elvis Justice Bedi', title: 'Author & Keynote Speaker', bio: 'Founder, venture strategist, and author.', initials: 'EJ' }
    ],
    specs: [
      { label: 'Title', value: 'Sovereign Execution: High-Velocity Playbook' },
      { label: 'Author', value: 'Dr. Elvis Justice Bedi' },
      { label: 'Genre', value: 'Venture Strategy & Capital Systems' },
      { label: 'Formats Available', value: 'eBook, Paperback' },
      { label: 'Publication Date', value: 'March 10, 2026' },
      { label: 'Pages', value: '290 Pages' }
    ]
  }
]

export const defaultProducts: Product[] = [
  {
    id: 'aurora-ebook',
    name: 'The Weight of Quiet Hearts (eBook)',
    book: 'The Weight of Quiet Hearts',
    price: 9.99,
    image: '/book.jpeg',
    description: 'Instant PDF/EPUB download. Read on Kindle, iPad, or mobile.',
    category: 'New Release',
    type: 'digital',
    launchId: 'launch-quiet-hearts'
  },
  {
    id: 'aurora-audio',
    name: 'The Weight of Quiet Hearts (Audiobook)',
    book: 'The Weight of Quiet Hearts',
    price: 14.99,
    image: '/book.jpeg',
    description: 'High-res audio recording narrated by professional voice talent with bonus chapters.',
    category: 'New Release',
    type: 'digital',
    launchId: 'launch-quiet-hearts'
  },
  {
    id: 'aurora-paperback',
    name: 'The Weight of Quiet Hearts (Paperback)',
    book: 'The Weight of Quiet Hearts',
    price: 19.99,
    image: '/book.jpeg',
    description: 'Beautifully printed softcover delivered to your doorstep.',
    category: 'New Release',
    type: 'physical',
    launchId: 'launch-quiet-hearts'
  },
  {
    id: 'aurora-hardcover',
    name: 'The Weight of Quiet Hearts (Collector Hardcover)',
    book: 'The Weight of Quiet Hearts',
    price: 29.99,
    image: '/book.jpeg',
    description: 'Premium hardcover with custom gold foil dust jacket.',
    category: 'New Release',
    type: 'physical',
    launchId: 'launch-quiet-hearts'
  },
  {
    id: 'silent-ebook',
    name: 'The Silent Echo (eBook)',
    book: 'The Silent Echo',
    price: 8.99,
    image: '/products-ebook.png',
    description: "Dr. Elvis's acclaimed leadership volume. Digital edition.",
    category: 'Backlist Bestseller',
    type: 'digital',
    launchId: 'launch-silent-echo'
  },
  {
    id: 'silent-paperback',
    name: 'The Silent Echo (Paperback)',
    book: 'The Silent Echo',
    price: 17.99,
    image: '/products-paperback.png',
    description: "Dr. Elvis's acclaimed leadership volume. Softcover edition.",
    category: 'Backlist Bestseller',
    type: 'physical',
    launchId: 'launch-silent-echo'
  },
  {
    id: 'sovereign-ebook',
    name: 'Sovereign Execution (Digital Edition)',
    book: 'Sovereign Execution',
    price: 7.99,
    image: '/products-ebook.png',
    description: 'Practical playbook for venture execution and capital design.',
    category: 'Backlist Bestseller',
    type: 'digital',
    launchId: 'launch-sovereign-execution'
  }
]

export const defaultSchedule: ScheduleItem[] = defaultBookLaunches[0].schedule

// ==========================================
// BOOK LAUNCH STORAGE HELPERS
// ==========================================

export function getStoredLaunches(): BookLaunch[] {
  if (typeof window === 'undefined') return defaultBookLaunches
  const stored = localStorage.getItem('aurora_book_launches')
  if (!stored) {
    localStorage.setItem('aurora_book_launches', JSON.stringify(defaultBookLaunches))
    return defaultBookLaunches
  }
  try {
    return JSON.parse(stored)
  } catch (e) {
    return defaultBookLaunches
  }
}

export function setStoredLaunches(launches: BookLaunch[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aurora_book_launches', JSON.stringify(launches))
  }
}

export function getLaunchBySlug(slug: string): BookLaunch | undefined {
  const launches = getStoredLaunches()
  return launches.find(l => l.slug === slug) || launches[0]
}

export function getLaunchById(id: string): BookLaunch | undefined {
  const launches = getStoredLaunches()
  return launches.find(l => l.id === id)
}

export function getFeaturedLaunch(): BookLaunch {
  const launches = getStoredLaunches()
  return launches.find(l => l.isFeatured) || launches.find(l => l.status === 'upcoming') || launches[0] || defaultBookLaunches[0]
}

export function addBookLaunch(launch: BookLaunch): BookLaunch[] {
  const launches = getStoredLaunches()
  const updated = [launch, ...launches]
  setStoredLaunches(updated)
  return updated
}

export function updateBookLaunch(id: string, updatedFields: Partial<BookLaunch>): BookLaunch[] {
  const launches = getStoredLaunches()
  const updated = launches.map(l => l.id === id ? { ...l, ...updatedFields } : l)
  setStoredLaunches(updated)
  return updated
}

export function deleteBookLaunch(id: string): BookLaunch[] {
  const launches = getStoredLaunches()
  const updated = launches.filter(l => l.id !== id)
  setStoredLaunches(updated)
  return updated
}

// Convert a book launch into store products
export function promoteLaunchToStore(launchId: string): Product[] {
  const launches = getStoredLaunches()
  const targetLaunch = launches.find(l => l.id === launchId)
  if (!targetLaunch) return getStoredProducts()

  const currentProducts = getStoredProducts()
  
  // Generate products from formats with guaranteed unique IDs
  const newProducts: Product[] = targetLaunch.formats.map((fmt, index) => {
    const formatSlug = (fmt.id || fmt.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return {
      id: `${targetLaunch.slug}-${formatSlug}-${index + 1}`,
      name: `${targetLaunch.title} (${fmt.name})`,
      book: targetLaunch.title,
      price: fmt.price,
      image: targetLaunch.coverImage || '/book.jpeg',
      description: fmt.description || targetLaunch.subtitle,
      category: targetLaunch.status === 'upcoming' ? 'Pre-Order' : 'New Release',
      type: fmt.type,
      launchId: targetLaunch.id
    }
  })

  // Filter out any older duplicate products for this launch if needed
  const existingWithoutThis = currentProducts.filter(p => p.launchId !== targetLaunch.id && p.book !== targetLaunch.title)
  const updatedProducts = [...newProducts, ...existingWithoutThis]
  
  setStoredProducts(updatedProducts)

  // Mark launch as inStore
  updateBookLaunch(launchId, { inStore: true })

  return updatedProducts
}

// ==========================================
// STORE PRODUCTS STORAGE HELPERS (WITH SANITIZATION)
// ==========================================

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return defaultProducts
  const stored = localStorage.getItem('aurora_store_products')
  if (!stored) {
    localStorage.setItem('aurora_store_products', JSON.stringify(defaultProducts))
    return defaultProducts
  }
  try {
    const parsed: Product[] = JSON.parse(stored)
    // Deduplicate any items with duplicate IDs to prevent React key collisions
    const seen = new Set<string>()
    let modified = false
    const uniqueList: Product[] = []
    
    for (let i = 0; i < parsed.length; i++) {
      const p = { ...parsed[i] }
      if (!p.id) {
        p.id = `prod-${i}-${Date.now().toString().slice(-4)}`
        modified = true
      }
      if (seen.has(p.id)) {
        p.id = `${p.id}-${i + 1}`
        modified = true
      }
      seen.add(p.id)
      uniqueList.push(p)
    }

    if (modified) {
      localStorage.setItem('aurora_store_products', JSON.stringify(uniqueList))
    }
    return uniqueList
  } catch (e) {
    return defaultProducts
  }
}

export function setStoredProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    // Ensure all products have unique IDs
    const seen = new Set<string>()
    const sanitized = products.map((p, i) => {
      let id = p.id || `prod-${i}`
      if (seen.has(id)) {
        id = `${id}-${i + 1}`
      }
      seen.add(id)
      return { ...p, id }
    })
    localStorage.setItem('aurora_store_products', JSON.stringify(sanitized))
  }
}

// ==========================================
// SCHEDULE STORAGE HELPERS
// ==========================================

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

// ==========================================
// RSVP STORAGE HELPERS
// ==========================================

export function getStoredRSVPs(): LaunchRSVP[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('aurora_rsvps')
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch (e) {
    return []
  }
}

export function saveRSVP(launch: BookLaunch, name: string, email: string): LaunchRSVP[] {
  const current = getStoredRSVPs()
  const newRsvp: LaunchRSVP = {
    id: Date.now().toString(),
    launchId: launch.id,
    launchSlug: launch.slug,
    launchTitle: launch.title,
    name,
    email,
    date: new Date().toLocaleDateString()
  }
  const updated = [newRsvp, ...current]
  if (typeof window !== 'undefined') {
    localStorage.setItem('aurora_rsvps', JSON.stringify(updated))
    localStorage.setItem(`aurora_rsvp_${launch.slug}`, 'true')
  }
  return updated
}

// ==========================================
// ORDER STORAGE HELPERS
// ==========================================

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface StoredOrder {
  orderId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  date: string
  status: string
}

export function getStoredOrders(): StoredOrder[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('aurora_orders')
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch (e) {
    return []
  }
}

