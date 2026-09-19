'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { Cover } from '@/components/book-cover'
export function BookDetailsView({ bookId }: { bookId: string }) {
  const { booksList, addToCart } = useStore()

  const book = booksList.find((b) => b.id === bookId)

  if (!book) {
    return (
      <main className="section-shell detail-page">
        <Link href="/books" className="text-button">
          <ArrowLeft /> Back to books
        </Link>
        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <h2>Book not found</h2>
          <p>The book you are looking for might have been moved or updated.</p>
          <Link href="/books" className="button button-dark" style={{ marginTop: '1.5rem' }}>
            Explore the collection <ArrowRight />
          </Link>
        </div>
      </main>
    )
  }

  const recommendations = booksList.filter((candidate) => candidate.id !== book.id)

  return (
    <main className="section-shell detail-page">
      <Link href="/books" className="text-button">
        <ArrowLeft /> Back to books
      </Link>

      <div className="detail-layout">
        <Cover book={book} className="detail-cover" />
        <div className="detail-copy">
          <p className="eyebrow">{book.category}</p>
          <h1>{book.title}</h1>
          <p className="detail-author">By {book.author}</p>
          <p className="detail-description">{book.description}</p>
          <div className="detail-author-bio">
            <div className="detail-author-header">
              <div className="author-photo-frame author-detail-photo-frame" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={book.authorImage || book.author_image || '/elvis.jpeg'}
                  alt={book.author}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <div className="cover-protection-shield" aria-hidden="true" />
              </div>
              <div>
                <p className="eyebrow">About the author</p>
                <h3>{book.author}</h3>
              </div>
            </div>
            <p>{book.bio || ''}</p>
          </div>
          <div className="detail-purchase">
            <strong>{book.price}</strong>
            <button className="button button-dark" onClick={() => addToCart(book)}>
              <ShoppingBag /> Add to cart
            </button>
          </div>
        </div>
      </div>

      <section className="related-books">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Keep exploring</p>
            <h2>You might also <em>like these.</em></h2>
          </div>
          <Link href="/books" className="text-button">
            View all books <ArrowRight />
          </Link>
        </div>
        <div className="book-grid related-book-grid">
          {recommendations.map((recommended) => (
            <Link
              href={`/books/${recommended.id}`}
              key={recommended.id}
              className="book-card-link"
            >
              <article className="book-card">
                <div className="card-cover-wrap">
                  <Cover book={recommended} />
                  <span className="card-category">{recommended.category}</span>
                </div>
                <div className="book-card-meta">
                  <h3>{recommended.title}</h3>
                  <p>{recommended.author}</p>
                  <div>
                    <span>{recommended.price}</span>
                    <span className="round-arrow" aria-label={`View ${recommended.title}`}>
                      <ArrowRight />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
