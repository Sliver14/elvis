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
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  getStoredProducts, 
  setStoredProducts, 
  getStoredSchedule, 
  setStoredSchedule, 
  Product, 
  ScheduleItem 
} from '@/lib/data-store'

const menuItems = [
  { icon: BarChart3, label: 'Dashboard' },
  { icon: ShoppingCart, label: 'Orders' },
  { icon: Users, label: 'Registrations' },
  { icon: Mail, label: 'Messages' },
  { icon: BookOpen, label: 'Store Manager' },
  { icon: Calendar, label: 'Event Schedule' },
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

interface RSVP {
  id: string
  name: string
  email: string
  date: string
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
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [eventMode, setEventMode] = useState('live')
  
  // Custom Dynamic products & schedule state
  const [products, setProductsList] = useState<Product[]>([])
  const [schedule, setScheduleList] = useState<ScheduleItem[]>([])

  // Edit states
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)

  // Product Form states
  const [newProdName, setNewProdName] = useState('')
  const [newProdPrice, setNewProdPrice] = useState('')
  const [newProdDesc, setNewProdDesc] = useState('')
  const [newProdCategory, setNewProdCategory] = useState('New Release')
  const [newProdType, setNewProdType] = useState<'digital' | 'physical'>('digital')
  const [newProdImage, setNewProdImage] = useState('/book.jpeg')

  // Schedule Form states
  const [newSchedTime, setNewSchedTime] = useState('')
  const [newSchedActivity, setNewSchedActivity] = useState('')
  const [newSchedSpeaker, setNewSchedSpeaker] = useState('')

  // Load database values
  const loadData = () => {
    const savedOrders = JSON.parse(localStorage.getItem('aurora_orders') || '[]')
    const savedRSVPs = JSON.parse(localStorage.getItem('aurora_rsvps') || '[]')
    const savedMessages = JSON.parse(localStorage.getItem('aurora_messages') || '[]')
    const savedEventMode = localStorage.getItem('aurora_event_mode') || 'live'
    
    setOrders(savedOrders)
    setRsvps(savedRSVPs)
    setMessages(savedMessages)
    setEventMode(savedEventMode)
    setProductsList(getStoredProducts())
    setScheduleList(getStoredSchedule())
  }

  useEffect(() => {
    loadData()
  }, [])

  // Dynamic statistics
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrdersCount = orders.length
  const totalRsvpCount = rsvps.length
  const totalMessagesCount = messages.length

  const stats = [
    { label: 'Total Revenue', value: `$${totalSales.toFixed(2)}`, icon: TrendingUp, trend: '+14.2% projected' },
    { label: 'Books Ordered', value: String(totalOrdersCount), icon: ShoppingCart, trend: 'All channels synced' },
    { label: 'Event RSVPs', value: String(totalRsvpCount), icon: Users, trend: 'Global attendance' },
    { label: 'Active Inquiries', value: String(totalMessagesCount), icon: Mail, trend: 'Needs review' },
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
    alert(`[Campaign Dispatch Simulation] Successfully triggered the "${type} before launch" automated reminder email sequence to all ${rsvps.length} registered RSVP addresses.`)
  }

  // Seeders
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
    const names = ['Dr. Sarah Jenkins', 'Arthur Pendelton', 'Maya Lin', 'Dimitri Kozlov', 'Naomi Campbell']
    const emails = ['sarah@jenkins.org', 'arthur@pendelton.co.uk', 'maya@lin.design', 'dimitri@kozlov.ru', 'naomi@campbell.com']
    
    const randomIndex = Math.floor(Math.random() * names.length)
    const newRSVP: RSVP = {
      id: Date.now().toString(),
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

  // Order status
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

  // Deletions
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

  // Product Add/Edit Actions
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProdName || !newProdPrice) return
    const id = newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4)
    const newProduct: Product = {
      id,
      name: newProdName,
      book: 'JUST ELVIS JUSTICE',
      price: parseFloat(newProdPrice),
      description: newProdDesc,
      category: newProdCategory,
      type: newProdType,
      image: newProdImage
    }

    const updated = [...products, newProduct]
    setProductsList(updated)
    setStoredProducts(updated)

    // Reset Form
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

  // Schedule Add/Edit Actions
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

    // Reset Form
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

  // System Reset
  const handleResetSystem = () => {
    if (confirm("Are you sure you want to clear all transactions, RSVPs, and communications database? This will reset all metrics to zero.")) {
      localStorage.removeItem('aurora_orders')
      localStorage.removeItem('aurora_rsvps')
      localStorage.removeItem('aurora_messages')
      setOrders([])
      setRsvps([])
      setMessages([])
    }
  }

  return (
    <section id="admin" className="min-h-screen bg-[#fbf9f6] text-[#2b221a] py-12 selection:bg-[#eae0d0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Operations Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 border-b border-[#2b221a]/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#bda06d] block mb-2">Dr. Elvis Justice Bedi</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-none uppercase">
              Operations Control
            </h1>
            <p className="text-sm text-[#2b221a]/60 mt-2 font-sans font-light">Add books, edit event schedules, manage store products, and review logs.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleResetSystem}
              className="px-4 py-2 border border-destructive/20 text-destructive hover:bg-destructive/5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset Logs
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-5 py-2 bg-[#2b221a] text-white hover:bg-[#bda06d] rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Return to Site
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="rounded-2xl border border-[#2b221a]/5 bg-white p-4 space-y-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveMenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all text-left cursor-pointer ${
                      activeMenu === item.label
                        ? 'bg-[#2b221a] text-white font-semibold shadow-lg shadow-[#2b221a]/10'
                        : 'text-[#2b221a]/70 hover:bg-[#fbf9f6] hover:text-[#2b221a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs tracking-wider uppercase font-bold">{item.label}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Sandbox Seeding Controls */}
            {activeMenu === 'Dashboard' && (
              <div className="rounded-2xl border border-[#2b221a]/5 bg-white p-6 space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#bda06d] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Seeding Sandbox
                  </h3>
                  <p className="text-[10px] text-[#2b221a]/50 mt-1">Inject mock logs into database buffers to test system widgets.</p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleSeedOrder}
                    className="w-full py-2 bg-gradient-to-r from-[#2b221a]/5 to-transparent hover:from-[#bda06d]/10 border border-[#2b221a]/5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#2b221a] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#bda06d]" /> Seed Mock Sale
                  </button>
                  <button
                    onClick={handleSeedRSVP}
                    className="w-full py-2 bg-gradient-to-r from-[#2b221a]/5 to-transparent hover:from-[#bda06d]/10 border border-[#2b221a]/5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#2b221a] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#bda06d]" /> Seed RSVP Registrant
                  </button>
                  <button
                    onClick={handleSeedMessage}
                    className="w-full py-2 bg-gradient-to-r from-[#2b221a]/5 to-transparent hover:from-[#bda06d]/10 border border-[#2b221a]/5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#2b221a] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#bda06d]" /> Seed Inquiry Message
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Operations Stage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-9 space-y-8"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-[#2b221a]/5 bg-white p-5 space-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] uppercase tracking-wider text-[#2b221a]/50 font-bold">{stat.label}</p>
                      <StatIcon className="w-4 h-4 text-[#bda06d]" />
                    </div>
                    <p className="text-2xl font-bold font-mono tracking-tight text-[#2b221a]">{stat.value}</p>
                    <div className="text-[9px] text-[#bda06d] font-medium tracking-wide flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#bda06d] inline-block animate-pulse" /> {stat.trend}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Dashboard tab */}
            {activeMenu === 'Dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="rounded-2xl border border-[#2b221a]/5 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
                    <div className="flex justify-between items-center border-b border-[#2b221a]/5 pb-4">
                      <div>
                        <h3 className="text-sm uppercase tracking-wider font-bold text-[#2b221a]">Launch Revenue Matrix</h3>
                        <p className="text-[10px] text-[#2b221a]/50 font-light">Pre-sales logs and virtual bundle analytics.</p>
                      </div>
                      <span className="text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 bg-[#bda06d]/15 text-[#bda06d] rounded-full">Simulated Trend</span>
                    </div>

                    <div className="h-44 w-full relative pt-4">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#bda06d" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#bda06d" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="120" x2="500" y2="120" stroke="#2b221a" strokeOpacity="0.05" strokeDasharray="4" />
                        <line x1="0" y1="70" x2="500" y2="70" stroke="#2b221a" strokeOpacity="0.05" strokeDasharray="4" />
                        <line x1="0" y1="20" x2="500" y2="20" stroke="#2b221a" strokeOpacity="0.05" strokeDasharray="4" />
                        
                        <path d="M0,130 Q100,110 200,90 T400,40 T500,20 L500,150 L0,150 Z" fill="url(#chartGrad)" />
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          d="M0,130 Q100,110 200,90 T400,40 T500,20" 
                          fill="transparent" 
                          stroke="#bda06d" 
                          strokeWidth="3" 
                        />
                        <circle cx="500" cy="20" r="5" fill="#2b221a" stroke="#bda06d" strokeWidth="2" />
                      </svg>
                      <div className="absolute top-1 right-2 text-[10px] font-mono font-bold text-[#bda06d]">
                        ${totalSales.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#2b221a]/5 bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="p-6 border-b border-[#2b221a]/5 bg-white">
                      <h2 className="text-xs uppercase tracking-wider font-bold text-[#2b221a]">Recent Activity Log</h2>
                    </div>
                    {orders.length === 0 ? (
                      <div className="p-12 text-center text-[#2b221a]/40 text-xs font-light">No orders recorded yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#fbf9f6] border-b border-[#2b221a]/5 text-left text-[10px] uppercase text-[#2b221a]/50 font-bold">
                            <tr>
                              <th className="px-6 py-4">Order ID</th>
                              <th className="px-6 py-4">Customer</th>
                              <th className="px-6 py-4">Book Specs</th>
                              <th className="px-6 py-4 text-right">Fulfillment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2b221a]/5 text-xs text-[#2b221a]/80">
                            {orders.slice(0, 5).map((order) => (
                              <tr key={order.orderId} className="hover:bg-[#fbf9f6]/40 transition-colors">
                                <td className="px-6 py-4 font-mono text-[11px] font-bold text-[#bda06d]">{order.orderId}</td>
                                <td className="px-6 py-4">
                                  <div className="font-bold text-[#2b221a]">{order.customerName}</div>
                                  <div className="text-[10px] text-[#2b221a]/50 font-light mt-0.5">{order.customerEmail}</div>
                                </td>
                                <td className="px-6 py-4 text-[10px] max-w-xs truncate">
                                  {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleToggleOrderStatus(order.orderId)}
                                    className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                                      order.status === 'Completed' 
                                        ? 'bg-green-50 text-green-700' 
                                        : 'bg-amber-50 text-amber-700'
                                    }`}
                                  >
                                    {order.status}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <div className="rounded-2xl border border-[#2b221a]/5 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-[#bda06d]">Broadcast Control</h3>
                    <button
                      onClick={handleToggleEventMode}
                      className="w-full py-3 bg-[#2b221a] hover:bg-[#bda06d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {eventMode === 'live' ? 'Virtual Stage Live' : 'Recorded Replay'}
                    </button>
                  </div>

                  <div className="rounded-2xl border border-[#2b221a]/5 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-[#bda06d]">RSVP Notifications</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSimulateEmail('1 Week')}
                        className="w-full py-2.5 border border-[#2b221a]/10 hover:bg-[#fbf9f6] text-[#2b221a] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-left px-4 flex items-center justify-between"
                      >
                        <span>1 Week Out</span>
                        <RefreshCw className="w-3.5 h-3.5 text-[#bda06d]" />
                      </button>
                      <button
                        onClick={() => handleSimulateEmail('1 Hour')}
                        className="w-full py-2.5 border border-[#2b221a]/10 hover:bg-[#fbf9f6] text-[#2b221a] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-left px-4 flex items-center justify-between"
                      >
                        <span>1 Hour Out</span>
                        <RefreshCw className="w-3.5 h-3.5 text-[#bda06d]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders list */}
            {activeMenu === 'Orders' && (
              <div className="rounded-2xl border border-[#2b221a]/5 bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="p-6 border-b border-[#2b221a]/5 bg-white">
                  <h2 className="text-xs uppercase tracking-wider font-bold text-[#2b221a]">Comprehensive Sales Registry</h2>
                </div>
                {orders.length === 0 ? (
                  <div className="p-12 text-center text-[#2b221a]/40 text-xs font-light">No orders registered yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#fbf9f6] border-b border-[#2b221a]/5 text-left text-[10px] uppercase text-[#2b221a]/50 font-bold">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer Details</th>
                          <th className="px-6 py-4">Items</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Fulfillment</th>
                          <th className="px-6 py-4 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2b221a]/5 text-xs text-[#2b221a]/80">
                        {orders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-[#fbf9f6]/40 transition-colors">
                            <td className="px-6 py-4 font-mono text-[11px] font-bold text-[#bda06d]">{order.orderId}</td>
                            <td className="px-6 py-4">
                              <div className="font-bold">{order.customerName}</div>
                              <div className="text-[10px] text-[#2b221a]/50 font-light">{order.customerEmail}</div>
                            </td>
                            <td className="px-6 py-4 text-[10px] max-w-xs truncate">
                              {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                            </td>
                            <td className="px-6 py-4 font-bold font-mono">${order.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleToggleOrderStatus(order.orderId)}
                                className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                                  order.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {order.status}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDeleteOrder(order.orderId)} className="text-destructive hover:bg-destructive/5 p-1 rounded">
                                <Trash2 className="w-4 h-4" />
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

            {/* Registrations list */}
            {activeMenu === 'Registrations' && (
              <div className="rounded-2xl border border-[#2b221a]/5 bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="p-6 border-b border-[#2b221a]/5 bg-white">
                  <h2 className="text-xs uppercase tracking-wider font-bold text-[#2b221a]">RSVP Event Manifest</h2>
                </div>
                {rsvps.length === 0 ? (
                  <div className="p-12 text-center text-[#2b221a]/40 text-xs font-light">No registrants found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#fbf9f6] border-b border-[#2b221a]/5 text-left text-[10px] uppercase text-[#2b221a]/50 font-bold">
                        <tr>
                          <th className="px-6 py-4">Registrant Name</th>
                          <th className="px-6 py-4">Secure Email Address</th>
                          <th className="px-6 py-4 text-right">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2b221a]/5 text-xs text-[#2b221a]/80">
                        {rsvps.map((rsvp) => (
                          <tr key={rsvp.id} className="hover:bg-[#fbf9f6]/40 transition-colors">
                            <td className="px-6 py-4 font-bold">{rsvp.name}</td>
                            <td className="px-6 py-4">{rsvp.email}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDeleteRSVP(rsvp.id)} className="text-destructive hover:bg-destructive/5 p-1 rounded">
                                <Trash2 className="w-4 h-4" />
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

            {/* Messages list */}
            {activeMenu === 'Messages' && (
              <div className="rounded-2xl border border-[#2b221a]/5 bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="p-6 border-b border-[#2b221a]/5 bg-white">
                  <h2 className="text-xs uppercase tracking-wider font-bold text-[#2b221a]">Inbound Communications Logs</h2>
                </div>
                {messages.length === 0 ? (
                  <div className="p-12 text-center text-[#2b221a]/40 text-xs font-light">No communication records.</div>
                ) : (
                  <div className="p-6 space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="p-5 border border-[#2b221a]/5 rounded-2xl bg-[#fbf9f6]/30 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-[#2b221a]">{msg.subject}</h4>
                            <p className="text-[10px] text-[#bda06d] font-semibold mt-1">From: {msg.name} ({msg.email})</p>
                          </div>
                          <button onClick={() => handleDeleteMessage(msg.id)} className="text-destructive hover:bg-destructive/5 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#2b221a]/80 leading-relaxed italic bg-white p-4 border border-[#2b221a]/5 rounded-xl">
                          &quot;{msg.message}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Store Manager View */}
            {activeMenu === 'Store Manager' && (
              <div className="space-y-8">
                {/* Add Product Form */}
                <div className="rounded-2xl border border-[#2b221a]/5 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#bda06d]">Add New Store Book/Format</h3>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#2b221a]/60 tracking-wider">Book/Format Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. JUST ELVIS JUSTICE (Paperback)"
                        value={newProdName} 
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2b221a]/5 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#bda06d]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#2b221a]/60 tracking-wider">Price (USD)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required 
                        placeholder="19.99"
                        value={newProdPrice} 
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2b221a]/5 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#bda06d]"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-[#2b221a]/60 tracking-wider">Format Description</label>
                      <input 
                        type="text" 
                        placeholder="Beautiful softcover printed book delivered to readers."
                        value={newProdDesc} 
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2b221a]/5 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#bda06d]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#2b221a]/60 tracking-wider">Format Classification</label>
                      <select
                        value={newProdType}
                        onChange={(e) => setNewProdType(e.target.value as 'digital' | 'physical')}
                        className="w-full px-3 py-2 bg-[#2b221a]/5 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#bda06d]"
                      >
                        <option value="digital">Digital (Instant delivery)</option>
                        <option value="physical">Physical (Requires shipping address)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#2b221a]/60 tracking-wider">Category Tag</label>
                      <input 
                        type="text" 
                        placeholder="New Release"
                        value={newProdCategory} 
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2b221a]/5 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#bda06d]"
                      />
                    </div>
                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#2b221a] hover:bg-[#bda06d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" /> Save Format to Catalog
                      </button>
                    </div>
                  </form>
                </div>

                {/* Edit Products Registry */}
                <div className="rounded-2xl border border-[#2b221a]/5 bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="p-6 border-b border-[#2b221a]/5 bg-white">
                    <h2 className="text-xs uppercase tracking-wider font-bold text-[#2b221a]">Active Store Catalogs</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {products.map(p => (
                      <div key={p.id} className="p-4 border border-[#2b221a]/5 bg-[#fbf9f6]/30 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {editingProductId === p.id ? (
                          <div className="w-full space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                value={p.name} 
                                onChange={(e) => handleUpdateProduct(p.id, { name: e.target.value })}
                                className="px-3 py-1.5 bg-white border border-[#2b221a]/10 rounded-lg text-xs"
                              />
                              <input 
                                type="number" 
                                step="0.01"
                                value={p.price} 
                                onChange={(e) => handleUpdateProduct(p.id, { price: parseFloat(e.target.value) || 0 })}
                                className="px-3 py-1.5 bg-white border border-[#2b221a]/10 rounded-lg text-xs font-mono"
                              />
                            </div>
                            <input 
                              type="text" 
                              value={p.description} 
                              onChange={(e) => handleUpdateProduct(p.id, { description: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white border border-[#2b221a]/10 rounded-lg text-xs"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => setEditingProductId(null)} className="px-3 py-1 bg-destructive/10 text-destructive rounded-lg text-[10px] font-bold uppercase tracking-wider">Cancel</button>
                              <button onClick={() => setEditingProductId(null)} className="px-3 py-1 bg-green-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">Done</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden border border-border/40 shrink-0">
                                <img src={p.image} className="object-cover w-full h-full" alt="" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#2b221a]">{p.name}</h4>
                                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
                                <div className="flex gap-2 mt-1.5">
                                  <span className="text-[9px] uppercase px-2 py-0.5 bg-[#2b221a]/5 text-[#2b221a]/60 font-bold rounded">{p.type}</span>
                                  <span className="text-[9px] uppercase px-2 py-0.5 bg-[#bda06d]/10 text-[#bda06d] font-bold rounded">{p.category}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 self-end md:self-auto">
                              <span className="font-mono font-bold text-sm text-[#2b221a]">${p.price}</span>
                              <div className="flex gap-2">
                                <button onClick={() => setEditingProductId(p.id)} className="p-1.5 hover:bg-[#bda06d]/15 text-[#bda06d] rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
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

            {/* Event Schedule View */}
            {activeMenu === 'Event Schedule' && (
              <div className="space-y-8">
                {/* Add Event Schedule Form */}
                <div className="rounded-2xl border border-[#2b221a]/5 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#bda06d]">Add Event Schedule Activity</h3>
                  <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#2b221a]/60 tracking-wider">Start Time</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. 7:00 PM"
                        value={newSchedTime} 
                        onChange={(e) => setNewSchedTime(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2b221a]/5 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#bda06d]"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-[#2b221a]/60 tracking-wider">Activity/Event Title</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Digital Book Reading"
                        value={newSchedActivity} 
                        onChange={(e) => setNewSchedActivity(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2b221a]/5 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#bda06d]"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-3">
                      <label className="text-[10px] uppercase font-bold text-[#2b221a]/60 tracking-wider">Presenter/Speaker name (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Dr. Elvis"
                        value={newSchedSpeaker} 
                        onChange={(e) => setNewSchedSpeaker(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2b221a]/5 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#bda06d]"
                      />
                    </div>
                    <div className="md:col-span-3 pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#2b221a] hover:bg-[#bda06d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" /> Save Activity to Schedule
                      </button>
                    </div>
                  </form>
                </div>

                {/* Edit Schedule items */}
                <div className="rounded-2xl border border-[#2b221a]/5 bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="p-6 border-b border-[#2b221a]/5 bg-white">
                    <h2 className="text-xs uppercase tracking-wider font-bold text-[#2b221a]">Active Timeline Items</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {schedule.map(s => (
                      <div key={s.id} className="p-4 border border-[#2b221a]/5 bg-[#fbf9f6]/30 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {editingScheduleId === s.id ? (
                          <div className="w-full space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                              <input 
                                type="text" 
                                value={s.time} 
                                onChange={(e) => handleUpdateSchedule(s.id, { time: e.target.value })}
                                className="px-3 py-1.5 bg-white border border-[#2b221a]/10 rounded-lg text-xs"
                              />
                              <input 
                                type="text" 
                                value={s.activity} 
                                onChange={(e) => handleUpdateSchedule(s.id, { activity: e.target.value })}
                                className="px-3 py-1.5 bg-white border border-[#2b221a]/10 rounded-lg text-xs col-span-2"
                              />
                            </div>
                            <input 
                              type="text" 
                              value={s.speaker} 
                              onChange={(e) => handleUpdateSchedule(s.id, { speaker: e.target.value })}
                              placeholder="Presenter"
                              className="w-full px-3 py-1.5 bg-white border border-[#2b221a]/10 rounded-lg text-xs"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => setEditingScheduleId(null)} className="px-3 py-1 bg-destructive/10 text-destructive rounded-lg text-[10px] font-bold uppercase tracking-wider">Cancel</button>
                              <button onClick={() => setEditingScheduleId(null)} className="px-3 py-1 bg-green-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">Done</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#bda06d]/15 text-[#bda06d] flex items-center justify-center font-bold text-xs shrink-0">
                                S
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#2b221a]">{s.activity}</h4>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Time: <span className="font-bold">{s.time}</span> {s.speaker && `| Presenter: ${s.speaker}`}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 self-end md:self-auto">
                              <button onClick={() => setEditingScheduleId(s.id)} className="p-1.5 hover:bg-[#bda06d]/15 text-[#bda06d] rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteSchedule(s.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </section>
  )
}
