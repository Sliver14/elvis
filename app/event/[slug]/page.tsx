'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function DynamicEventRedirect({ params }: PageProps) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug
  const router = useRouter()

  useEffect(() => {
    // Direct user smoothly to the dedicated book launch room
    router.replace(`/book/${slug}`)
  }, [slug, router])

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center text-[#1d1b18]">
      <div className="text-center space-y-4">
        <span className="editorial-script text-3xl text-[#c79a68]">Connecting to Mainstage Broadcast...</span>
        <div className="w-8 h-8 border-2 border-[#c79a68] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  )
}
