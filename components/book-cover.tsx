'use client'

import { Book } from '@/lib/types'

export function Cover({ book, className = '' }: { book: Book; className?: string }) {
  return (
    <div className={`book-cover ${className}`} onContextMenu={(e) => e.preventDefault()}>
      <img
        src={book.image || '/practical-trading-psychology.png'}
        alt={`${book.title} book cover`}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="cover-protection-shield" aria-hidden="true" />
    </div>
  )
}
