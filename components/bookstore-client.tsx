'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Camera,
  Menu,
  Minus,
  Music2,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  AtSign,
  BarChart3,
  BookOpen,
  LockKeyhole,
  LogOut,
  Mail,
  Settings2,
  Users,
  X,
  UploadCloud,
  Rocket,
  Download,
  CreditCard,
  Layers,
  Calendar,
  Phone,
  FileText,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Tag
} from 'lucide-react'

export interface Book {
  id: string
  title: string
  author: string
  authorImage?: string
  author_image?: string
  category: string
  price: string
  description: string
  bio?: string
  image: string
  pdf_url?: string
  featured?: boolean
}

export interface BookLaunch {
  id: string
  slug: string
  title: string
  author: string
  author_bio?: string
  author_image?: string
  tagline?: string
  intro?: string
  description?: string
  themes: string[]
  cover_image: string
  launch_date: string
  is_active: boolean
  registrations_count?: number
}

const DEFAULT_BOOKS: Book[] = [
  {
    id: 'practical-trading-psychology',
    title: 'Practical Trading Psychology',
    author: 'Dr Elvis Justice Bedi',
    authorImage: '/elvis.jpeg',
    category: 'Mind & Money',
    price: '$24.00',
    description: 'A thoughtful guide to the emotional discipline and clear process behind better trading decisions.',
    bio: 'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.',
    image: '/practical-trading-psychology.png',
    pdf_url: '',
    featured: true,
  },
  {
    id: 'the-art-of-attention',
    title: 'The Art of Attention',
    author: 'Mara Linde',
    authorImage: '/elvis.jpeg',
    category: 'Mindfulness',
    price: '$19.00',
    description: 'A quiet invitation to notice more, do less, and make room for what matters.',
    bio: 'Mara Linde writes about attention, rest, and the small rituals that help us return to ourselves. She lives between long walks, marked-up notebooks, and quiet rooms.',
    image: '/just.jpeg',
    pdf_url: '',
  },
  {
    id: 'small-courage',
    title: 'Small Courage',
    author: 'Jonas Vale',
    authorImage: '/elvis.jpeg',
    category: 'Personal Growth',
    price: '$21.00',
    description: 'Notes on showing up for the meaningful work, one ordinary day at a time.',
    bio: 'Jonas Vale is an essayist and teacher interested in creative practice, resilience, and the courage found in ordinary routines. He writes from a small studio by the sea.',
    image: '/elvis.jpeg',
    pdf_url: '',
  },
]

const DEFAULT_LAUNCH: BookLaunch = {
  id: 'practical-trading-psychology-launch',
  slug: 'practical-trading-psychology',
  title: 'Practical Trading Psychology',
  author: 'Dr Elvis Justice Bedi',
  author_bio: 'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.',
  author_image: '/elvis.jpeg',
  tagline: 'Process over profit.\nWin in the mind first.',
  intro: 'A practical exploration of the mindset, discipline, emotional control, and decision-making processes that shape a trader\'s journey.',
  description: 'Practical Trading Psychology explores the mindset, discipline, emotional control, and decision-making processes that shape a trader\'s journey. It emphasizes the importance of mastering the mind and building a consistent process rather than being driven solely by profit.',
  themes: [
    'Emotional discipline',
    'Process-driven decision-making',
    'Managing trading psychology',
    'Developing consistency',
    'Building the right mindset'
  ],
  cover_image: '/practical-trading-psychology.png',
  launch_date: '2026-11-06T09:00:00+01:00',
  is_active: true
}

function Cover({ book, className = '' }: { book: Book; className?: string }) {
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

function Countdown({ targetDate }: { targetDate: string }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(targetDate || '2026-11-06T09:00:00+01:00').getTime() - Date.now()))

  useEffect(() => {
    const target = new Date(targetDate || '2026-11-06T09:00:00+01:00').getTime()
    setRemaining(Math.max(0, target - Date.now()))
    const interval = window.setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [targetDate])

  const values = useMemo(() => {
    const total = Math.floor(remaining / 1000)
    return [Math.floor(total / 86400), Math.floor((total % 86400) / 3600), Math.floor((total % 3600) / 60), total % 60]
  }, [remaining])

  if (!remaining) return <p className="launch-live">The book is now available.</p>
  return (
    <div className="countdown" aria-label="Time until book launch">
      {values.map((value, index) => (
        <div className="countdown-unit" key={index}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span>
        </div>
      ))}
    </div>
  )
}

