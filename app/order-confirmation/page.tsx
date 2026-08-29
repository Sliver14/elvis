'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Footer from '@/components/footer'
import { CheckCircle2, Download, ArrowRight, FileText, Music, ShoppingBag } from 'lucide-react'
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
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
      
      {/* Success Icon */}
      <div className="relative inline-flex items-center justify-center p-4 bg-[#eaddcd]/30 rounded-full text-[#b08d57]">
        <CheckCircle2 className="w-16 h-16" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground">
          Thank You for Your Order!
        </h1>
        <p className="text-[#7d7265] max-w-md mx-auto text-sm md:text-base">
          Your payment was processed successfully. A confirmation email has been sent to{' '}
          <span className="font-semibold text-foreground">{order?.customerEmail || 'your email'}</span>.
        </p>
      </div>

      {/* Order Details Panel */}
      <div className="border border-border rounded-xl bg-card p-6 text-left space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-border pb-3 text-xs md:text-sm font-medium text-muted-foreground uppercase">
          <span>Order Reference</span>
          <span>Date</span>
        </div>
        <div className="flex justify-between items-center text-sm md:text-base font-bold text-foreground">
          <span className="font-mono text-[#b08d57]">{orderId || 'ORD-XXXXXX'}</span>
          <span>{order?.date || new Date().toLocaleDateString()}</span>
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-2">Items Purchased</p>
          {order?.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-foreground">
                {item.name} <span className="text-muted-foreground text-xs font-mono">x{item.quantity}</span>
              </span>
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          )) || (
            <p className="text-sm text-[#7d7265]">Loading items...</p>
          )}
        </div>

        <div className="border-t border-border pt-4 flex justify-between items-center font-bold text-lg">
          <span>Total Paid</span>
          <span className="text-[#b08d57] font-mono">${order?.total.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      {/* Downloads Panel */}
      {order?.items.some((item) => isDigitalItem(item.name)) && (
        <div className="border border-[#eadecc] bg-[#f8f5f0] rounded-xl p-6 text-left space-y-4 shadow-sm">
          <h3 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
            <Download className="w-5 h-5 text-[#b08d57]" />
            Digital Download Panel
          </h3>
          <p className="text-xs text-[#7d7265]">
            Click below to download your digital book files immediately. These links are valid for 30 days.
          </p>

          <div className="space-y-3 pt-2">
            {order.items
              .filter((item) => isDigitalItem(item.name))
              .map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border border-border gap-3">
                  <div className="flex items-center gap-3">
                    {item.name.toLowerCase().includes('audiobook') ? (
                      <Music className="w-5 h-5 text-[#b08d57] shrink-0" />
                    ) : (
                      <FileText className="w-5 h-5 text-[#b08d57] shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">PDF / EPUB / MP3 Format</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      alert(`Starting download simulation for: ${item.name}`)
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#b08d57] text-white text-xs font-semibold rounded hover:shadow transition-all text-center"
                  >
                    <Download className="w-3.5 h-3.5" /> Download File
                  </a>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Shipping update */}
      {order?.items.some((item) => !isDigitalItem(item.name)) && (
        <div className="border border-border bg-[#fdfcfb] rounded-xl p-6 text-left space-y-3">
          <h3 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#b08d57]" />
            Shipping Update
          </h3>
          <p className="text-xs text-[#7d7265] leading-relaxed">
            Your physical book editions (Paperback / Hardcover) are being packaged. We will dispatch them within 2-3 business days and email you a tracking link.
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="pt-4 flex justify-center gap-4">
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:shadow-lg transition-all">
          Return Home <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/store" className="inline-flex items-center gap-2 px-6 py-2.5 border border-border text-foreground text-sm font-semibold rounded-lg hover:bg-muted transition-all">
          Back to Bookstore
        </Link>
      </div>

    </section>
  )
}

export default function OrderConfirmationPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Suspense fallback={
        <div className="pt-32 text-center text-[#7d7265] text-sm animate-pulse">
          Loading confirmation details...
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
      <Footer />
    </main>
  )
}
