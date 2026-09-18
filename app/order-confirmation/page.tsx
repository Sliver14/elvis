'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Footer from '@/components/footer'
import { CheckCircle2, Download, ArrowRight, FileText, Music, ShoppingBag, Sparkles } from 'lucide-react'
import Link from 'next/link'

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

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) {
      const savedOrders = JSON.parse(localStorage.getItem('aurora_orders') || '[]')
      const matched = savedOrders.find((o: Order) => o.orderId === orderId)
      if (matched) {
        setOrder(matched)
      }
    }
  }, [orderId])

  const isDigitalItem = (itemName: string) => {
    return itemName.toLowerCase().includes('ebook') || itemName.toLowerCase().includes('audiobook')
  }

  return (
    <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center space-y-8">
      
      {/* Success Icon */}
      <div className="relative inline-flex items-center justify-center p-5 bg-[#c79a68]/15 rounded-full text-[#c79a68]">
        <CheckCircle2 className="w-14 h-14" />
      </div>

      <div className="space-y-2">
        <span className="editorial-script text-2xl text-[#c79a68]">
          Order Confirmed
        </span>
        <h1 className="editorial-heading text-3xl sm:text-4xl md:text-5xl text-[#1d1b18]">
          Thank You for Your Order
        </h1>
        <p className="body-text text-sm sm:text-base text-[#77716a] max-w-md mx-auto">
          Your payment was processed successfully. A confirmation receipt has been delivered to{' '}
          <span className="font-semibold text-[#1d1b18]">{order?.customerEmail || 'your email'}</span>.
        </p>
      </div>

      {/* Order Details Panel */}
      <div className="editorial-card p-6 sm:p-8 text-left space-y-5 bg-white">
        <div className="flex justify-between items-center border-b border-[rgba(80,60,40,0.08)] pb-3 text-xs font-semibold text-[#77716a] uppercase tracking-wider font-sans">
          <span>Order Reference</span>
          <span>Date</span>
        </div>
        <div className="flex justify-between items-center text-sm sm:text-base font-bold text-[#1d1b18]">
          <span className="font-mono text-[#c79a68]">{orderId || 'ORD-XXXXXX'}</span>
          <span>{order?.date || new Date().toLocaleDateString()}</span>
        </div>

        <div className="border-t border-[rgba(80,60,40,0.08)] pt-4 space-y-2.5">
          <p className="text-xs uppercase font-semibold text-[#77716a] tracking-wider mb-2 font-sans">
            Purchased Editions
          </p>
          {order?.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="font-serif font-bold text-[#1d1b18]">
                {item.name} <span className="text-[#77716a] text-xs font-sans font-normal ml-1">x{item.quantity}</span>
              </span>
              <span className="font-mono font-bold text-[#1d1b18]">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          )) || (
            <p className="text-sm text-[#77716a]">Loading order contents...</p>
          )}
        </div>

        <div className="border-t border-[rgba(80,60,40,0.08)] pt-4 flex justify-between items-center font-bold text-lg">
          <span className="font-serif text-[#1d1b18]">Total Paid</span>
          <span className="text-[#c79a68] font-mono text-xl">${order?.total.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      {/* Downloads Panel */}
      {order?.items.some((item) => isDigitalItem(item.name)) && (
        <div className="editorial-card p-6 sm:p-8 text-left space-y-4 bg-[#f1ece3]/60 border border-[rgba(80,60,40,0.12)]">
          <h3 className="font-serif text-lg font-bold text-[#1d1b18] flex items-center gap-2">
            <Download className="w-5 h-5 text-[#c79a68]" />
            Instant Digital Download Panel
          </h3>
          <p className="text-xs text-[#77716a] leading-relaxed">
            Click below to download your digital book assets immediately in universal formats (EPUB &bull; PDF &bull; MP3). These secure links remain active for 30 days.
          </p>

          <div className="space-y-3 pt-2">
            {order.items
              .filter((item) => isDigitalItem(item.name))
              .map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-[rgba(80,60,40,0.08)] gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    {item.name.toLowerCase().includes('audiobook') ? (
                      <div className="w-9 h-9 rounded-full bg-[#f1ece3] text-[#c79a68] flex items-center justify-center shrink-0">
                        <Music className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#f1ece3] text-[#c79a68] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <p className="font-serif text-sm font-bold text-[#1d1b18]">{item.name}</p>
                      <p className="text-[10px] text-[#77716a] uppercase tracking-wider font-sans">High-Res DRM-Free Files</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      alert(`Starting simulated digital download package for: ${item.name}`)
                    }}
                    className="editorial-btn-primary py-2 px-4 text-xs shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download Files
                  </a>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Physical Shipping Dispatch Notice */}
      {order?.items.some((item) => !isDigitalItem(item.name)) && (
        <div className="editorial-card p-6 sm:p-8 text-left space-y-2 bg-white">
          <h3 className="font-serif text-lg font-bold text-[#1d1b18] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#c79a68]" />
            Physical Edition Fulfillment
          </h3>
          <p className="text-xs text-[#77716a] leading-relaxed">
            Your collector print editions are being packaged at our fulfillment warehouse. Standard global tracking information will be dispatched to your email within 2-3 business days.
          </p>
        </div>
      )}

      {/* Navigation Return */}
      <div className="pt-4 flex flex-wrap justify-center gap-4">
        <Link href="/" className="editorial-btn-primary">
          Return to Home <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
        <Link href="/store" className="editorial-btn-secondary">
          Explore More Titles
        </Link>
      </div>

    </section>
  )
}

export default function OrderConfirmationPage() {
  return (
    <main className="bg-[#f8f5ef] text-[#1d1b18] min-h-screen">
      <Suspense fallback={
        <div className="pt-32 text-center text-[#77716a] text-sm animate-pulse font-serif">
          Loading order details...
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
      <Footer />
    </main>
  )
}
