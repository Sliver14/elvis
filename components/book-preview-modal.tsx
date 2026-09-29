'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  List,
  Sparkles,
  Type,
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
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  
  const contentCanvasRef = useRef<HTMLElement>(null)
  const tabsScrollRef = useRef<HTMLDivElement>(null)

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
      if (e.key === 'Escape') {
        if (mobileTocOpen) {
          setMobileTocOpen(false)
        } else {
          onClose()
        }
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, mobileTocOpen])

  // Scroll active chapter tab into view on mobile pill strip
  useEffect(() => {
    if (tabsScrollRef.current) {
      const activeEl = tabsScrollRef.current.querySelector('.preview-strip-tab.is-active') as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [activeChapterIndex])

  if (!isOpen) return null

  const chapters: PreviewChapter[] =
    preview.chapters && preview.chapters.length > 0
      ? preview.chapters
      : DEFAULT_BOOK_PREVIEW.chapters

  const currentChapter = chapters[activeChapterIndex] || chapters[0]
  const isLastChapter = activeChapterIndex === chapters.length - 1

  const handleSelectChapter = (idx: number) => {
    setActiveChapterIndex(idx)
    setMobileTocOpen(false)
    if (contentCanvasRef.current) {
      contentCanvasRef.current.scrollTop = 0
    }
    const el = document.getElementById('chapter-content-body')
    if (el) el.scrollTop = 0
  }

  const toggleFontSize = () => {
    if (fontSize === 'sm') setFontSize('md')
    else if (fontSize === 'md') setFontSize('lg')
    else setFontSize('sm')
  }

  return (
    <div className="preview-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className="preview-reader-card" role="dialog" aria-modal="true" aria-label="Book Preview Reader">
        {/* Reader Top Bar */}
        <header className="preview-top-bar">
          <div className="preview-top-left">
            <button
              type="button"
              className="preview-mobile-toc-btn"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              aria-label="Toggle Table of Contents"
              title="Table of Contents"
            >
              <List size={17} />
              <span className="toc-btn-text">
                Contents <small>({activeChapterIndex + 1}/{chapters.length})</small>
              </span>
            </button>

            <div className="preview-top-meta">
              <span className="preview-badge"><BookOpen size={12} /> Excerpt</span>
              <span className="preview-book-title">{preview.title}</span>
              <span className="preview-author-sub">By {preview.author}</span>
            </div>
          </div>

          <div className="preview-top-actions">
            {/* Font Size Adjuster */}
            <button
              type="button"
              className="preview-font-toggle-btn"
              onClick={toggleFontSize}
              title={`Reading Text Size: ${fontSize.toUpperCase()} (Click to toggle)`}
              aria-label="Adjust font size"
            >
              <span className="font-toggle-icon">Aa</span>
              <span className="font-size-indicator">{fontSize.toUpperCase()}</span>
            </button>

            <button
              type="button"
              className="button button-dark btn-sm preview-cta-btn"
              onClick={() => {
                onClose()
                onPreOrderClick()
              }}
            >
              <span className="preview-cta-full">Pre-order Book</span>
              <span className="preview-cta-short">Pre-order</span>
              <ArrowRight size={13} />
            </button>

            <button className="icon-button preview-close-btn" onClick={onClose} aria-label="Close preview reader">
              <X size={19} />
            </button>
          </div>
        </header>

        {/* Mobile & Tablet Horizontal Chapter Selector Strip */}
        <nav className="preview-mobile-strip-wrap" aria-label="Quick chapter selector">
          <div className="preview-mobile-strip" ref={tabsScrollRef}>
            {chapters.map((ch, idx) => (
              <button
                key={ch.id || idx}
                type="button"
                className={`preview-strip-tab ${activeChapterIndex === idx ? 'is-active' : ''}`}
                onClick={() => handleSelectChapter(idx)}
              >
                <span className="strip-tab-num">{ch.chapter_number}</span>
                <span className="strip-tab-title">{ch.title}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Reader Body Grid */}
        <div className="preview-reader-layout">
          {/* Chapter Navigation Sidebar (Desktop & Wide Tablet) */}
          <aside className="preview-chapters-nav">
            <div className="preview-nav-header">
              <p className="eyebrow">Table of Contents</p>
              <span className="chapters-count-tag">{chapters.length} Excerpts</span>
            </div>
            
            <div className="preview-chapter-links">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id || idx}
                  className={`chapter-tab-btn ${activeChapterIndex === idx ? 'is-active' : ''}`}
                  onClick={() => handleSelectChapter(idx)}
                >
                  <div className="chapter-tab-top">
                    <span className="chapter-tab-num">{ch.chapter_number}</span>
                    <span className="chapter-tab-time"><Clock size={11} /> {ch.read_time}</span>
                  </div>
                  <strong className="chapter-tab-title">{ch.title}</strong>
                  {ch.subtitle && <p className="chapter-tab-sub">{ch.subtitle}</p>}
                </button>
              ))}
            </div>

            <div className="preview-sidebar-cta">
              <div className="sidebar-cta-inner">
                <Sparkles size={16} />
                <strong>Want the full book?</strong>
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

          {/* Mobile Table of Contents Slide-out Drawer */}
          {mobileTocOpen && (
            <div className="preview-mobile-toc-overlay" onClick={() => setMobileTocOpen(false)}>
              <div className="preview-mobile-toc-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-toc-head">
                  <div>
                    <span className="eyebrow">TABLE OF CONTENTS</span>
                    <h3>Preview Chapters</h3>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => setMobileTocOpen(false)}
                    aria-label="Close table of contents"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="mobile-toc-list">
                  {chapters.map((ch, idx) => (
                    <button
                      key={ch.id || idx}
                      type="button"
                      className={`mobile-toc-item ${activeChapterIndex === idx ? 'is-active' : ''}`}
                      onClick={() => handleSelectChapter(idx)}
                    >
                      <div className="mobile-toc-item-meta">
                        <span className="chapter-tab-num">{ch.chapter_number}</span>
                        <span className="chapter-tab-time"><Clock size={11} /> {ch.read_time}</span>
                      </div>
                      <strong className="mobile-toc-title">{ch.title}</strong>
                      {ch.subtitle && <p className="mobile-toc-sub">{ch.subtitle}</p>}
                    </button>
                  ))}
                </div>
                <div className="mobile-toc-footer">
                  <button
                    type="button"
                    className="button button-dark"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      onClose()
                      onPreOrderClick()
                    }}
                  >
                    Pre-order Complete Edition <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Reading Canvas */}
          <main
            id="chapter-content-body"
            ref={contentCanvasRef}
            className="preview-content-canvas"
          >
            <div className="chapter-header-box">
              <div className="chapter-header-top-row">
                <span className="chapter-badge">{currentChapter.excerpt_badge || currentChapter.chapter_number}</span>
                <span className="chapter-progress-pill">Chapter {activeChapterIndex + 1} of {chapters.length}</span>
              </div>
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

            {/* Chapter Formatted Content with dynamic font size */}
            <article className={`chapter-prose font-size-${fontSize}`}>
              {currentChapter.content.split('\n\n').map((block, bIdx) => {
                const trimmed = block.trim()
                if (!trimmed) return null
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
                    type="button"
                    className="button button-dark btn-lg preview-end-preorder-btn"
                    onClick={() => {
                      onClose()
                      onPreOrderClick()
                    }}
                  >
                    Proceed to Pre-order <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="chapter-step-buttons">
                  <button
                    type="button"
                    className="button button-light btn-sm step-nav-btn prev-btn"
                    disabled={activeChapterIndex === 0}
                    onClick={() => handleSelectChapter(activeChapterIndex - 1)}
                  >
                    <ChevronLeft size={16} /> <span className="nav-btn-text">Previous Section</span>
                  </button>

                  <div className="step-page-counter">
                    {activeChapterIndex + 1} / {chapters.length}
                  </div>

                  <button
                    type="button"
                    className="button button-dark btn-sm step-nav-btn next-btn"
                    onClick={() => handleSelectChapter(activeChapterIndex + 1)}
                  >
                    <span className="nav-btn-text">Next Section</span> <ChevronRight size={16} />
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
