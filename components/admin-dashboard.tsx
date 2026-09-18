'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Mail, 
  LogOut, 
  PlusCircle, 
  Trash2, 
  RefreshCw, 
  Play,
  TrendingUp,
  Sparkles,
  BookOpen,
  Calendar,
  Edit2,
  Check,
  X,
  Rocket,
  ArrowRight,
  ExternalLink,
  ShoppingBag,
  Star,
  Layers,
  ChevronRight,
  UploadCloud
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  getStoredProducts, 
  setStoredProducts, 
  getStoredSchedule, 
  setStoredSchedule, 
  getStoredLaunches,
  setStoredLaunches,
  addBookLaunch,
  updateBookLaunch,
  deleteBookLaunch,
  promoteLaunchToStore,
  getStoredRSVPs,
  BookLaunch,
  Product, 
  ScheduleItem,
  LaunchRSVP,
  LaunchFormat,
  LaunchChapter,
  LaunchSpeaker
} from '@/lib/data-store'

const menuItems = [
  { icon: BarChart3, label: 'Dashboard' },
  { icon: Rocket, label: 'Book Launches' },
  { icon: ShoppingBag, label: 'Store Manager' },
  { icon: ShoppingCart, label: 'Orders' },
  { icon: Users, label: 'Registrations' },
  { icon: Calendar, label: 'Event Schedule' },
  { icon: Mail, label: 'Messages' },
]

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  orderId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  date: string
  status: string
}

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isBooking: boolean
  date: string
}

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('Dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [rsvps, setRsvps] = useState<LaunchRSVP[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [eventMode, setEventMode] = useState('live')
  
  // Data Store lists
  const [launches, setLaunchesList] = useState<BookLaunch[]>([])
  const [products, setProductsList] = useState<Product[]>([])
  const [schedule, setScheduleList] = useState<ScheduleItem[]>([])

  // Modal / Form state for Book Launches
  const [showLaunchModal, setShowLaunchModal] = useState(false)
  const [editingLaunchId, setEditingLaunchId] = useState<string | null>(null)

  // Launch Form fields
  const [launchTitle, setLaunchTitle] = useState('')
  const [launchSubtitle, setLaunchSubtitle] = useState('')
  const [launchSlug, setLaunchSlug] = useState('')
  const [launchAuthor, setLaunchAuthor] = useState('Dr. Elvis Justice Bedi')
  const [launchGenre, setLaunchGenre] = useState('Mindset Mastery & Strategic Performance')
  const [launchCover, setLaunchCover] = useState('/book.jpeg')
  const [launchDate, setLaunchDate] = useState('2026-08-20T18:00:00')
  const [launchDateFormatted, setLaunchDateFormatted] = useState('August 20, 2026')
  const [launchTimeFormatted, setLaunchTimeFormatted] = useState('6:00 PM – 9:00 PM EST')
  const [launchLocation, setLaunchLocation] = useState('Virtual Mainstage')
  const [launchStatus, setLaunchStatus] = useState<'upcoming' | 'live' | 'completed'>('upcoming')
  const [launchSynopsis, setLaunchSynopsis] = useState('')
  const [launchQuote, setLaunchQuote] = useState('')
  const [launchPages, setLaunchPages] = useState('350')
  const [launchStreamUrl, setLaunchStreamUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ')
  const [launchTrailerUrl, setLaunchTrailerUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ')
  const [launchEbookPrice, setLaunchEbookPrice] = useState('9.99')
  const [launchPaperbackPrice, setLaunchPaperbackPrice] = useState('19.99')
  const [launchHardcoverPrice, setLaunchHardcoverPrice] = useState('29.99')
  const [launchAudioPrice, setLaunchAudioPrice] = useState('14.99')
  const [enableEbook, setEnableEbook] = useState(false)
  const [enableAudio, setEnableAudio] = useState(true) // single format by default (Audiobook)
  const [enablePaperback, setEnablePaperback] = useState(false)
  const [enableHardcover, setEnableHardcover] = useState(false)
  const [launchPublishToStoreNow, setLaunchPublishToStoreNow] = useState(false)

  // Product Edit states
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [newProdName, setNewProdName] = useState('')
  const [newProdPrice, setNewProdPrice] = useState('')
  const [newProdDesc, setNewProdDesc] = useState('')
  const [newProdCategory, setNewProdCategory] = useState('New Release')
  const [newProdType, setNewProdType] = useState<'digital' | 'physical'>('digital')
  const [newProdImage, setNewProdImage] = useState('/book.jpeg')

  // Schedule Edit states
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)
  const [newSchedTime, setNewSchedTime] = useState('')
  const [newSchedActivity, setNewSchedActivity] = useState('')
  const [newSchedSpeaker, setNewSchedSpeaker] = useState('')

  // Filter registrations / schedule by launch
  const [selectedLaunchFilter, setSelectedLaunchFilter] = useState<string>('all')

  // Load all storage databases
  const loadData = () => {
    const savedOrders = JSON.parse(localStorage.getItem('aurora_orders') || '[]')
    const savedMessages = JSON.parse(localStorage.getItem('aurora_messages') || '[]')
    const savedEventMode = localStorage.getItem('aurora_event_mode') || 'live'
    
    setOrders(savedOrders)
    setRsvps(getStoredRSVPs())
    setMessages(savedMessages)
    setEventMode(savedEventMode)
    setLaunchesList(getStoredLaunches())
    setProductsList(getStoredProducts())
    setScheduleList(getStoredSchedule())
  }

  useEffect(() => {
    loadData()
  }, [])

  // Stats calculation
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrdersCount = orders.length
  const totalRsvpCount = rsvps.length
  const totalLaunchesCount = launches.length
  const upcomingLaunchesCount = launches.filter(l => l.status === 'upcoming').length

  const stats = [
    { label: 'Total Revenue', value: `$${totalSales.toFixed(2)}`, icon: TrendingUp, trend: '+18.4% growth' },
    { label: 'Book Launches', value: `${totalLaunchesCount} (${upcomingLaunchesCount} Live/Upcoming)`, icon: Rocket, trend: 'Multi-Launch Hub' },
    { label: 'Total RSVPs', value: String(totalRsvpCount), icon: Users, trend: 'Global registrants' },
    { label: 'Store Catalog', value: `${products.length} Editions`, icon: ShoppingBag, trend: 'Active products' },
  ]

  // Broadcast toggle
  const handleToggleEventMode = () => {
    const nextMode = eventMode === 'live' ? 'replay' : 'live'
    setEventMode(nextMode)
    localStorage.setItem('aurora_event_mode', nextMode)
  }

  const handleSimulateEmail = (type: string) => {
    if (rsvps.length === 0) {
      alert("No registered RSVPs found! Register some users first on the countdown or event pages.")
      return
    }
    alert(`[Broadcast Notification Simulation] Successfully dispatched the "${type} before launch" automated reminder email sequence to all ${rsvps.length} registered RSVP accounts.`)
  }

  // ==========================================
  // BOOK LAUNCH ACTIONS
  // ==========================================

  const resetLaunchForm = () => {
    setEditingLaunchId(null)
    setLaunchTitle('')
    setLaunchSubtitle('')
    setLaunchSlug('')
    setLaunchAuthor('Dr. Elvis Justice Bedi')
    setLaunchGenre('Mindset Mastery & Strategic Performance')
    setLaunchCover('/book.jpeg')
    setLaunchDate('2026-08-20T18:00:00')
    setLaunchDateFormatted('August 20, 2026')
    setLaunchTimeFormatted('6:00 PM – 9:00 PM EST')
    setLaunchLocation('Virtual Mainstage')
    setLaunchStatus('upcoming')
    setLaunchSynopsis('')
    setLaunchQuote('')
    setLaunchPages('350')
    setLaunchStreamUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')
    setLaunchTrailerUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')
    setLaunchEbookPrice('9.99')
    setLaunchPaperbackPrice('19.99')
    setLaunchHardcoverPrice('29.99')
    setLaunchAudioPrice('14.99')
    setEnableEbook(false)
    setEnableAudio(true) // single format by default
    setEnablePaperback(false)
    setEnableHardcover(false)
    setLaunchPublishToStoreNow(false)
  }

  const handleOpenNewLaunchModal = () => {
    resetLaunchForm()
    setShowLaunchModal(true)
  }

  const handleOpenEditLaunchModal = (launch: BookLaunch) => {
    setEditingLaunchId(launch.id)
    setLaunchTitle(launch.title)
    setLaunchSubtitle(launch.subtitle)
    setLaunchSlug(launch.slug)
    setLaunchAuthor(launch.author)
    setLaunchGenre(launch.genre)
    setLaunchCover(launch.coverImage)
    setLaunchDate(launch.launchDate)
    setLaunchDateFormatted(launch.launchDateFormatted)
    setLaunchTimeFormatted(launch.launchTimeFormatted)
    setLaunchLocation(launch.location)
    setLaunchStatus(launch.status)
    setLaunchSynopsis(launch.synopsis.join('\n\n'))
    setLaunchQuote(launch.quote || '')
    setLaunchPages(String(launch.pagesCount || 350))
    setLaunchStreamUrl(launch.streamUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ')
    setLaunchTrailerUrl(launch.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ')
    
    // Find format presence & prices
    const ebookFmt = launch.formats?.find(f => f.type === 'digital' && f.name.toLowerCase().includes('ebook'))
    const paperFmt = launch.formats?.find(f => f.type === 'physical' && (f.name.toLowerCase().includes('paperback') || f.name.toLowerCase().includes('softcover')))
    const hardFmt = launch.formats?.find(f => f.type === 'physical' && f.name.toLowerCase().includes('hardcover'))
    const audioFmt = launch.formats?.find(f => f.type === 'digital' && f.name.toLowerCase().includes('audio'))

    if (ebookFmt) setLaunchEbookPrice(String(ebookFmt.price))
    if (paperFmt) setLaunchPaperbackPrice(String(paperFmt.price))
    if (hardFmt) setLaunchHardcoverPrice(String(hardFmt.price))
    if (audioFmt) setLaunchAudioPrice(String(audioFmt.price))

    setEnableEbook(Boolean(ebookFmt))
    setEnableAudio(Boolean(audioFmt))
    setEnablePaperback(Boolean(paperFmt))
    setEnableHardcover(Boolean(hardFmt))

    setLaunchPublishToStoreNow(launch.inStore || false)
    setShowLaunchModal(true)
  }

  const handleSaveLaunchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!launchTitle) return

    const slug = launchSlug.trim() 
      ? launchSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : launchTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    // Build formats array dynamically based on admin format selection
    const formats: LaunchFormat[] = []
    if (enableAudio) {
      formats.push({ 
        id: `${slug}-audio`, 
        name: 'Masterclass Audiobook', 
        price: parseFloat(launchAudioPrice) || 14.99, 
        type: 'digital', 
        description: 'High-definition voice recording with companion guides.' 
      })
    }
    if (enableEbook) {
      formats.push({ 
        id: `${slug}-ebook`, 
        name: 'Instant eBook (PDF/EPUB)', 
        price: parseFloat(launchEbookPrice) || 9.99, 
        type: 'digital', 
        description: 'Instant PDF/EPUB download for digital readers.' 
      })
    }
    if (enablePaperback) {
      formats.push({ 
        id: `${slug}-paperback`, 
        name: 'Deluxe Softcover Edition', 
        price: parseFloat(launchPaperbackPrice) || 19.99, 
        type: 'physical', 
        description: 'Premium paperback printing delivered to readers worldwide.' 
      })
    }
    if (enableHardcover) {
      formats.push({ 
        id: `${slug}-hardcover`, 
        name: 'Collector Hardcover Edition', 
        price: parseFloat(launchHardcoverPrice) || 29.99, 
        type: 'physical', 
        description: 'Deluxe foil-stamped hardcover collector volume.' 
      })
    }

    // Safety fallback if no formats checked
    if (formats.length === 0) {
      formats.push({ 
        id: `${slug}-audio`, 
        name: 'Masterclass Audiobook', 
        price: parseFloat(launchAudioPrice) || 14.99, 
        type: 'digital', 
        description: 'High-definition voice recording with companion guides.' 
      })
    }

    const synopsisArray = launchSynopsis.trim() 
      ? launchSynopsis.split('\n\n').filter(p => p.trim())
      : [`${launchTitle} is an authoritative work by ${launchAuthor} exploring modern strategy, discipline, and performance.`]

    if (editingLaunchId) {
      // Update existing launch
      const updated = updateBookLaunch(editingLaunchId, {
        title: launchTitle,
        subtitle: launchSubtitle,
        slug,
        author: launchAuthor,
        genre: launchGenre,
        coverImage: launchCover,
        launchDate,
        launchDateFormatted,
        launchTimeFormatted,
        location: launchLocation,
        status: launchStatus,
        synopsis: synopsisArray,
        quote: launchQuote,
        pagesCount: parseInt(launchPages) || 350,
        streamUrl: launchStreamUrl,
        trailerUrl: launchTrailerUrl,
        formats,
        inStore: launchPublishToStoreNow
      })
      setLaunchesList(updated)

      if (launchPublishToStoreNow) {
        promoteLaunchToStore(editingLaunchId)
        setProductsList(getStoredProducts())
      }
    } else {
      // Create new launch
      const newLaunchId = `launch-${slug}-${Date.now().toString().slice(-4)}`
      const newLaunch: BookLaunch = {
        id: newLaunchId,
        slug,
        title: launchTitle,
        subtitle: launchSubtitle || 'A groundbreaking blueprint for modern execution and personal sovereignty.',
        author: launchAuthor,
        tagline: 'When execution meets conviction, breakthroughs happen.',
        genre: launchGenre,
        coverImage: launchCover || '/book.jpeg',
        launchDate,
        launchDateFormatted,
        launchTimeFormatted,
        location: launchLocation,
        streamUrl: launchStreamUrl,
        trailerUrl: launchTrailerUrl,
        status: launchStatus,
        isFeatured: launches.length === 0,
        inStore: launchPublishToStoreNow,
        quote: launchQuote || 'Deliberate execution creates enduring freedom.',
        pagesCount: parseInt(launchPages) || 350,
        synopsis: synopsisArray,
        formats,
        chapters: [
          { num: 'Chapter 01', title: 'The Blueprint of Execution', desc: 'Laying the foundational cognitive models for consistent action.' },
          { num: 'Chapter 02', title: 'High-Altitude Leverage', desc: 'Maximizing output while reducing friction and noise.' },
          { num: 'Chapter 03', title: 'Calibrating Conviction', desc: 'Maintaining momentum through uncertainty and volatile markets.' }
        ],
        pillars: [
          { number: '01', title: 'Mental Architecture', description: 'Constructing systematic daily operating loops.' },
          { number: '02', title: 'Strategic Leverage', description: 'Aligning resources for maximum asymmetric impact.' }
        ],
        schedule: [
          { id: '1', time: '6:00 PM', activity: 'Virtual Doors Open & Musical Prelude', speaker: '' },
          { id: '2', time: '6:30 PM', activity: `Keynote Address: The Genesis of ${launchTitle}`, speaker: launchAuthor },
          { id: '3', time: '7:30 PM', activity: 'Live Chapter Reading & Global Discussion', speaker: launchAuthor },
          { id: '4', time: '8:30 PM', activity: 'Interactive Audience Q&A Session', speaker: 'Audience Submissions' }
        ],
        speakers: [
          { name: launchAuthor, title: 'Author & Keynote Speaker', bio: 'Founder, strategist, and bestselling author.', initials: 'EJ' }
        ],
        specs: [
          { label: 'Title', value: launchTitle },
          { label: 'Author', value: launchAuthor },
          { label: 'Genre', value: launchGenre },
          { label: 'Publication Date', value: launchDateFormatted },
          { label: 'Pages / Length', value: `${launchPages} Pages` }
        ]
      }

      const updated = addBookLaunch(newLaunch)
      setLaunchesList(updated)

      if (launchPublishToStoreNow) {
        promoteLaunchToStore(newLaunch.id)
        setProductsList(getStoredProducts())
      }
    }

    setShowLaunchModal(false)
    resetLaunchForm()
  }

  const handleDeleteLaunch = (id: string) => {
    if (confirm("Are you sure you want to delete this Book Launch? Its dedicated page will be removed.")) {
      const updated = deleteBookLaunch(id)
      setLaunchesList(updated)
    }
  }

  const handleSetFeaturedLaunch = (id: string) => {
    const updated = launches.map(l => ({ ...l, isFeatured: l.id === id }))
    setStoredLaunches(updated)
    setLaunchesList(updated)
  }

  const handlePromoteToStore = (launchId: string) => {
    const updatedProducts = promoteLaunchToStore(launchId)
    setProductsList(updatedProducts)
    setLaunchesList(getStoredLaunches())
    alert("Success! This book's formats have been published into the live Bookstore catalog.")
  }

  // ==========================================
  // STORE PRODUCTS ACTIONS
  // ==========================================

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProdName || !newProdPrice) return
    const id = newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4)
    const newProduct: Product = {
      id,
      name: newProdName,
      book: newProdName.split('(')[0].trim() || 'Book Title',
      price: parseFloat(newProdPrice),
      description: newProdDesc,
      category: newProdCategory,
      type: newProdType,
      image: newProdImage
    }

    const updated = [...products, newProduct]
    setProductsList(updated)
    setStoredProducts(updated)

    setNewProdName('')
    setNewProdPrice('')
    setNewProdDesc('')
    setNewProdCategory('New Release')
    setNewProdType('digital')
  }

  const handleUpdateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    setProductsList(updated)
    setStoredProducts(updated)
    setEditingProductId(null)
  }

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id)
    setProductsList(updated)
    setStoredProducts(updated)
  }

  // ==========================================
  // SCHEDULE ACTIONS
  // ==========================================

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSchedTime || !newSchedActivity) return
    const newActivity: ScheduleItem = {
      id: Date.now().toString(),
      time: newSchedTime,
      activity: newSchedActivity,
      speaker: newSchedSpeaker
    }

    const updated = [...schedule, newActivity]
    setScheduleList(updated)
    setStoredSchedule(updated)

    setNewSchedTime('')
    setNewSchedActivity('')
    setNewSchedSpeaker('')
  }

  const handleUpdateSchedule = (id: string, updatedFields: Partial<ScheduleItem>) => {
    const updated = schedule.map(s => s.id === id ? { ...s, ...updatedFields } : s)
    setScheduleList(updated)
    setStoredSchedule(updated)
    setEditingScheduleId(null)
  }

  const handleDeleteSchedule = (id: string) => {
    const updated = schedule.filter(s => s.id !== id)
    setScheduleList(updated)
    setStoredSchedule(updated)
  }

  // ==========================================
  // ORDER & MESSAGE ACTIONS
  // ==========================================

  const handleToggleOrderStatus = (orderId: string) => {
    const updated = orders.map(o => {
      if (o.orderId === orderId) {
        return { ...o, status: o.status === 'Completed' ? 'Processing' : 'Completed' }
      }
      return o
    })
    setOrders(updated)
    localStorage.setItem('aurora_orders', JSON.stringify(updated))
  }

  const handleDeleteRSVP = (id: string) => {
    const updated = rsvps.filter(r => r.id !== id)
    setRsvps(updated)
    localStorage.setItem('aurora_rsvps', JSON.stringify(updated))
  }

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id)
    setMessages(updated)
    localStorage.setItem('aurora_messages', JSON.stringify(updated))
  }

  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter(o => o.orderId !== orderId)
    setOrders(updated)
    localStorage.setItem('aurora_orders', JSON.stringify(updated))
  }

  // Seeding mock data
  const handleSeedOrder = () => {
    if (products.length === 0) {
      alert("Store database has no products! Please create or restore products first.")
      return
    }
    const names = ['Clara Sterling', 'Julian Vane', 'Aria Chen', 'Marcus Thorne', 'Serena Blake']
    const emails = ['clara@sterling.com', 'julian@vane.dev', 'aria@chen.io', 'marcus@thorne.net', 'serena@blake.com']
    
    const randomIndex = Math.floor(Math.random() * names.length)
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
    
    const newOrder: Order = {
      orderId,
      customerName: names[randomIndex],
      customerEmail: emails[randomIndex],
      items: [{
        id: randomProduct.id,
        name: randomProduct.name,
        price: randomProduct.price,
        quantity: 1
      }],
      total: randomProduct.price,
      date: new Date().toLocaleDateString(),
      status: randomProduct.type === 'physical' ? 'Processing' : 'Completed'
    }

    const updated = [newOrder, ...orders]
    setOrders(updated)
    localStorage.setItem('aurora_orders', JSON.stringify(updated))
  }

  const handleSeedRSVP = () => {
    if (launches.length === 0) return
    const names = ['Dr. Sarah Jenkins', 'Arthur Pendelton', 'Maya Lin', 'Dimitri Kozlov', 'Naomi Campbell']
    const emails = ['sarah@jenkins.org', 'arthur@pendelton.co.uk', 'maya@lin.design', 'dimitri@kozlov.ru', 'naomi@campbell.com']
    
    const randomLaunch = launches[Math.floor(Math.random() * launches.length)]
    const randomIndex = Math.floor(Math.random() * names.length)
    
    const newRSVP: LaunchRSVP = {
      id: Date.now().toString(),
      launchId: randomLaunch.id,
      launchSlug: randomLaunch.slug,
      launchTitle: randomLaunch.title,
      name: names[randomIndex],
      email: emails[randomIndex],
      date: new Date().toLocaleDateString()
    }

    const updated = [newRSVP, ...rsvps]
    setRsvps(updated)
    localStorage.setItem('aurora_rsvps', JSON.stringify(updated))
  }

  const handleSeedMessage = () => {
    const subjects = ['Keynote Speaker request', 'Bulk order pricing', 'Press Interview proposal', 'Global distribution rights']
    const bodies = [
      'We would love to book Dr. Elvis for our upcoming leadership summit in Geneva next November.',
      'Are there discounts available if we purchase 250 printed copies for our management staff?',
      'I represent a major literary review and would love to schedule a 30-minute virtual podcast interview.',
      'Our publishing house wishes to acquire print licenses for standard distribution in West Africa.'
    ]
    const names = ['Olivia Vance', 'Jonathan Reyes', 'Amara Adebayo', 'Jean-Pierre Laurent']
    const emails = ['olivia@vance.com', 'jonathan@reyes.net', 'amara@adebayo.org', 'jean@laurent.fr']

    const randomIndex = Math.floor(Math.random() * names.length)
    const randomSubIndex = Math.floor(Math.random() * subjects.length)

    const newMessage: Message = {
      id: Date.now().toString(),
      name: names[randomIndex],
      email: emails[randomIndex],
      subject: subjects[randomSubIndex],
      message: bodies[randomSubIndex],
      isBooking: randomSubIndex === 0 || randomSubIndex === 2,
      date: new Date().toLocaleDateString()
    }

    const updated = [newMessage, ...messages]
    setMessages(updated)
    localStorage.setItem('aurora_messages', JSON.stringify(updated))
  }

  const handleResetSystem = () => {
    if (confirm("Are you sure you want to reset all order and RSVP transaction logs?")) {
      localStorage.removeItem('aurora_orders')
      localStorage.removeItem('aurora_rsvps')
      localStorage.removeItem('aurora_messages')
      setOrders([])
      setRsvps([])
      setMessages([])
    }
  }

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter(r => {
    if (selectedLaunchFilter === 'all') return true
    return r.launchSlug === selectedLaunchFilter || r.launchId === selectedLaunchFilter
  })

  return (
    <section id="admin" className="min-h-screen bg-[#f8f5ef] text-[#1d1b18] py-12 selection:bg-[#f1ece3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Operations Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 border-b border-[rgba(80,60,40,0.10)] pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <span className="eyebrow block mb-1">Author Operations Control</span>
            <h1 className="editorial-heading text-3xl sm:text-4xl text-[#1d1b18]">
              Publishing &amp; Launch Command
            </h1>
            <p className="body-text text-xs sm:text-sm text-[#77716a] mt-1">
              Create book launches, manage dedicated launch pages, promote launched titles to the bookstore, and monitor RSVPs.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleResetSystem}
              className="px-4 py-2 border border-destructive/20 text-destructive hover:bg-destructive/5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset Logs
            </button>
            <Link 
              href="/"
              className="editorial-btn-dark py-2 px-5 text-xs font-semibold flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation (3 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="editorial-card p-3 space-y-1 bg-white">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeMenu === item.label
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveMenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#2a211c] text-[#f8f5ef] font-semibold shadow-md'
                        : 'text-[#77716a] hover:bg-[#f1ece3] hover:text-[#1d1b18]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#c79a68]' : ''}`} />
                      <span className="text-xs tracking-wider uppercase font-semibold font-sans">{item.label}</span>
                    </div>
                    {item.label === 'Book Launches' && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-[#c79a68] text-white' : 'bg-[#f1ece3] text-[#1d1b18]'}`}>
                        {launches.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quick Actions & Seeding Sandbox */}
            <div className="editorial-card p-5 space-y-4 bg-white">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#c79a68] flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-3.5 h-3.5" /> Quick Actions
                </h3>
                <p className="text-[10px] text-[#77716a] mt-1">Direct operations &amp; test sandbox.</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleOpenNewLaunchModal}
                  className="editorial-btn-primary w-full py-2.5 text-[11px] font-semibold flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add New Book Launch
                </button>
                <button
                  onClick={handleSeedRSVP}
                  className="w-full py-2 bg-[#f8f5ef] hover:bg-[#f1ece3] border border-[rgba(80,60,40,0.10)] rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#1d1b18] transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
                >
                  <Users className="w-3.5 h-3.5 text-[#c79a68]" /> Seed Mock RSVP
                </button>
                <button
                  onClick={handleSeedOrder}
                  className="w-full py-2 bg-[#f8f5ef] hover:bg-[#f1ece3] border border-[rgba(80,60,40,0.10)] rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#1d1b18] transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#c79a68]" /> Seed Bookstore Sale
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Stage (9 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-9 space-y-8"
          >
            {/* Top Stat Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const StatIcon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="editorial-card p-5 space-y-2 bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] uppercase tracking-wider text-[#77716a] font-bold font-sans">{stat.label}</p>
                      <StatIcon className="w-4 h-4 text-[#c79a68]" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold font-serif text-[#1d1b18]">{stat.value}</p>
                    <div className="text-[9px] text-[#c79a68] font-medium tracking-wide flex items-center gap-1 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c79a68] inline-block animate-pulse" /> {stat.trend}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ============================================================== */}
            {/* TAB: DASHBOARD OVERVIEW */}
            {/* ============================================================== */}
            {activeMenu === 'Dashboard' && (
              <div className="space-y-8">
                {/* Book Launches Showcase in Dashboard */}
                <div className="editorial-card p-6 bg-white space-y-6">
                  <div className="flex justify-between items-center border-b border-[rgba(80,60,40,0.08)] pb-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#1d1b18]">Active Book Launches</h3>
                      <p className="text-xs text-[#77716a]">Dedicated launch rooms and countdown events.</p>
                    </div>
                    <button
                      onClick={handleOpenNewLaunchModal}
                      className="editorial-btn-primary py-1.5 px-4 text-xs font-semibold"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Add Launch
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {launches.map((l) => (
                      <div key={l.id} className="p-4 bg-[#f8f5ef] rounded-2xl border border-[rgba(80,60,40,0.08)] flex gap-4 items-start">
                        <div className="relative w-14 h-20 bg-white rounded overflow-hidden shadow-xs shrink-0 border border-[rgba(80,60,40,0.1)]">
                          <img src={l.coverImage || '/book.jpeg'} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded font-sans ${
                              l.status === 'upcoming' ? 'bg-[#c79a68]/15 text-[#c79a68]' : 'bg-[#2a211c] text-white'
                            }`}>
                              {l.status}
                            </span>
                            {l.isFeatured && (
                              <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-sans">
                                ★ Featured
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif font-bold text-sm text-[#1d1b18] truncate">{l.title}</h4>
                          <p className="text-[10px] text-[#77716a] font-sans">Premiere: {l.launchDateFormatted}</p>
                          
                          <div className="flex items-center gap-3 pt-1 text-xs">
                            <Link href={`/book/${l.slug}`} target="_blank" className="text-[#c79a68] font-semibold hover:underline flex items-center gap-1 text-[11px]">
                              View Page <ExternalLink className="w-3 h-3" />
                            </Link>
                            {!l.inStore && (
                              <button 
                                onClick={() => handlePromoteToStore(l.id)} 
                                className="text-[10px] font-bold uppercase text-[#2a211c] hover:text-[#c79a68] cursor-pointer"
                              >
                                + Add to Store
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders & Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 editorial-card p-6 bg-white space-y-4">
                    <h3 className="font-serif text-lg font-bold text-[#1d1b18]">Recent Sales Activity</h3>
                    {orders.length === 0 ? (
                      <p className="text-xs text-[#77716a] py-6 text-center">No orders recorded yet. Use the sidebar to seed a mock sale.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="text-[10px] uppercase text-[#77716a] font-sans font-bold border-b border-[rgba(80,60,40,0.08)]">
                            <tr>
                              <th className="text-left pb-2">Order ID</th>
                              <th className="text-left pb-2">Customer</th>
                              <th className="text-left pb-2">Amount</th>
                              <th className="text-right pb-2">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[rgba(80,60,40,0.06)]">
                            {orders.slice(0, 5).map(o => (
                              <tr key={o.orderId} className="hover:bg-[#f8f5ef]">
                                <td className="py-2.5 font-mono font-bold text-[#c79a68]">{o.orderId}</td>
                                <td className="py-2.5">{o.customerName}</td>
                                <td className="py-2.5 font-bold font-mono">${o.total.toFixed(2)}</td>
                                <td className="py-2.5 text-right">
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-green-100 text-green-800">
                                    {o.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="editorial-card p-6 bg-white space-y-4">
                    <h3 className="font-serif text-lg font-bold text-[#1d1b18]">Virtual Mainstage</h3>
                    <div className="space-y-3">
                      <button
                        onClick={handleToggleEventMode}
                        className="w-full py-3 bg-[#2a211c] hover:bg-[#c79a68] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {eventMode === 'live' ? 'Stage Mode: Live' : 'Stage Mode: Replay'}
                      </button>
                      <button
                        onClick={() => handleSimulateEmail('1 Day')}
                        className="w-full py-2.5 border border-[rgba(80,60,40,0.15)] hover:bg-[#f8f5ef] text-[#1d1b18] text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 font-sans"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#c79a68]" /> Broadcast RSVP Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: BOOK LAUNCHES MANAGER */}
            {/* ============================================================== */}
            {activeMenu === 'Book Launches' && (
              <div className="space-y-8">
                {/* Header with CTA */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 editorial-card p-6 bg-white">
                  <div>
                    <span className="eyebrow">Multi-Launch Hub</span>
                    <h2 className="editorial-heading text-2xl font-bold text-[#1d1b18]">
                      Book Launches Registry
                    </h2>
                    <p className="body-text text-xs text-[#77716a] mt-0.5">
                      Each launch has its own dedicated customer-facing landing page, countdown timer, event broadcast room, and RSVP registration.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenNewLaunchModal}
                    className="editorial-btn-primary py-2.5 px-5 text-xs font-semibold flex items-center gap-2 shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" /> Create New Book Launch
                  </button>
                </div>

                {/* Launches List */}
                <div className="space-y-4">
                  {launches.map((launch) => (
                    <div 
                      key={launch.id}
                      className="editorial-card p-6 bg-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:border-[#c79a68]/50"
                    >
                      {/* Book Cover + Metadata */}
                      <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
                        <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-[#f1ece3] rounded-lg overflow-hidden shadow-md shrink-0 border border-[rgba(80,60,40,0.1)]">
                          <img src={launch.coverImage || '/book.jpeg'} alt="" className="object-cover w-full h-full" />
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-sans ${
                              launch.status === 'upcoming'
                                ? 'bg-[#c79a68]/15 text-[#c79a68]'
                                : launch.status === 'live'
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-[#2a211c] text-white'
                            }`}>
                              {launch.status}
                            </span>

                            {launch.isFeatured && (
                              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-sans flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" /> Featured on Homepage
                              </span>
                            )}

                            {launch.inStore ? (
                              <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-sans flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" /> In Bookstore
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-[#77716a] bg-[#f8f5ef] px-2 py-0.5 rounded border border-[rgba(80,60,40,0.1)] font-sans">
                                Pre-Launch Exclusive
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1d1b18] leading-tight">
                            {launch.title}
                          </h3>
                          
                          <p className="text-xs text-[#77716a] font-sans">
                            Launch Date: <strong className="text-[#1d1b18]">{launch.launchDateFormatted}</strong> &bull; {launch.launchTimeFormatted}
                          </p>

                          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#77716a] font-sans">
                            <span>Slug: <code className="bg-[#f1ece3] px-1.5 py-0.5 rounded text-[#1d1b18]">/book/{launch.slug}</code></span>
                            <span>&bull;</span>
                            <span>{launch.formats?.length || 0} Formats</span>
                            <span>&bull;</span>
                            <span>{launch.chapters?.length || 0} Chapters</span>
                          </div>
                        </div>
                      </div>

                      {/* Launch Actions */}
                      <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 self-stretch lg:self-auto border-t lg:border-t-0 border-[rgba(80,60,40,0.08)] pt-3 lg:pt-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/book/${launch.slug}`}
                            target="_blank"
                            className="editorial-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1"
                          >
                            <span>View Live Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          <button
                            onClick={() => handleOpenEditLaunchModal(launch)}
                            className="p-2 hover:bg-[#c79a68]/15 text-[#c79a68] rounded-xl transition-colors cursor-pointer"
                            title="Edit Launch Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteLaunch(launch.id)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-xl transition-colors cursor-pointer"
                            title="Delete Launch"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Store Promotion / Set Featured Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          {!launch.isFeatured && (
                            <button
                              onClick={() => handleSetFeaturedLaunch(launch.id)}
                              className="text-[10px] uppercase font-bold text-[#77716a] hover:text-[#1d1b18] underline font-sans cursor-pointer"
                            >
                              Make Featured
                            </button>
                          )}

                          {!launch.inStore ? (
                            <button
                              onClick={() => handlePromoteToStore(launch.id)}
                              className="editorial-btn-primary py-1 px-3 text-[10px] font-bold uppercase tracking-wider font-sans cursor-pointer"
                            >
                              + Publish to Store
                            </button>
                          ) : (
                            <span className="text-[10px] font-semibold text-[#77716a] font-sans">
                              ✓ Published in Catalog
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: STORE MANAGER */}
            {/* ============================================================== */}
            {activeMenu === 'Store Manager' && (
              <div className="space-y-8">
                {/* Add Product Form */}
                <div className="editorial-card p-6 bg-white space-y-6">
                  <div>
                    <span className="eyebrow">Inventory &amp; Formats</span>
                    <h3 className="editorial-heading text-2xl font-bold text-[#1d1b18]">Add Store Book / Edition</h3>
                    <p className="body-text text-xs text-[#77716a] mt-0.5">Add standalone store products or individual physical/digital formats.</p>
                  </div>

                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">Book Title</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. The Weight of Quiet Hearts"
                        value={newProdName} 
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">Format Edition</label>
                      <select
                        onChange={(e) => {
                          const fmt = e.target.value
                          if (fmt === 'audio') {
                            setNewProdType('digital')
                            if (!newProdPrice) setNewProdPrice('14.99')
                            if (!newProdDesc) setNewProdDesc('High-definition audiobook narration with bonus guides.')
                            setNewProdCategory('Audio Edition')
                          } else if (fmt === 'ebook') {
                            setNewProdType('digital')
                            if (!newProdPrice) setNewProdPrice('9.99')
                            if (!newProdDesc) setNewProdDesc('Instant PDF/EPUB download. Read on Kindle, iPad, or mobile.')
                            setNewProdCategory('Digital Edition')
                          } else if (fmt === 'paperback') {
                            setNewProdType('physical')
                            if (!newProdPrice) setNewProdPrice('19.99')
                            if (!newProdDesc) setNewProdDesc('Beautifully printed softcover delivered worldwide.')
                            setNewProdCategory('Print Edition')
                          } else if (fmt === 'hardcover') {
                            setNewProdType('physical')
                            if (!newProdPrice) setNewProdPrice('29.99')
                            if (!newProdDesc) setNewProdDesc('Deluxe gold-foil collector hardcover volume.')
                            setNewProdCategory('Collector Edition')
                          }
                        }}
                        className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      >
                        <option value="audio">Masterclass Audiobook (Digital)</option>
                        <option value="ebook">Instant eBook - EPUB/PDF (Digital)</option>
                        <option value="paperback">Deluxe Paperback (Physical)</option>
                        <option value="hardcover">Collector Hardcover (Physical)</option>
                        <option value="custom">Custom Format</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">Price (USD)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        required 
                        placeholder="14.99"
                        value={newProdPrice} 
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">Delivery Type</label>
                      <select
                        value={newProdType}
                        onChange={(e) => setNewProdType(e.target.value as 'digital' | 'physical')}
                        className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      >
                        <option value="digital">Digital (Instant download delivery)</option>
                        <option value="physical">Physical (Requires shipping address)</option>
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">Format Description</label>
                      <input 
                        type="text" 
                        placeholder="High-definition audio narration with companion guides."
                        value={newProdDesc} 
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">Category Tag</label>
                      <input 
                        type="text" 
                        placeholder="New Release / Audio Edition / Bestseller"
                        value={newProdCategory} 
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>
                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="editorial-btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" /> Save Format Edition to Bookstore
                      </button>
                    </div>
                  </form>
                </div>

                {/* Active Store Catalog */}
                <div className="editorial-card p-6 bg-white space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#1d1b18]">Active Bookstore Products ({products.length})</h3>
                  
                  <div className="space-y-3">
                    {products.map((p, index) => (
                      <div key={`${p.id}-${index}`} className="p-4 rounded-xl border border-[rgba(80,60,40,0.08)] bg-[#f8f5ef] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {editingProductId === p.id ? (
                          <div className="w-full space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                value={p.name} 
                                onChange={(e) => handleUpdateProduct(p.id, { name: e.target.value })}
                                className="px-3 py-1.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-lg text-xs"
                              />
                              <input 
                                type="number" 
                                step="0.01"
                                value={p.price} 
                                onChange={(e) => handleUpdateProduct(p.id, { price: parseFloat(e.target.value) || 0 })}
                                className="px-3 py-1.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-lg text-xs font-mono"
                              />
                            </div>
                            <input 
                              type="text" 
                              value={p.description} 
                              onChange={(e) => handleUpdateProduct(p.id, { description: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white border border-[rgba(80,60,40,0.15)] rounded-lg text-xs"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => setEditingProductId(null)} className="px-3 py-1 bg-destructive/10 text-destructive rounded-lg text-[10px] font-bold uppercase tracking-wider font-sans">Cancel</button>
                              <button onClick={() => setEditingProductId(null)} className="px-3 py-1 bg-[#2a211c] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider font-sans">Done</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-14 bg-white rounded-md overflow-hidden border border-[rgba(80,60,40,0.1)] shrink-0">
                                <img src={p.image} className="object-cover w-full h-full" alt="" />
                              </div>
                              <div>
                                <h4 className="font-serif font-bold text-sm text-[#1d1b18]">{p.name}</h4>
                                <p className="text-[11px] text-[#77716a] mt-0.5 line-clamp-1">{p.description}</p>
                                <div className="flex gap-2 mt-1.5">
                                  <span className="text-[9px] uppercase px-2 py-0.5 bg-[#f1ece3] text-[#1d1b18] font-bold rounded font-sans">{p.type}</span>
                                  <span className="text-[9px] uppercase px-2 py-0.5 bg-[#c79a68]/15 text-[#c79a68] font-bold rounded font-sans">{p.category}</span>
                                  {p.launchId && (
                                    <span className="text-[9px] uppercase px-2 py-0.5 bg-[#2a211c]/10 text-[#2a211c] font-bold rounded font-sans">Linked to Launch</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 self-end md:self-auto">
                              <span className="font-serif font-bold text-base text-[#1d1b18]">${p.price.toFixed(2)}</span>
                              <div className="flex gap-2">
                                <button onClick={() => setEditingProductId(p.id)} className="p-1.5 hover:bg-[#c79a68]/15 text-[#c79a68] rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: REGISTRATIONS / RSVPS */}
            {/* ============================================================== */}
            {activeMenu === 'Registrations' && (
              <div className="editorial-card p-6 bg-white space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(80,60,40,0.08)] pb-4">
                  <div>
                    <span className="eyebrow">Virtual Audience Manifest</span>
                    <h2 className="editorial-heading text-2xl font-bold text-[#1d1b18]">
                      RSVP Registrations ({filteredRsvps.length})
                    </h2>
                  </div>

                  {/* Filter by launch */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Filter Launch:</span>
                    <select
                      value={selectedLaunchFilter}
                      onChange={(e) => setSelectedLaunchFilter(e.target.value)}
                      className="px-3 py-1.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-lg text-xs font-sans text-[#1d1b18]"
                    >
                      <option value="all">All Launches</option>
                      {launches.map((l) => (
                        <option key={l.id} value={l.slug}>{l.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {filteredRsvps.length === 0 ? (
                  <div className="py-12 text-center text-[#77716a] text-xs">
                    No registrations found for this filter. Use the sidebar to seed mock RSVPs.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="text-[10px] uppercase text-[#77716a] font-sans font-bold border-b border-[rgba(80,60,40,0.08)]">
                        <tr>
                          <th className="text-left pb-3">Registrant Name</th>
                          <th className="text-left pb-3">Email Address</th>
                          <th className="text-left pb-3">Target Book Launch</th>
                          <th className="text-left pb-3">Date</th>
                          <th className="text-right pb-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(80,60,40,0.06)]">
                        {filteredRsvps.map((rsvp) => (
                          <tr key={rsvp.id} className="hover:bg-[#f8f5ef]">
                            <td className="py-3 font-semibold text-[#1d1b18]">{rsvp.name}</td>
                            <td className="py-3 text-[#77716a]">{rsvp.email}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded bg-[#c79a68]/15 text-[#c79a68] font-bold text-[10px] font-sans">
                                {rsvp.launchTitle || 'The Weight of Quiet Hearts'}
                              </span>
                            </td>
                            <td className="py-3 text-[#77716a]">{rsvp.date}</td>
                            <td className="py-3 text-right">
                              <button onClick={() => handleDeleteRSVP(rsvp.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: ORDERS */}
            {/* ============================================================== */}
            {activeMenu === 'Orders' && (
              <div className="editorial-card p-6 bg-white space-y-6">
                <div className="border-b border-[rgba(80,60,40,0.08)] pb-4">
                  <span className="eyebrow">Sales Ledger</span>
                  <h2 className="editorial-heading text-2xl font-bold text-[#1d1b18]">
                    Customer Orders Registry ({orders.length})
                  </h2>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-[#77716a] text-xs">
                    No customer orders logged yet. Seed a mock purchase to test.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="text-[10px] uppercase text-[#77716a] font-sans font-bold border-b border-[rgba(80,60,40,0.08)]">
                        <tr>
                          <th className="text-left pb-3">Order Ref</th>
                          <th className="text-left pb-3">Customer</th>
                          <th className="text-left pb-3">Items Purchased</th>
                          <th className="text-left pb-3">Total</th>
                          <th className="text-left pb-3">Status</th>
                          <th className="text-right pb-3">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(80,60,40,0.06)]">
                        {orders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-[#f8f5ef]">
                            <td className="py-3 font-mono font-bold text-[#c79a68]">{order.orderId}</td>
                            <td className="py-3">
                              <div className="font-bold text-[#1d1b18]">{order.customerName}</div>
                              <div className="text-[10px] text-[#77716a]">{order.customerEmail}</div>
                            </td>
                            <td className="py-3 text-[11px]">
                              {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                            </td>
                            <td className="py-3 font-mono font-bold text-[#1d1b18]">${order.total.toFixed(2)}</td>
                            <td className="py-3">
                              <button
                                onClick={() => handleToggleOrderStatus(order.orderId)}
                                className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-sans cursor-pointer ${
                                  order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {order.status}
                              </button>
                            </td>
                            <td className="py-3 text-right">
                              <button onClick={() => handleDeleteOrder(order.orderId)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: EVENT SCHEDULE */}
            {/* ============================================================== */}
            {activeMenu === 'Event Schedule' && (
              <div className="space-y-8">
                <div className="editorial-card p-6 bg-white space-y-6">
                  <div>
                    <span className="eyebrow">Program Management</span>
                    <h3 className="editorial-heading text-2xl font-bold text-[#1d1b18]">Add Event Schedule Timeline Item</h3>
                  </div>

                  <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">Start Time</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. 7:00 PM"
                        value={newSchedTime} 
                        onChange={(e) => setNewSchedTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">Activity / Segment Title</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Live Digital Reading & Keynote"
                        value={newSchedActivity} 
                        onChange={(e) => setNewSchedActivity(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-3">
                      <label className="text-[10px] uppercase font-bold text-[#77716a] tracking-wider font-sans">Presenter / Host</label>
                      <input 
                        type="text" 
                        placeholder="Dr. Elvis Justice Bedi"
                        value={newSchedSpeaker} 
                        onChange={(e) => setNewSchedSpeaker(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                      />
                    </div>
                    <div className="md:col-span-3 pt-2">
                      <button
                        type="submit"
                        className="editorial-btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 font-sans"
                      >
                        <PlusCircle className="w-4 h-4" /> Add Activity to Program
                      </button>
                    </div>
                  </form>
                </div>

                <div className="editorial-card p-6 bg-white space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#1d1b18]">Active Timeline Items</h3>
                  <div className="space-y-3">
                    {schedule.map((s) => (
                      <div key={s.id} className="p-4 rounded-xl border border-[rgba(80,60,40,0.08)] bg-[#f8f5ef] flex justify-between items-center gap-4">
                        <div>
                          <span className="text-xs font-mono font-bold text-[#c79a68]">{s.time}</span>
                          <h4 className="font-serif font-bold text-sm text-[#1d1b18] mt-0.5">{s.activity}</h4>
                          {s.speaker && <p className="text-[10px] text-[#77716a] font-sans">Speaker: {s.speaker}</p>}
                        </div>
                        <button onClick={() => handleDeleteSchedule(s.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: MESSAGES */}
            {/* ============================================================== */}
            {activeMenu === 'Messages' && (
              <div className="editorial-card p-6 bg-white space-y-6">
                <div className="border-b border-[rgba(80,60,40,0.08)] pb-4">
                  <span className="eyebrow">Communications</span>
                  <h2 className="editorial-heading text-2xl font-bold text-[#1d1b18]">
                    Inbound Inquiries ({messages.length})
                  </h2>
                </div>

                {messages.length === 0 ? (
                  <div className="py-12 text-center text-[#77716a] text-xs">
                    No communication records. Seed an inquiry from the sidebar.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="p-5 border border-[rgba(80,60,40,0.08)] rounded-2xl bg-[#f8f5ef] space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif font-bold text-base text-[#1d1b18]">{msg.subject}</h4>
                            <p className="text-[11px] text-[#c79a68] font-semibold mt-0.5 font-sans">From: {msg.name} ({msg.email}) &bull; {msg.date}</p>
                          </div>
                          <button onClick={() => handleDeleteMessage(msg.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-[#1d1b18] leading-relaxed bg-white p-4 rounded-xl border border-[rgba(80,60,40,0.06)] font-serif italic">
                          &ldquo;{msg.message}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL / DRAWER: CREATE OR EDIT BOOK LAUNCH */}
      {/* ============================================================== */}
      <AnimatePresence>
        {showLaunchModal && (
          <div className="fixed inset-0 z-50 bg-[#1d1b18]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[rgba(80,60,40,0.12)] space-y-6"
            >
              <div className="flex justify-between items-center border-b border-[rgba(80,60,40,0.08)] pb-4">
                <div>
                  <span className="eyebrow">{editingLaunchId ? 'Edit Configuration' : 'New Book Launch'}</span>
                  <h3 className="font-serif text-2xl font-bold text-[#1d1b18]">
                    {editingLaunchId ? 'Update Book Launch' : 'Create New Book Launch'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowLaunchModal(false)}
                  className="p-2 hover:bg-[#f8f5ef] rounded-full text-[#77716a] hover:text-[#1d1b18]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLaunchSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Book Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Architecture of High Conviction"
                      value={launchTitle}
                      onChange={(e) => setLaunchTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Subtitle / Tagline</label>
                    <input
                      type="text"
                      placeholder="A manual of strategic mindset, daily discipline, and sovereign execution."
                      value={launchSubtitle}
                      onChange={(e) => setLaunchSubtitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">URL Slug (e.g. /book/[slug])</label>
                    <input
                      type="text"
                      placeholder="auto-generated from title"
                      value={launchSlug}
                      onChange={(e) => setLaunchSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Author Name</label>
                    <input
                      type="text"
                      value={launchAuthor}
                      onChange={(e) => setLaunchAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Genre / Category</label>
                    <input
                      type="text"
                      value={launchGenre}
                      onChange={(e) => setLaunchGenre(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Cover Image URL</label>
                    <input
                      type="text"
                      value={launchCover}
                      onChange={(e) => setLaunchCover(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Launch Date &amp; Time (ISO)</label>
                    <input
                      type="text"
                      value={launchDate}
                      onChange={(e) => setLaunchDate(e.target.value)}
                      placeholder="2026-08-20T18:00:00"
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Formatted Date (Display)</label>
                    <input
                      type="text"
                      value={launchDateFormatted}
                      onChange={(e) => setLaunchDateFormatted(e.target.value)}
                      placeholder="August 20, 2026"
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Formatted Time (Display)</label>
                    <input
                      type="text"
                      value={launchTimeFormatted}
                      onChange={(e) => setLaunchTimeFormatted(e.target.value)}
                      placeholder="6:00 PM – 9:00 PM EST"
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Launch Status</label>
                    <select
                      value={launchStatus}
                      onChange={(e) => setLaunchStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    >
                      <option value="upcoming">Upcoming (Pre-Launch &amp; Countdown)</option>
                      <option value="live">Live Now (Broadcasting)</option>
                      <option value="completed">Completed (Recorded Replay Available)</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-[#77716a] font-sans">Synopsis (Separate paragraphs with double enter)</label>
                    <textarea
                      rows={3}
                      value={launchSynopsis}
                      onChange={(e) => setLaunchSynopsis(e.target.value)}
                      placeholder="A comprehensive breakdown of the book's core philosophy and reader takeaways..."
                      className="w-full px-3.5 py-2.5 bg-[#f8f5ef] border border-[rgba(80,60,40,0.12)] rounded-xl text-xs focus:outline-none focus:border-[#c79a68] text-[#1d1b18]"
                    />
                  </div>

                  {/* Selectable Format Matrix */}
                  <div className="sm:col-span-2 border-t border-[rgba(80,60,40,0.08)] pt-3 space-y-3">
                    <div>
                      <span className="text-xs font-bold text-[#1d1b18] font-serif block">Select Available Format(s) &amp; Pricing</span>
                      <p className="text-[11px] text-[#77716a] font-sans mt-0.5">Select only the format edition you want to offer (e.g. Audiobook only), or combine multiple.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Audiobook */}
                      <div className={`p-3 rounded-xl border transition-all ${enableAudio ? 'bg-[#f8f5ef] border-[#c79a68]' : 'bg-white border-[rgba(80,60,40,0.1)] opacity-75'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={enableAudio} 
                              onChange={(e) => setEnableAudio(e.target.checked)} 
                              className="w-4 h-4 text-[#c79a68] rounded cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#1d1b18] font-sans">Masterclass Audiobook</span>
                          </label>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#c79a68]/15 text-[#c79a68] font-bold rounded font-sans">Digital</span>
                        </div>
                        {enableAudio && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] text-[#77716a] font-sans">Price ($):</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={launchAudioPrice} 
                              onChange={(e) => setLaunchAudioPrice(e.target.value)} 
                              className="w-24 px-2 py-1 bg-white border border-[rgba(80,60,40,0.15)] rounded-lg text-xs font-mono font-bold text-[#1d1b18]" 
                            />
                          </div>
                        )}
                      </div>

                      {/* eBook */}
                      <div className={`p-3 rounded-xl border transition-all ${enableEbook ? 'bg-[#f8f5ef] border-[#c79a68]' : 'bg-white border-[rgba(80,60,40,0.1)] opacity-75'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={enableEbook} 
                              onChange={(e) => setEnableEbook(e.target.checked)} 
                              className="w-4 h-4 text-[#c79a68] rounded cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#1d1b18] font-sans">Instant eBook (PDF/EPUB)</span>
                          </label>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#c79a68]/15 text-[#c79a68] font-bold rounded font-sans">Digital</span>
                        </div>
                        {enableEbook && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] text-[#77716a] font-sans">Price ($):</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={launchEbookPrice} 
                              onChange={(e) => setLaunchEbookPrice(e.target.value)} 
                              className="w-24 px-2 py-1 bg-white border border-[rgba(80,60,40,0.15)] rounded-lg text-xs font-mono font-bold text-[#1d1b18]" 
                            />
                          </div>
                        )}
                      </div>

                      {/* Paperback */}
                      <div className={`p-3 rounded-xl border transition-all ${enablePaperback ? 'bg-[#f8f5ef] border-[#c79a68]' : 'bg-white border-[rgba(80,60,40,0.1)] opacity-75'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={enablePaperback} 
                              onChange={(e) => setEnablePaperback(e.target.checked)} 
                              className="w-4 h-4 text-[#c79a68] rounded cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#1d1b18] font-sans">Deluxe Paperback Edition</span>
                          </label>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#f1ece3] text-[#1d1b18] font-bold rounded font-sans">Physical</span>
                        </div>
                        {enablePaperback && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] text-[#77716a] font-sans">Price ($):</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={launchPaperbackPrice} 
                              onChange={(e) => setLaunchPaperbackPrice(e.target.value)} 
                              className="w-24 px-2 py-1 bg-white border border-[rgba(80,60,40,0.15)] rounded-lg text-xs font-mono font-bold text-[#1d1b18]" 
                            />
                          </div>
                        )}
                      </div>

                      {/* Hardcover */}
                      <div className={`p-3 rounded-xl border transition-all ${enableHardcover ? 'bg-[#f8f5ef] border-[#c79a68]' : 'bg-white border-[rgba(80,60,40,0.1)] opacity-75'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={enableHardcover} 
                              onChange={(e) => setEnableHardcover(e.target.checked)} 
                              className="w-4 h-4 text-[#c79a68] rounded cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#1d1b18] font-sans">Collector Hardcover Edition</span>
                          </label>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#f1ece3] text-[#1d1b18] font-bold rounded font-sans">Physical</span>
                        </div>
                        {enableHardcover && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] text-[#77716a] font-sans">Price ($):</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={launchHardcoverPrice} 
                              onChange={(e) => setLaunchHardcoverPrice(e.target.value)} 
                              className="w-24 px-2 py-1 bg-white border border-[rgba(80,60,40,0.15)] rounded-lg text-xs font-mono font-bold text-[#1d1b18]" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Publish to store toggle */}
                  <div className="sm:col-span-2 flex items-center gap-3 p-3.5 bg-[#f1ece3] rounded-xl border border-[rgba(80,60,40,0.08)]">
                    <input
                      type="checkbox"
                      id="publishStoreNow"
                      checked={launchPublishToStoreNow}
                      onChange={(e) => setLaunchPublishToStoreNow(e.target.checked)}
                      className="w-4 h-4 text-[#c79a68] rounded cursor-pointer"
                    />
                    <label htmlFor="publishStoreNow" className="text-xs font-semibold text-[#1d1b18] cursor-pointer font-sans">
                      Publish these formats to the official Bookstore catalog now
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[rgba(80,60,40,0.08)]">
                  <button
                    type="button"
                    onClick={() => setShowLaunchModal(false)}
                    className="flex-1 py-3 border border-[rgba(80,60,40,0.2)] rounded-full text-xs font-semibold text-[#1d1b18] hover:bg-[#f8f5ef] cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="editorial-btn-primary flex-1 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {editingLaunchId ? 'Save Changes' : 'Create Book Launch'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
