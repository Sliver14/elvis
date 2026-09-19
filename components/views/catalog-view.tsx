'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Loader2, Search } from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { Cover } from '@/components/book-cover'

export function CatalogView() {
  const { booksList, loadingBooks } = useStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All books')

  const categories = useMemo(() => {
    const set = new Set<string>(['All books'])
    booksList.forEach((b) => set.add(b.category))
    return Array.from(set)
  }, [booksList])

  const filtered = booksList.filter(
    (book) =>
      (category === 'All books' || book.category === category) &&
      `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="section-shell catalog-page">
      <div className="catalog-intro">
        <p className="eyebrow">The bookstore</p>
        <h1>Books for <em>curious minds.</em></h1>
        <p>Browse a small, carefully chosen collection of books that make space for better questions.</p>
      </div>

      <div className="catalog-toolbar">
        <label className="search-field">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or author"
            aria-label="Search books"
          />
        </label>
        <label className="select-field">
          <span className="sr-only">Filter by category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown />
        </label>
      </div>

      {loadingBooks ? (
        <div style={{ minHeight: '35vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
          <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: 'var(--color-accent)' }} />
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', letterSpacing: '0.04em' }}>Loading books...</p>
        </div>
      ) : filtered.length ? (
        <div className="book-grid">
          {filtered.map((book) => (
            <Link href={`/books/${book.id}`} key={book.id} className="book-card-link">
              <article className="book-card">
                <div className="card-cover-wrap">
                  <Cover book={book} />
                  <span className="card-category">{book.category}</span>
                </div>
                <div className="book-card-meta">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <div>
                    <span>{book.price}</span>
                    <span className="round-arrow" aria-label={`View ${book.title}`}>
                      <ArrowRight />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search />
          <h2>No books found</h2>
          <p>Try another title, author, or category.</p>
        </div>
      )}
    </main>
  )
}
