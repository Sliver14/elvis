'use client'

import React, { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  X,
} from 'lucide-react'
import { BookPreview, PreviewChapter, DEFAULT_BOOK_PREVIEW } from '@/lib/types'

interface BookPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onPreOrderClick: () => void
}

function renderMarkdownInline(text: string): React.ReactNode {
  if (!text) return text
  const parts: React.ReactNode[] = []
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index} style={{ color: 'var(--foreground)', fontWeight: 600 }}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>)
    } else {
      parts.push(token)
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export function BookPreviewModal({
  isOpen,
  onClose,
  onPreOrderClick,
}: BookPreviewModalProps) {
  const [preview, setPreview] = useState<BookPreview>(DEFAULT_BOOK_PREVIEW)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const fetchPreview = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/preview')
        const data = await res.json()
        if (data.success && data.preview) {
          setPreview(data.preview)
        }
      } catch (err) {
        console.error('Error fetching preview:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const chapters: PreviewChapter[] =
    preview.chapters && preview.chapters.length > 0
      ? preview.chapters
      : DEFAULT_BOOK_PREVIEW.chapters

  const currentChapter = chapters[activeChapterIndex] || chapters[0]
  const isLastChapter = activeChapterIndex === chapters.length - 1

  return (
    <div className="preview-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className="preview-reader-card" role="dialog" aria-modal="true" aria-label="Book Preview Reader">
        {/* Reader Top Bar */}
        <header className="preview-top-bar">
          <div className="preview-top-meta">
            <span className="preview-badge"><BookOpen size={13} /> Official Book Preview</span>
            <span className="preview-book-title">{preview.title}</span>
            <span className="preview-author-sub">By {preview.author}</span>
          </div>
          <div className="preview-top-actions">
            <button
              className="button button-dark btn-sm preview-cta-btn"
              onClick={() => {
                onClose()
                onPreOrderClick()
              }}
            >
              Pre-order Book <ArrowRight size={14} />
            </button>
            <button className="icon-button" onClick={onClose} aria-label="Close preview reader">
              <X />
            </button>
          </div>
        </header>

        {/* Reader Body Grid */}
        <div className="preview-reader-layout">
          {/* Chapter Navigation Sidebar */}
          <aside className="preview-chapters-nav">
            <p className="eyebrow">Contents & Excerpts</p>
            <div className="preview-chapter-links">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id || idx}
                  className={`chapter-tab-btn ${activeChapterIndex === idx ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveChapterIndex(idx)
                    const el = document.getElementById('chapter-content-body')
                    if (el) el.scrollTop = 0
                  }}
                >
                  <span className="chapter-tab-num">{ch.chapter_number}</span>
                  <strong className="chapter-tab-title">{ch.title}</strong>
                  <span className="chapter-tab-time"><Clock size={11} /> {ch.read_time}</span>
                </button>
              ))}
            </div>

            <div className="preview-sidebar-cta">
              <div className="sidebar-cta-inner">
                <Sparkles size={16} />
                <strong>Want the full blueprint?</strong>
                <p>Reserve your first edition copy now before official release.</p>
                <button
                  className="button button-dark btn-sm"
                  onClick={() => {
                    onClose()
                    onPreOrderClick()
                  }}
                >
                  Pre-order Edition <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Reading Canvas */}
          <main id="chapter-content-body" className="preview-content-canvas">
            <div className="chapter-header-box">
              <span className="chapter-badge">{currentChapter.excerpt_badge || currentChapter.chapter_number}</span>
              <h1 className="chapter-display-title">{currentChapter.title}</h1>
              {currentChapter.subtitle && (
                <p className="chapter-display-subtitle">{currentChapter.subtitle}</p>
              )}
              <div className="chapter-reading-meta">
                <span><Clock size={13} /> {currentChapter.read_time}</span>
                <span>·</span>
                <span>Author: {preview.author}</span>
                <span>·</span>
                <span>Licensed Public Excerpt</span>
              </div>
            </div>

            {/* Chapter Formatted Content */}
            <article className="chapter-prose">
              {currentChapter.content.split('\n\n').map((block, bIdx) => {
                const trimmed = block.trim()
                if (trimmed.startsWith('### ')) {
                  return <h3 key={bIdx} className="prose-h3">{trimmed.replace('### ', '')}</h3>
                }
                if (trimmed.startsWith('#### ')) {
                  return <h4 key={bIdx} className="prose-h4">{trimmed.replace('#### ', '')}</h4>
                }
                if (trimmed.startsWith('> ')) {
                  return (
                    <blockquote key={bIdx} className="prose-quote">
                      {renderMarkdownInline(trimmed.replace(/^>\s*/, '').replace(/^"|"$/g, ''))}
                    </blockquote>
                  )
                }
                if (trimmed.startsWith('```')) {
                  const code = trimmed.replace(/```[a-z]*\n?|```/g, '')
                  return (
                    <pre key={bIdx} className="prose-code-block">
                      <code>{code}</code>
                    </pre>
                  )
                }
                if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
                  const items = trimmed.split('\n')
                  return (
                    <ul key={bIdx} className="prose-list">
                      {items.map((it, iIdx) => (
                        <li key={iIdx}>
                          {renderMarkdownInline(it.replace(/^[-*]|\d+\.\s*/, '').trim())}
                        </li>
                      ))}
                    </ul>
                  )
                }
                return (
                  <p key={bIdx} className="prose-p">
                    {renderMarkdownInline(trimmed)}
                  </p>
                )
              })}
            </article>

            {/* Key Takeaways Section */}
            {currentChapter.key_takeaways && currentChapter.key_takeaways.length > 0 && (
              <div className="chapter-takeaways-box">
                <h4><Sparkles size={16} /> Chapter Key Principles:</h4>
                <ul>
                  {currentChapter.key_takeaways.map((t, tIdx) => (
                    <li key={tIdx}>
                      <CheckCircle2 size={15} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* End of Preview / Navigation Bar */}
            <div className="preview-footer-banner">
              {isLastChapter ? (
                <div className="preview-end-prompt">
                  <div className="prompt-badge">END OF PREVIEW EXCERPT</div>
                  <h3>Continue reading <em>Practical Trading Psychology</em></h3>
                  <p>
                    Unlock all 12 chapters, interactive exercises, risk calculation formulas, and behavioral psychology strategies in the complete edition.
                  </p>
                  <button
                    className="button button-dark btn-lg"
                    onClick={() => {
                      onClose()
                      onPreOrderClick()
                    }}
                  >
                    Proceed to Pre-order <ArrowRight />
                  </button>
                </div>
              ) : (
                <div className="chapter-step-buttons">
                  <button
                    className="button button-light btn-sm"
                    disabled={activeChapterIndex === 0}
                    onClick={() => {
                      setActiveChapterIndex(activeChapterIndex - 1)
                      const el = document.getElementById('chapter-content-body')
                      if (el) el.scrollTop = 0
                    }}
                  >
                    <ChevronLeft size={16} /> Previous Section
                  </button>
                  <button
                    className="button button-dark btn-sm"
                    onClick={() => {
                      setActiveChapterIndex(activeChapterIndex + 1)
                      const el = document.getElementById('chapter-content-body')
                      if (el) el.scrollTop = 0
                    }}
                  >
                    Next Section <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