function Nav({ page, onNavigate, onCart, cartCount }: { page: string; onNavigate: (id: string) => void; onCart: () => void; cartCount: number }) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0
    let ticking = false

    const updateHeader = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)

      if (open) {
        setVisible(true)
      } else if (currentScrollY <= 84) {
        setVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 84) {
        setVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setVisible(true)
      }
      lastScrollY = Math.max(0, currentScrollY)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  const navigate = (id: string) => { onNavigate(id); setOpen(false) }
  const activePage = page.startsWith('details:') ? 'books' : page
  const navItems = [['home', 'Home'], ['books', 'Books'], ['launch', 'Book launch'], ['about', 'About'], ['contact', 'Contact']] as const
  const headerClass = `site-header ${visible ? 'is-visible' : 'is-hidden'} ${scrolled ? 'is-scrolled' : ''}`

  return (
    <header className={headerClass}>
      <div className="header-inner">
        <button className="wordmark" onClick={() => navigate('home')} aria-label="Go home">
          <span className="wordmark-mark">S</span>
          <span>SERENDIPITY / <em>ELVIS</em></span>
        </button>
        <nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
          {navItems.map(([id, label]) => (
            <button key={id} className={activePage === id ? 'is-active' : ''} aria-current={activePage === id ? 'page' : undefined} onClick={() => navigate(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={() => navigate('books')} aria-label="Search">
            <Search />
          </button>
          <button className="icon-button bag-button" onClick={onCart} aria-label={`Shopping bag, ${cartCount} items`}>
            <ShoppingBag />
            <span>{cartCount}</span>
          </button>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="newsletter">
      <div>
        <p className="eyebrow">The reading list</p>
        <h2>A little more <em>thoughtfully.</em></h2>
        <p>New releases, considered recommendations, and notes from the world of books. Once a month, never noisy.</p>
      </div>
      {sent ? (
        <div className="newsletter-success">
          <Check /> You&apos;re on the list.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="button button-dark" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <>Subscribe <ArrowRight /></>}
          </button>
        </form>
      )}
    </section>
  )
}

function Home({ booksList, launch, onNavigate, onAdd }: { booksList: Book[]; launch: BookLaunch; onNavigate: (id: string) => void; onAdd: (book: Book) => void }) {
  return (
    <main id="home">
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">Independent books for considered lives</p>
          <h1>Books to help you <em>think</em> better.</h1>
          <p className="hero-intro">Serendipity / Elvis is a modern bookstore for ideas with staying power. Discover books that meet you where you are — and take you somewhere new.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => onNavigate('books')}>
              Explore the collection <ArrowRight />
            </button>
            <button className="text-button" onClick={() => onNavigate('launch')}>
              Discover the launch <ArrowRight />
            </button>
          </div>
        </div>
        <div className="hero-banner-frame" onContextMenu={(e) => e.preventDefault()}>
          <img
            src="/elvis-banner.png"
            alt="Dr Elvis Justice Bedi — Practical Trading Psychology"
            className="hero-banner-image"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
          <div className="cover-protection-shield" aria-hidden="true" />
        </div>
      </section>

      <section className="launch-strip">
        <div className="section-shell launch-strip-inner">
          <div>
            <p className="eyebrow">Coming soon</p>
            <h2>{launch.title}</h2>
            <p>{launch.tagline?.split('\n')[0] || 'Process over profit. Win in the mind first.'}</p>
          </div>
          <div className="launch-date">
            <Clock3 />
            <span>Launching {new Date(launch.launch_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <button className="button button-light" onClick={() => onNavigate('launch')}>
            View launch <ArrowRight />
          </button>
        </div>
      </section>

      <section id="books" className="section-shell collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The collection</p>
            <h2>Find your next <em>good read.</em></h2>
          </div>
          <button className="text-button" onClick={() => onNavigate('books')}>
            View all books <ArrowRight />
          </button>
        </div>
        <div className="book-grid">
          {booksList.map((book) => (
            <article className="book-card" key={book.id} onClick={() => onAdd(book)}>
              <div className="card-cover-wrap">
                <Cover book={book} />
                <span className="card-category">{book.category}</span>
              </div>
              <div className="book-card-meta">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <div>
                  <span>{book.price}</span>
                  <button className="round-arrow" aria-label={`View ${book.title}`}>
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-band">
        <p className="eyebrow">A note from us</p>
        <blockquote>“A bookstore should be a place where curiosity feels at home.”</blockquote>
        <span>— Serendipity / Elvis</span>
      </section>

      <Newsletter />
    </main>
  )
}

function Catalog({ booksList, onNavigate, onAdd }: { booksList: Book[]; onNavigate: (id: string) => void; onAdd: (book: Book) => void }) {
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
      {filtered.length ? (
        <div className="book-grid catalog-grid">
          {filtered.map((book) => (
            <article className="book-card" key={book.id}>
              <div className="card-cover-wrap">
                <Cover book={book} />
                <span className="card-category">{book.category}</span>
              </div>
              <div className="book-card-meta">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <p className="book-description">{book.description}</p>
                <div className="book-card-actions">
                  <span>{book.price}</span>
                  <button className="text-button" onClick={() => onNavigate(`details:${book.id}`)}>
                    View details <ArrowRight />
                  </button>
                  <button className="button button-dark add-book-button" onClick={() => onAdd(book)}>
                    <ShoppingBag /> Add to cart
                  </button>
                </div>
              </div>
            </article>
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

function Launch({ launch, onNavigate }: { launch: BookLaunch; onNavigate: (id: string) => void }) {
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setLoading(true)
    try {
      await fetch('/api/launch/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          launch_id: launch.id,
          launch_title: launch.title,
        }),
      })
      setRegistered(true)
    } catch (err) {
      console.error(err)
      setRegistered(true)
    } finally {
      setLoading(false)
    }
  }

  const themes = Array.isArray(launch.themes) && launch.themes.length > 0 ? launch.themes : DEFAULT_LAUNCH.themes

  return (
    <main id="launch" className="launch-page">
      <section className="launch-hero section-shell">
        <div className="launch-hero-copy">
          <p className="eyebrow"><Sparkles /> The next release</p>
          <h1>{launch.title}</h1>
          <p className="launch-author">By {launch.author}</p>
          {launch.tagline && (
            <p className="launch-tagline" style={{ whiteSpace: 'pre-line' }}>
              {launch.tagline}
            </p>
          )}
          <p className="hero-intro">{launch.intro || launch.description}</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth' })}>
              Get notified <ArrowRight />
            </button>
            <button className="text-button" onClick={() => document.getElementById('about-book')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore the book <ArrowRight />
            </button>
          </div>
        </div>
        <div className="launch-cover-stage">
          <div className="stage-label">SERENDIPITY / ELVIS<br />FEATURED RELEASE</div>
          <div className="book-cover launch-cover" onContextMenu={(e) => e.preventDefault()}>
            <img
              src={launch.cover_image || '/practical-trading-psychology.png'}
              alt={launch.title}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="cover-protection-shield" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="countdown-section">
        <div className="section-shell countdown-inner">
          <div>
            <p className="eyebrow">The launch</p>
            <h2>Make room for a better <em>process.</em></h2>
          </div>
          <div>
            <p className="countdown-note">
              Launching {new Date(launch.launch_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <Countdown targetDate={launch.launch_date} />
          </div>
        </div>
      </section>

      <section id="about-book" className="section-shell about-book">
        <div className="about-book-heading">
          <p className="eyebrow">About the book</p>
          <h2>The mind is where every trade <em>begins.</em></h2>
        </div>
        <div className="about-book-copy">
          <p>{launch.description || launch.intro}</p>
          <p>It emphasizes the importance of mastering the mind and building a consistent process rather than being driven solely by profit.</p>
        </div>
      </section>

      <section className="themes section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Inside the work</p>
            <h2>What readers can <em>expect.</em></h2>
          </div>
        </div>
        <div className="theme-grid">
          {themes.map((theme, i) => (
            <div className="theme-item" key={theme + i}>
              <span>0{i + 1}</span>
              <h3>{theme}</h3>
              <ArrowRight />
            </div>
          ))}
        </div>
      </section>

      <section className="author-section">
        <div className="section-shell author-inner">
          <div className="author-photo-frame author-launch-photo-frame" onContextMenu={(e) => e.preventDefault()}>
            <img
              src={launch.author_image || '/elvis.jpeg'}
              alt={launch.author}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="cover-protection-shield" aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">The author</p>
            <h2>{launch.author}</h2>
            <p>{launch.author_bio || DEFAULT_LAUNCH.author_bio}</p>
          </div>
        </div>
      </section>

      <section id="notify" className="section-shell notify-section">
        <div className="notify-copy">
          <p className="eyebrow">Stay close to the launch</p>
          <h2>Be first in line for <em>{launch.title}.</em></h2>
          <p>Register your interest and we&apos;ll let you know the moment {launch.title} is available.</p>
        </div>
        {registered ? (
          <div className="registration-success">
            <div className="success-icon"><Check /></div>
            <h3>You&apos;re registered.</h3>
            <p>We&apos;ll be in touch with launch updates and priority access.</p>
          </div>
        ) : (
          <form className="notify-form" onSubmit={handleRegister}>
            <label>
              Full name
              <input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Email address
              <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Phone number <span>(optional)</span>
              <input type="tel" placeholder="+44 ..." value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to receive launch updates and understand I can unsubscribe at any time.</span>
            </label>
            <button className="button button-dark" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <>Notify me <ArrowRight /></>}
            </button>
          </form>
        )}
      </section>

      <section className="reserve-section">
        <p className="eyebrow">Almost here</p>
        <h2>Be among the first to experience<br /><em>{launch.title}.</em></h2>
        <button className="button button-light" onClick={() => document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth' })}>
          Reserve your copy <ArrowRight />
        </button>
      </section>
    </main>
  )
}

function About({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <main className="about-page">
      <section className="section-shell about-intro">
        <div>
          <p className="eyebrow">About Serendipity / Elvis</p>
          <h1>A bookstore for <em>better questions.</em></h1>
        </div>
        <p className="about-lede">We believe the right book can change the quality of a person&apos;s attention. Serendipity / Elvis brings together thoughtful books for curious minds, open conversations, and considered lives.</p>
      </section>
      <section className="section-shell about-manifesto">
        <div className="manifesto-number">01</div>
        <div>
          <p className="eyebrow">Our point of view</p>
          <h2>Less noise.<br /><em>More staying power.</em></h2>
          <p>We choose books with something to return to: a useful idea, a generous perspective, or a sentence that stays with you. Our collection is intentionally small, so every title earns its place.</p>
          <button className="text-button" onClick={() => onNavigate('books')}>Explore the collection <ArrowRight /></button>
        </div>
      </section>
      <section className="section-shell about-values">
        <div>
          <p className="eyebrow">What guides us</p>
          <h2>Read with <em>intention.</em></h2>
        </div>
        <div className="value-list">
          <div><span>01</span><h3>Curiosity</h3><p>We make room for questions that lead somewhere unexpected.</p></div>
          <div><span>02</span><h3>Clarity</h3><p>We look for ideas that make the complicated feel more possible.</p></div>
          <div><span>03</span><h3>Connection</h3><p>Books are better when they become part of a wider conversation.</p></div>
        </div>
      </section>
      <section className="section-shell author-bios">
        <div>
          <p className="eyebrow">The author</p>
          <h2>Meet the <em>author.</em></h2>
        </div>
        <div className="author-bio-grid">
          {DEFAULT_BOOKS.slice(0, 1).map((book) => (
            <article className="author-bio" key={book.author}>
              <div className="author-photo-frame author-bio-photo-frame" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={book.authorImage || '/elvis.jpeg'}
                  alt={book.author}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <div className="cover-protection-shield" aria-hidden="true" />
              </div>
              <div>
                <p className="author-number">01</p>
                <h3>{book.author}</h3>
                <p>{book.bio}</p>
                <button className="text-button" onClick={() => onNavigate(`details:${book.id}`)}>Read their book <ArrowRight /></button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="contact-page section-shell">
      <section className="contact-intro">
        <p className="eyebrow">Get in touch</p>
        <h1>Let&apos;s start a <em>conversation.</em></h1>
        <p>Have a question about an order, a recommendation, or a possible collaboration? We&apos;d love to hear from you.</p>
        <a className="contact-email" href="mailto:hello@elvisjusticebooks.com">hello@elvisjusticebooks.com <ArrowRight /></a>
      </section>
      <section className="contact-form-wrap">
        {sent ? (
          <div className="contact-success">
            <Check />
            <p><strong>Thank you for writing.</strong><br />We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>Name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" /></label>
            <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
            <label>How can we help?<textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us how we can help..." /></label>
            <button className="button button-dark" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <>Send message <ArrowRight /></>}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <footer id="contact" className="site-footer">
      <div className="section-shell footer-top">
        <div className="footer-intro">
          <button className="wordmark footer-mark" onClick={() => onNavigate('home')}>
            <span className="wordmark-mark">S</span>
            <span>SERENDIPITY / <em>ELVIS</em></span>
          </button>
          <p>A considered bookstore for curious minds, thoughtful conversations, and books worth returning to.</p>
          <button className="footer-cta" onClick={() => onNavigate('books')}>Find your next read <ArrowRight /></button>
        </div>
        <div className="footer-links">
          <div>
            <p className="footer-label">Explore</p>
            <button onClick={() => onNavigate('books')}>Books</button>
            <button onClick={() => onNavigate('launch')}>Book launch</button>
            <button onClick={() => onNavigate('about')}>About us</button>
          </div>
          <div>
            <p className="footer-label">Say hello</p>
            <button onClick={() => onNavigate('contact')}>Get in touch</button>
            <a href="mailto:hello@elvisjusticebooks.com">hello@elvisjusticebooks.com</a>
            <p>London · Accra · Online</p>
          </div>
          <div>
            <p className="footer-label">Follow along</p>
            <div className="socials">
              <a href="https://www.instagram.com/elvisjusticeofficial_/" target="_blank" rel="noreferrer" aria-label="Instagram"><Camera /></a>
              <a href="https://www.tiktok.com/@elvisjusticeofficial_" target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 /></a>
              <a href="https://twitter.com/manofserendipty" target="_blank" rel="noreferrer" aria-label="Twitter"><AtSign /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="section-shell footer-bottom">
        <span>© 2026 Serendipity / Elvis</span>
        <span>Made for readers with intention.</span>
        <span>Privacy · Terms</span>
        <button className="footer-admin-link" onClick={() => onNavigate('admin')}>Admin access</button>
      </div>
    </footer>
  )
}

function BookDetails({ book, onBack, onAdd, onNavigate, booksList }: { book: Book; onBack: () => void; onAdd: (book: Book) => void; onNavigate: (id: string) => void; booksList: Book[] }) {
  const recommendations = booksList.filter((candidate) => candidate.id !== book.id)
  return (
    <main className="section-shell detail-page">
      <button className="text-button" onClick={onBack}><ArrowLeft /> Back to books</button>
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
            <p>{book.bio || DEFAULT_BOOKS[0].bio}</p>
          </div>
          <div className="detail-purchase">
            <strong>{book.price}</strong>
            <button className="button button-dark" onClick={() => onAdd(book)}>
              <ShoppingBag /> Add to cart
            </button>
          </div>
        </div>
      </div>
      <section className="related-books">
        <div className="section-heading">
          <div><p className="eyebrow">Keep exploring</p><h2>You might also <em>like these.</em></h2></div>
          <button className="text-button" onClick={onBack}>View all books <ArrowRight /></button>
        </div>
        <div className="book-grid related-book-grid">
          {recommendations.map((recommended) => (
            <article className="book-card" key={recommended.id}>
              <button className="related-book-cover" onClick={() => onNavigate(`details:${recommended.id}`)} aria-label={`View ${recommended.title}`}>
                <Cover book={recommended} />
              </button>
              <div className="book-card-meta">
                <h3>{recommended.title}</h3>
                <p>{recommended.author}</p>
                <div className="book-card-actions">
                  <span>{recommended.price}</span>
                  <button className="button button-dark add-book-button" onClick={() => onAdd(recommended)}>
                    <ShoppingBag /> Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function Cart({ items, onClose, onRemove, onChange }: { items: { book: Book; quantity: number }[]; onClose: () => void; onRemove: (id: string) => void; onChange: (id: string, quantity: number) => void }) {
  const [checkingOut, setCheckingOut] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const total = items.reduce((sum, item) => {
    const p = Number(item.book.price.replace(/[^0-9.]/g, '')) || 0
    return sum + p * item.quantity
  }, 0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerEmail) return
    setLoading(true)
    setCheckoutError('')

    try {
      const res = await fetch('/api/checkout/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          name: customerName,
          items: items.map((i) => ({
            id: i.book.id,
            title: i.book.title,
            author: i.book.author,
            price: i.book.price,
            pdf_url: i.book.pdf_url || '',
            quantity: i.quantity,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment initiation failed')
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url
      }
    } catch (err: any) {
      console.error(err)
      setCheckoutError(err.message || 'Payment service is connecting...')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="cart-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="cart-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="cart-header">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2>Shopping bag</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close shopping bag"><X /></button>
        </div>

        {items.length ? (
          <>
            <div className="cart-items">
              {items.map(({ book, quantity }) => (
                <div className="cart-item" key={book.id}>
                  <Cover book={book} />
                  <div>
                    <h3>{book.title}</h3>
                    <p>{book.price}</p>
                    <div className="quantity-control">
                      <button onClick={() => onChange(book.id, quantity - 1)} aria-label={`Decrease ${book.title} quantity`}><Minus /></button>
                      <span>{quantity}</span>
                      <button onClick={() => onChange(book.id, quantity + 1)} aria-label={`Increase ${book.title} quantity`}><Plus /></button>
                    </div>
                  </div>
                  <button className="icon-button" onClick={() => onRemove(book.id)} aria-label={`Remove ${book.title}`}><Trash2 /></button>
                </div>
              ))}
            </div>

            {checkingOut ? (
              <form className="cart-checkout-form" onSubmit={handlePaystackCheckout}>
                <p className="checkout-title"><CreditCard /> Complete with Paystack</p>
                <label>
                  Your Email (for book delivery)
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Full Name (optional)
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>
                {checkoutError && <p className="checkout-error">{checkoutError}</p>}
                <div className="cart-footer">
                  <div>
                    <span>Total Amount</span>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                  <button className="button button-dark" type="submit" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <>Pay with Paystack <ArrowRight /></>}
                  </button>
                  <button type="button" className="text-button" onClick={() => setCheckingOut(false)}>
                    <ArrowLeft /> Back to bag
                  </button>
                </div>
              </form>
            ) : (
              <div className="cart-footer">
                <div>
                  <span>Total</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>
                <button className="button button-dark" onClick={() => setCheckingOut(true)}>
                  Proceed to Checkout <ArrowRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="cart-empty"><ShoppingBag /><p>Your bag is waiting for a good story.</p></div>
        )}
      </div>
    </>
  )
}

/* =========================================================================
   ADMIN DASHBOARD COMPONENT (FULL BACKEND INTEGRATION)
   ========================================================================= */

function AdminLogin({ onNavigate, onLogin }: { onNavigate: (id: string) => void; onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        onLogin()
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      onLogin()
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-card">
        <div className="admin-auth-mark"><LockKeyhole /></div>
        <p className="eyebrow">Serendipity / Elvis admin</p>
        <h1>Welcome <em>back.</em></h1>
        <p className="admin-auth-copy">Sign in to manage your collection, dynamic launches, orders, and reader conversations.</p>
        {error && <p className="admin-error-banner">{error}</p>}
        <form onSubmit={handleSignIn} className="admin-auth-form">
          <label>
            Email address
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@serendipity.books" />
          </label>
          <label>
            Password
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          </label>
          <button className="button button-dark" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <>Sign in <ArrowRight /></>}
          </button>
        </form>
        <button className="text-button" onClick={() => onNavigate('home')}><ArrowLeft /> Return to storefront</button>
      </div>
    </main>
  )
}

function AdminDashboard({
  onNavigate,
  onLogout,
  booksList,
  onRefreshBooks,
  activeLaunch,
  onRefreshLaunch,
}: {
  onNavigate: (id: string) => void
  onLogout: () => void
  booksList: Book[]
  onRefreshBooks: () => void
  activeLaunch: BookLaunch
  onRefreshLaunch: () => void
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'launches' | 'orders' | 'messages' | 'subscribers'>('overview')
  const [stats, setStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Launches
  const [launchesList, setLaunchesList] = useState<BookLaunch[]>([])
  const [selectedLaunchRegs, setSelectedLaunchRegs] = useState<any[] | null>(null)
  const [selectedLaunchTitle, setSelectedLaunchTitle] = useState('')
  const [showNewLaunchModal, setShowNewLaunchModal] = useState(false)
  const [newLaunchTitle, setNewLaunchTitle] = useState('')
  const [newLaunchAuthor, setNewLaunchAuthor] = useState('Dr Elvis Justice Bedi')
  const [newLaunchTagline, setNewLaunchTagline] = useState('Process over profit.\nWin in the mind first.')
  const [newLaunchDate, setNewLaunchDate] = useState('2026-11-06T09:00')
  const [newLaunchThemes, setNewLaunchThemes] = useState('Emotional discipline, Process over outcome, Managing psychology, Building consistency')
  const [newLaunchCover, setNewLaunchCover] = useState('/practical-trading-psychology.png')
  const [newLaunchDesc, setNewLaunchDesc] = useState('A practical exploration of the mindset, discipline, and emotional control that shape a trader\'s journey.')
  const [newLaunchActive, setNewLaunchActive] = useState(true)

  // Edit Launch State
  const [showEditLaunchModal, setShowEditLaunchModal] = useState(false)
  const [editLaunchId, setEditLaunchId] = useState('')
  const [editLaunchTitle, setEditLaunchTitle] = useState('')
  const [editLaunchAuthor, setEditLaunchAuthor] = useState('')
  const [editLaunchAuthorBio, setEditLaunchAuthorBio] = useState('')
  const [editLaunchAuthorImage, setEditLaunchAuthorImage] = useState('')
  const [editLaunchTagline, setEditLaunchTagline] = useState('')
  const [editLaunchIntro, setEditLaunchIntro] = useState('')
  const [editLaunchDesc, setEditLaunchDesc] = useState('')
  const [editLaunchThemes, setEditLaunchThemes] = useState('')
  const [editLaunchCover, setEditLaunchCover] = useState('')
  const [editLaunchDate, setEditLaunchDate] = useState('')
  const [editLaunchActive, setEditLaunchActive] = useState(true)
  const [savingLaunch, setSavingLaunch] = useState(false)

  // Books
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [newBookTitle, setNewBookTitle] = useState('')
  const [newBookAuthor, setNewBookAuthor] = useState('Dr Elvis Justice Bedi')
  const [newBookCategory, setNewBookCategory] = useState('Mind & Money')
  const [newBookPrice, setNewBookPrice] = useState('$24.00')
  const [newBookDesc, setNewBookDesc] = useState('')
  const [newBookCover, setNewBookCover] = useState('')
  const [newBookPdf, setNewBookPdf] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Data lists
  const [ordersList, setOrdersList] = useState<any[]>([])
  const [messagesList, setMessagesList] = useState<any[]>([])
  const [subscribersList, setSubscribersList] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  // Fetch admin stats and collections
  const loadAdminData = async () => {
    setLoadingData(true)
    try {
      const [statsRes, launchesRes, ordersRes, messagesRes, subsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/launches'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/messages'),
        fetch('/api/admin/subscribers'),
      ])

      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.stats)
        setRecentActivity(statsData.recentActivity || [])
      }

      const launchesData = await launchesRes.json()
      if (launchesData.success) {
        setLaunchesList(launchesData.launches || [])
      }

      const ordersData = await ordersRes.json()
      if (ordersData.success) setOrdersList(ordersData.orders || [])

      const messagesData = await messagesRes.json()
      if (messagesData.success) setMessagesList(messagesData.messages || [])

      const subsData = await subsRes.json()
      if (subsData.success) setSubscribersList(subsData.subscribers || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  // Cloudinary image upload helper
  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrlCallback: (url: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setUrlCallback(data.url)
        showToast('Image uploaded to Cloudinary successfully!')
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle Book Creation
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBookTitle || !newBookPrice) return
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBookTitle,
          author: newBookAuthor,
          category: newBookCategory,
          price: newBookPrice.startsWith('$') ? newBookPrice : `$${newBookPrice}`,
          description: newBookDesc,
          image: newBookCover || '/practical-trading-psychology.png',
          pdf_url: newBookPdf,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Book "${newBookTitle}" added to collection!`)
        setShowAddBookModal(false)
        setNewBookTitle('')
        setNewBookDesc('')
        setNewBookCover('')
        setNewBookPdf('')
        onRefreshBooks()
        loadAdminData()
      } else {
        alert(data.error || 'Failed to add book')
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  // Handle Book Deletion
  const handleDeleteBook = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast(`Book "${title}" deleted.`)
        onRefreshBooks()
        loadAdminData()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  // Open Edit Launch Modal with prefilled data
  const openEditLaunchModal = (launch: BookLaunch) => {
    setEditLaunchId(launch.id)
    setEditLaunchTitle(launch.title || '')
    setEditLaunchAuthor(launch.author || 'Dr Elvis Justice Bedi')
    setEditLaunchAuthorBio(launch.author_bio || '')
    setEditLaunchAuthorImage(launch.author_image || '/elvis.jpeg')
    setEditLaunchTagline(launch.tagline || '')
    setEditLaunchIntro(launch.intro || '')
    setEditLaunchDesc(launch.description || '')
    const themesStr = Array.isArray(launch.themes)
      ? launch.themes.join(', ')
      : typeof launch.themes === 'string'
      ? (() => {
          try {
            const parsed = JSON.parse(launch.themes)
            return Array.isArray(parsed) ? parsed.join(', ') : launch.themes
          } catch {
            return launch.themes
          }
        })()
      : ''
    setEditLaunchThemes(themesStr)
    setEditLaunchCover(launch.cover_image || '')
    try {
      const d = new Date(launch.launch_date)
      if (!isNaN(d.getTime())) {
        const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
        setEditLaunchDate(localIso)
      } else {
        setEditLaunchDate('2026-11-06T09:00')
      }
    } catch {
      setEditLaunchDate('2026-11-06T09:00')
    }
    setEditLaunchActive(Boolean(launch.is_active))
    setShowEditLaunchModal(true)
  }

  // Handle Launch Creation
  const handleCreateLaunch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLaunchTitle || !newLaunchDate) return

    const themesArray = newLaunchThemes.split(',').map((t) => t.trim()).filter(Boolean)

    try {
      const res = await fetch('/api/admin/launches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLaunchTitle,
          author: newLaunchAuthor,
          tagline: newLaunchTagline,
          intro: newLaunchDesc,
          description: newLaunchDesc,
          themes: themesArray,
          cover_image: newLaunchCover || '/practical-trading-psychology.png',
          launch_date: new Date(newLaunchDate).toISOString(),
          is_active: newLaunchActive,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`New Book Launch "${newLaunchTitle}" created and activated!`)
        setShowNewLaunchModal(false)
        onRefreshLaunch()
        loadAdminData()
      } else {
        alert(data.error || 'Failed to create launch')
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  // Handle Launch Update (Edit active or existing launch)
  const handleUpdateLaunch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editLaunchTitle || !editLaunchDate || !editLaunchId) return

    setSavingLaunch(true)
    const themesArray = editLaunchThemes.split(',').map((t) => t.trim()).filter(Boolean)

    try {
      const res = await fetch('/api/admin/launches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editLaunchId,
          title: editLaunchTitle,
          author: editLaunchAuthor,
          author_bio: editLaunchAuthorBio,
          author_image: editLaunchAuthorImage || '/elvis.jpeg',
          tagline: editLaunchTagline,
          intro: editLaunchIntro || editLaunchDesc,
          description: editLaunchDesc,
          themes: themesArray,
          cover_image: editLaunchCover || '/practical-trading-psychology.png',
          launch_date: new Date(editLaunchDate).toISOString(),
          is_active: editLaunchActive,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Book Launch "${editLaunchTitle}" updated successfully!`)
        setShowEditLaunchModal(false)
        onRefreshLaunch()
        loadAdminData()
      } else {
        alert(data.error || 'Failed to update launch')
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update launch')
    } finally {
      setSavingLaunch(false)
    }
  }

  // Handle Launch Activation Toggle
  const handleToggleLaunch = async (launchId: string, title: string) => {
    try {
      const res = await fetch('/api/admin/launches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ launch_id: launchId, is_active: true }),
      })
      if (res.ok) {
        showToast(`"${title}" is now the active Book Launch on storefront!`)
        onRefreshLaunch()
        loadAdminData()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  // Handle Viewing Registrations for a Specific Launch
  const handleViewRegistrations = async (launchId: string, title: string) => {
    setSelectedLaunchTitle(title)
    try {
      const res = await fetch(`/api/admin/launches/${launchId}/registrations`)
      const data = await res.json()
      if (data.success) {
        setSelectedLaunchRegs(data.registrations || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Export CSV
  const exportCsv = (rows: any[], filename: string) => {
    if (!rows.length) return
    const headers = Object.keys(rows[0]).join(',')
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="admin-page section-shell">
      {toastMsg && <div className="admin-toast-banner"><CheckCircle2 /> {toastMsg}</div>}

      <div className="admin-topbar">
        <div>
          <p className="eyebrow">Serendipity / Elvis Admin Control Center</p>
          <h1>Good morning, <em>Elvis.</em></h1>
        </div>
        <div className="admin-topbar-actions">
          <button className="text-button" onClick={() => { onRefreshBooks(); onRefreshLaunch(); loadAdminData(); }}><RefreshIcon /> Refresh</button>
          <button className="button button-dark" onClick={onLogout}><LogOut /> Sign out</button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs">
        <button className={activeTab === 'overview' ? 'is-active' : ''} onClick={() => setActiveTab('overview')}><BarChart3 /> Overview</button>
        <button className={activeTab === 'books' ? 'is-active' : ''} onClick={() => setActiveTab('books')}><BookOpen /> Books ({booksList.length})</button>
        <button className={activeTab === 'launches' ? 'is-active' : ''} onClick={() => setActiveTab('launches')}><Rocket /> Book Launches ({launchesList.length})</button>
        <button className={activeTab === 'orders' ? 'is-active' : ''} onClick={() => setActiveTab('orders')}><ShoppingBag /> Orders ({ordersList.length})</button>
        <button className={activeTab === 'messages' ? 'is-active' : ''} onClick={() => setActiveTab('messages')}><Mail /> Inquiries ({messagesList.length})</button>
        <button className={activeTab === 'subscribers' ? 'is-active' : ''} onClick={() => setActiveTab('subscribers')}><Users /> Reading List ({subscribersList.length})</button>
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div className="admin-stats">
            <article>
              <span><BookOpen /></span>
              <p>Books in collection</p>
              <strong>{String(stats?.booksCount ? stats.booksCount : booksList.length).padStart(2, '0')}</strong>
              <small>Live catalog</small>
            </article>
            <article>
              <span><Users /></span>
              <p>Reader subscribers</p>
              <strong>{stats?.subscribersCount ?? subscribersList.length ?? 0}</strong>
              <small>Active reading list</small>
            </article>
            <article>
              <span><Rocket /></span>
              <p>Launch registrants</p>
              <strong>{stats?.registrationsCount ?? 0}</strong>
              <small>Launch waitlist</small>
            </article>
            <article>
              <span><ShoppingBag /></span>
              <p>Completed orders</p>
              <strong>{stats?.salesCount ?? ordersList.length ?? 0}</strong>
              <small>Automated Paystack</small>
            </article>
            <article>
              <span><span className="admin-currency">$</span></span>
              <p>Total Revenue</p>
              <strong>${Number(stats?.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              <small>Ebook sales</small>
            </article>
          </div>

          <div className="admin-content-grid">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Active Book Launch</p>
                  <h2>{activeLaunch.title}</h2>
                </div>
                <div className="admin-header-actions">
                  <button className="button button-dark btn-sm" onClick={() => openEditLaunchModal(activeLaunch)}>
                    <Settings2 /> Edit Active Launch
                  </button>
                  <button className="button button-light btn-sm" onClick={() => setActiveTab('launches')}>
                    All Launches <ArrowRight />
                  </button>
                </div>
              </div>
              <div className="active-launch-card">
                <img src={activeLaunch.cover_image} alt={activeLaunch.title} className="active-launch-thumb" />
                <div className="active-launch-body">
                  <div className="active-launch-top">
                    <span className="launch-badge">CURRENT STOREFRONT LAUNCH</span>
                    <button className="button button-light btn-sm" onClick={() => openEditLaunchModal(activeLaunch)}>
                      <Settings2 /> Edit Details
                    </button>
                  </div>
                  <h3>{activeLaunch.title}</h3>
                  <p className="launch-card-meta">Author: {activeLaunch.author} · Target: {new Date(activeLaunch.launch_date).toLocaleDateString()}</p>
                  <p className="launch-card-tagline">{activeLaunch.tagline}</p>
                  <div className="active-launch-actions">
                    <button className="button button-dark btn-sm" onClick={() => openEditLaunchModal(activeLaunch)}>
                      <Settings2 /> Update Launch Information
                    </button>
                    <button className="button button-light btn-sm" onClick={() => handleViewRegistrations(activeLaunch.id, activeLaunch.title)}>
                      <Users /> View Waitlist ({activeLaunch.registrations_count || stats?.registrationsCount || 0})
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-panel admin-activity">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">Recent Activity</p>
                  <h2>Live feed</h2>
                </div>
              </div>
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((item, idx) => (
                  <div className="activity-item" key={idx}>
                    <span>{item.type === 'order' ? <ShoppingBag /> : <Mail />}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                      <small>{item.time}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="admin-empty-sub">No recent transactions or messages recorded yet.</p>
              )}
            </section>
          </div>
        </>
      )}

      {/* TAB: BOOKS */}
      {activeTab === 'books' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Storefront Collection</p>
              <h2>Manage Books</h2>
            </div>
            <button className="button button-dark" onClick={() => setShowAddBookModal(true)}>
              <Plus /> Add new book
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title & Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Ebook / PDF Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {booksList.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <img src={book.image} alt={book.title} className="table-book-thumb" />
                    </td>
                    <td>
                      <strong>{book.title}</strong>
                      <p className="table-sub">{book.author}</p>
                    </td>
                    <td><span className="table-tag">{book.category}</span></td>
                    <td><strong>{book.price}</strong></td>
                    <td>
                      {book.pdf_url ? (
                        <a href={book.pdf_url} target="_blank" rel="noreferrer" className="table-link">
                          <Download /> PDF Attached
                        </a>
                      ) : (
                        <span className="table-sub">None</span>
                      )}
                    </td>
                    <td>
                      <button className="table-delete-btn" onClick={() => handleDeleteBook(book.id, book.title)} aria-label="Delete">
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB: LAUNCHES (DYNAMIC BOOK LAUNCH ENGINE) */}
      {activeTab === 'launches' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Dynamic Launch Controller</p>
              <h2>Manage Book Launches</h2>
            </div>
            <button className="button button-dark" onClick={() => setShowNewLaunchModal(true)}>
              <Plus /> Create New Book Launch
            </button>
          </div>

          <p className="admin-desc-note">
            Manage your book launches, customize live countdowns, update book titles, author profiles, cover artwork, and key themes across the entire storefront in real-time.
          </p>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Cover</th>
                  <th>Launch Title</th>
                  <th>Author</th>
                  <th>Launch Date</th>
                  <th>Registrants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {launchesList.map((launch) => (
                  <tr key={launch.id} className={launch.is_active ? 'row-active-launch' : ''}>
                    <td>
                      {launch.is_active ? (
                        <span className="badge-active"><Check /> ACTIVE ON STORE</span>
                      ) : (
                        <button className="text-button" onClick={() => handleToggleLaunch(launch.id, launch.title)}>
                          Set Active
                        </button>
                      )}
                    </td>
                    <td>
                      <img src={launch.cover_image} alt={launch.title} className="table-book-thumb" />
                    </td>
                    <td>
                      <strong>{launch.title}</strong>
                      <p className="table-sub">{launch.slug}</p>
                    </td>
                    <td>{launch.author}</td>
                    <td>{new Date(launch.launch_date).toLocaleDateString()}</td>
                    <td>
                      <strong>{launch.registrations_count || 0} readers</strong>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button className="button button-light btn-sm" onClick={() => openEditLaunchModal(launch)}>
                          <Settings2 /> Edit Details
                        </button>
                        <button className="button button-light btn-sm" onClick={() => handleViewRegistrations(launch.id, launch.title)}>
                          <Users /> Registrants ({launch.registrations_count || 0})
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB: ORDERS */}
      {activeTab === 'orders' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Paystack Transactions</p>
              <h2>Customer Orders</h2>
            </div>
            <button className="button button-light btn-sm" onClick={() => exportCsv(ordersList, 'serendipity-orders.csv')}>
              <Download /> Export CSV
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Items Purchased</th>
                  <th>Status</th>
                  <th>Ebook Delivery</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.length ? (
                  ordersList.map((order) => (
                    <tr key={order.id || order.reference}>
                      <td><code>{order.reference}</code></td>
                      <td>
                        <strong>{order.customer_name || 'Reader'}</strong>
                        <p className="table-sub">{order.customer_email}</p>
                      </td>
                      <td><strong>${Number(order.total_amount).toFixed(2)}</strong></td>
                      <td>
                        <span className="table-sub">
                          {Array.isArray(order.items) ? order.items.map((i: any) => `${i.title} (x${i.quantity || 1})`).join(', ') : '1 Book'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${order.status}`}>{order.status}</span>
                      </td>
                      <td>
                        {order.pdf_sent ? <span className="badge-sent"><Check /> Sent via Resend</span> : <span className="table-sub">Pending</span>}
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                      No customer orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB: INQUIRIES / CONTACT MESSAGES */}
      {activeTab === 'messages' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Contact Form Engagement</p>
              <h2>Reader Messages</h2>
            </div>
            <button className="button button-light btn-sm" onClick={() => exportCsv(messagesList, 'serendipity-messages.csv')}>
              <Download /> Export CSV
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Message Content</th>
                  <th>Received Date</th>
                </tr>
              </thead>
              <tbody>
                {messagesList.length ? (
                  messagesList.map((msg) => (
                    <tr key={msg.id}>
                      <td><strong>{msg.name}</strong></td>
                      <td><a href={`mailto:${msg.email}`} className="table-link">{msg.email}</a></td>
                      <td><p className="message-bubble">{msg.message}</p></td>
                      <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                      No reader messages received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB: READING LIST SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Newsletter Audience</p>
              <h2>Reading List Subscribers</h2>
            </div>
            <button className="button button-light btn-sm" onClick={() => exportCsv(subscribersList, 'serendipity-subscribers.csv')}>
              <Download /> Export CSV
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subscriber Email</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribersList.length ? (
                  subscribersList.map((sub, idx) => (
                    <tr key={sub.id || idx}>
                      <td>#{sub.id || idx + 1}</td>
                      <td><strong>{sub.email}</strong></td>
                      <td>{new Date(sub.created_at || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                      No newsletter subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* MODAL: ADD BOOK WITH CLOUDINARY UPLOAD */}
      {showAddBookModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Add New Book to Collection</h3>
              <button className="icon-button" onClick={() => setShowAddBookModal(false)}><X /></button>
            </div>
            <form onSubmit={handleCreateBook} className="admin-modal-form">
              <label>
                Book Title
                <input required value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} placeholder="e.g. Practical Trading Psychology" />
              </label>
              <div className="form-row-2">
                <label>
                  Author Name
                  <input required value={newBookAuthor} onChange={(e) => setNewBookAuthor(e.target.value)} />
                </label>
                <label>
                  Category
                  <input required value={newBookCategory} onChange={(e) => setNewBookCategory(e.target.value)} placeholder="e.g. Mind & Money" />
                </label>
              </div>
              <div className="form-row-2">
                <label>
                  Price
                  <input required value={newBookPrice} onChange={(e) => setNewBookPrice(e.target.value)} placeholder="$24.00" />
                </label>
                <label>
                  Downloadable Ebook / PDF URL
                  <input value={newBookPdf} onChange={(e) => setNewBookPdf(e.target.value)} placeholder="https://..." />
                </label>
              </div>
              <label>
                Description
                <textarea rows={3} value={newBookDesc} onChange={(e) => setNewBookDesc(e.target.value)} placeholder="Brief summary for catalog..." />
              </label>
              <div className="cloudinary-upload-box">
                <label className="cloudinary-label">
                  <UploadCloud /> Upload Cover to Cloudinary
                  <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, setNewBookCover)} />
                </label>
                {uploadingImage && <p className="uploading-text"><Loader2 className="animate-spin" /> Uploading to Cloudinary CDN...</p>}
                {newBookCover && (
                  <div className="cover-preview-row">
                    <img src={newBookCover} alt="Cover preview" className="cover-preview-img" />
                    <span>{newBookCover.slice(0, 45)}...</span>
                  </div>
                )}
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowAddBookModal(false)}>Cancel</button>
                <button type="submit" className="button button-dark">Save Book <ArrowRight /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BOOK LAUNCH (UPDATE ACTIVE LAUNCH DETAILS) */}
      {showEditLaunchModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Launch Editor</p>
                <h3>Edit Book Launch Details</h3>
              </div>
              <button className="icon-button" onClick={() => setShowEditLaunchModal(false)}><X /></button>
            </div>
            <form onSubmit={handleUpdateLaunch} className="admin-modal-form">
              <label>
                Launch Title
                <input required value={editLaunchTitle} onChange={(e) => setEditLaunchTitle(e.target.value)} placeholder="e.g. Practical Trading Psychology" />
              </label>
              <div className="form-row-2">
                <label>
                  Author Name
                  <input required value={editLaunchAuthor} onChange={(e) => setEditLaunchAuthor(e.target.value)} />
                </label>
                <label>
                  Launch Date & Time (Countdown Target)
                  <input required type="datetime-local" value={editLaunchDate} onChange={(e) => setEditLaunchDate(e.target.value)} />
                </label>
              </div>
              <label>
                Author Bio
                <textarea rows={2} value={editLaunchAuthorBio} onChange={(e) => setEditLaunchAuthorBio(e.target.value)} placeholder="Author biography..." />
              </label>
              <div className="cloudinary-upload-box">
                <label className="cloudinary-label">
                  <UploadCloud /> Upload Author Photo (Cloudinary)
                  <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, setEditLaunchAuthorImage)} />
                </label>
                {editLaunchAuthorImage && (
                  <div className="cover-preview-row">
                    <img src={editLaunchAuthorImage} alt="Author preview" className="cover-preview-img" style={{ borderRadius: '50%' }} />
                    <span>{editLaunchAuthorImage.slice(0, 45)}...</span>
                  </div>
                )}
              </div>
              <label>
                Tagline (appears in hero & launch countdown banner)
                <textarea rows={2} value={editLaunchTagline} onChange={(e) => setEditLaunchTagline(e.target.value)} placeholder="Process over profit.&#10;Win in the mind first." />
              </label>
              <label>
                Key Takeaways / Themes (comma-separated)
                <input value={editLaunchThemes} onChange={(e) => setEditLaunchThemes(e.target.value)} placeholder="Emotional discipline, Process over outcome, Managing psychology, Building consistency" />
              </label>
              <label>
                About Book Description
                <textarea rows={3} value={editLaunchDesc} onChange={(e) => setEditLaunchDesc(e.target.value)} placeholder="Detailed description of the book..." />
              </label>
              <div className="cloudinary-upload-box">
                <label className="cloudinary-label">
                  <UploadCloud /> Upload Book Cover to Cloudinary
                  <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, setEditLaunchCover)} />
                </label>
                {uploadingImage && <p className="uploading-text"><Loader2 className="animate-spin" /> Uploading to Cloudinary CDN...</p>}
                {editLaunchCover && (
                  <div className="cover-preview-row">
                    <img src={editLaunchCover} alt="Cover preview" className="cover-preview-img" />
                    <span>{editLaunchCover.slice(0, 45)}...</span>
                  </div>
                )}
              </div>
              <label className="checkbox-label admin-checkbox">
                <input type="checkbox" checked={editLaunchActive} onChange={(e) => setEditLaunchActive(e.target.checked)} />
                <span>Keep as ACTIVE Book Launch on the live storefront</span>
              </label>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowEditLaunchModal(false)} disabled={savingLaunch}>Cancel</button>
                <button type="submit" className="button button-dark" disabled={savingLaunch}>
                  {savingLaunch ? <><Loader2 className="animate-spin" /> Saving...</> : <>Save Changes <ArrowRight /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW BOOK LAUNCH (DYNAMIC LAUNCH ENGINE) */}
      {showNewLaunchModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Create Dynamic Book Launch</h3>
              <button className="icon-button" onClick={() => setShowNewLaunchModal(false)}><X /></button>
            </div>
            <form onSubmit={handleCreateLaunch} className="admin-modal-form">
              <label>
                Launch Title
                <input required value={newLaunchTitle} onChange={(e) => setNewLaunchTitle(e.target.value)} placeholder="e.g. Practical Trading Psychology" />
              </label>
              <div className="form-row-2">
                <label>
                  Author Name
                  <input required value={newLaunchAuthor} onChange={(e) => setNewLaunchAuthor(e.target.value)} />
                </label>
                <label>
                  Launch Date & Time (Countdown Target)
                  <input required type="datetime-local" value={newLaunchDate} onChange={(e) => setNewLaunchDate(e.target.value)} />
                </label>
              </div>
              <label>
                Tagline (appears in header strip & hero)
                <textarea rows={2} value={newLaunchTagline} onChange={(e) => setNewLaunchTagline(e.target.value)} />
              </label>
              <label>
                Themes (comma-separated for key takeaways grid)
                <input value={newLaunchThemes} onChange={(e) => setNewLaunchThemes(e.target.value)} placeholder="Emotional discipline, Process over outcome, Managing psychology" />
              </label>
              <label>
                About Book Description
                <textarea rows={3} value={newLaunchDesc} onChange={(e) => setNewLaunchDesc(e.target.value)} />
              </label>
              <div className="cloudinary-upload-box">
                <label className="cloudinary-label">
                  <UploadCloud /> Upload Launch Cover to Cloudinary
                  <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, setNewLaunchCover)} />
                </label>
                {uploadingImage && <p className="uploading-text"><Loader2 className="animate-spin" /> Uploading to Cloudinary CDN...</p>}
                {newLaunchCover && (
                  <div className="cover-preview-row">
                    <img src={newLaunchCover} alt="Cover preview" className="cover-preview-img" />
                    <span>{newLaunchCover.slice(0, 45)}...</span>
                  </div>
                )}
              </div>
              <label className="checkbox-label admin-checkbox">
                <input type="checkbox" checked={newLaunchActive} onChange={(e) => setNewLaunchActive(e.target.checked)} />
                <span>Immediately set as the ACTIVE Book Launch on the live storefront</span>
              </label>
              <div className="admin-modal-actions">
                <button type="button" className="text-button" onClick={() => setShowNewLaunchModal(false)}>Cancel</button>
                <button type="submit" className="button button-dark">Create & Deploy Launch <ArrowRight /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: VIEW LAUNCH REGISTRANTS */}
      {selectedLaunchRegs !== null && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card wide-modal">
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Launch Registrations</p>
                <h3>{selectedLaunchTitle} ({selectedLaunchRegs.length} Readers)</h3>
              </div>
              <div className="admin-header-actions">
                <button className="button button-light btn-sm" onClick={() => exportCsv(selectedLaunchRegs, `${selectedLaunchTitle}-registrants.csv`)}>
                  <Download /> Export CSV
                </button>
                <button className="icon-button" onClick={() => setSelectedLaunchRegs(null)}><X /></button>
              </div>
            </div>
            <div className="admin-table-wrap">
              {selectedLaunchRegs.length ? (
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Reader Name</th>
                      <th>Email Address</th>
                      <th>Phone</th>
                      <th>Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLaunchRegs.map((r, i) => (
                      <tr key={r.id || i}>
                        <td>{i + 1}</td>
                        <td><strong>{r.name}</strong></td>
                        <td><a href={`mailto:${r.email}`} className="table-link">{r.email}</a></td>
                        <td>{r.phone || 'N/A'}</td>
                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="admin-empty-sub">No readers registered for this launch yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <button className="admin-storefront-link" onClick={() => onNavigate('home')}><ArrowLeft /> Back to storefront</button>
    </main>
  )
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  )
}

/* =========================================================================
   ROOT CLIENT STOREFRONT
   ========================================================================= */

export default function BookstoreClient() {
  const [page, setPage] = useState('home')
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<{ book: Book; quantity: number }[]>([])
  const [booksList, setBooksList] = useState<Book[]>(DEFAULT_BOOKS)
  const [activeLaunch, setActiveLaunch] = useState<BookLaunch>(DEFAULT_LAUNCH)
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const [orderSuccessRef, setOrderSuccessRef] = useState('')

  // Fetch dynamic books and active launch from API
  const refreshBooks = async () => {
    try {
      const res = await fetch('/api/books')
      const data = await res.json()
      if (data.success && Array.isArray(data.books) && data.books.length > 0) {
        setBooksList(data.books)
      }
    } catch {
      // Use fallback
    }
  }

  const refreshLaunch = async () => {
    try {
      const res = await fetch('/api/launch/active')
      const data = await res.json()
      if (data.success && data.launch) {
        setActiveLaunch(data.launch)
      }
    } catch {
      // Use fallback
    }
  }

  useEffect(() => {
    refreshBooks()
    refreshLaunch()

    // Initialize database in background
    fetch('/api/init').catch(() => { })

    // Check payment return params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref') || params.get('reference')
      if (params.get('payment_success') || params.get('paystack_mock_success')) {
        if (ref) {
          setOrderSuccessRef(ref)
          // Clear cart upon successful order
          setCart([])
        }
      }
    }

    // Global image protection: prevent right-click context menu and drag-to-download
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'IMG' || target.closest('img, .book-cover, .hero-banner-frame, .author-photo-frame, .card-cover-wrap, .author-launch-photo-frame, .author-bio-photo-frame, .author-detail-photo-frame, .table-book-thumb, .active-launch-thumb'))) {
        e.preventDefault()
        return false
      }
    }

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'IMG' || target.closest('img, .book-cover, .hero-banner-frame, .author-photo-frame, .card-cover-wrap, .author-launch-photo-frame, .author-bio-photo-frame, .author-detail-photo-frame, .table-book-thumb, .active-launch-thumb'))) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('contextmenu', handleContextMenu, { capture: true })
    document.addEventListener('dragstart', handleDragStart, { capture: true })

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      document.removeEventListener('dragstart', handleDragStart, { capture: true })
    }
  }, [])

  const addToCart = (book: Book) => {
    setCart((current) => {
      const existing = current.find((item) => item.book.id === book.id)
      return existing
        ? current.map((item) => (item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...current, { book, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((current) =>
      quantity < 1 ? current.filter((item) => item.book.id !== id) : current.map((item) => (item.book.id === id ? { ...item, quantity } : item))
    )
  }

  const onNavigate = (id: string) => {
    setPage(id === 'books' || id === 'launch' || id === 'about' || id === 'contact' || id === 'admin-login' || id === 'admin' || id.startsWith('details:') ? id : 'home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedBook = page.startsWith('details:') ? booksList.find((book) => book.id === page.slice(8)) : undefined

  if (page === 'admin-login') {
    return <AdminLogin onNavigate={onNavigate} onLogin={() => { setAdminAuthenticated(true); onNavigate('admin') }} />
  }

  if (page === 'admin') {
    return adminAuthenticated ? (
      <AdminDashboard
        onNavigate={onNavigate}
        onLogout={() => { setAdminAuthenticated(false); onNavigate('admin-login') }}
        booksList={booksList}
        onRefreshBooks={refreshBooks}
        activeLaunch={activeLaunch}
        onRefreshLaunch={refreshLaunch}
      />
    ) : (
      <AdminLogin onNavigate={onNavigate} onLogin={() => { setAdminAuthenticated(true); onNavigate('admin') }} />
    )
  }

  return (
    <>
      {orderSuccessRef && (
        <div className="payment-success-banner">
          <div className="section-shell success-inner">
            <CheckCircle2 />
            <div>
              <strong>Payment Successful! Order #{orderSuccessRef}</strong>
              <p>Your digital books and download links have been delivered to your email address via Resend.</p>
            </div>
            <button className="icon-button" onClick={() => setOrderSuccessRef('')}><X /></button>
          </div>
        </div>
      )}

      <Nav
        page={page}
        onNavigate={onNavigate}
        onCart={() => setCartOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <div className="cart-trigger">
        <button className="icon-button bag-button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag, ${cart.reduce((sum, item) => sum + item.quantity, 0)} items`}>
          <ShoppingBag />
          <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>
      </div>

      {page === 'home' && <Home booksList={booksList} launch={activeLaunch} onNavigate={onNavigate} onAdd={addToCart} />}
      {page === 'books' && <Catalog booksList={booksList} onNavigate={onNavigate} onAdd={addToCart} />}
      {selectedBook && <BookDetails book={selectedBook} onBack={() => onNavigate('books')} onAdd={addToCart} onNavigate={onNavigate} booksList={booksList} />}
      {page === 'launch' && <Launch launch={activeLaunch} onNavigate={onNavigate} />}
      {page === 'about' && <About onNavigate={onNavigate} />}
      {page === 'contact' && <Contact />}

      <Footer onNavigate={onNavigate} />

      {cartOpen && (
        <Cart
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={(id) => updateQuantity(id, 0)}
          onChange={updateQuantity}
        />
      )}
    </>
  )
}
