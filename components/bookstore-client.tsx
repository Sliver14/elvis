'use client'

import { useEffect, useMemo, useState } from 'react'
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
} from 'lucide-react'

const LAUNCH_DATE = '2026-11-06T09:00:00+01:00'

const books = [
  {
    id: 'practical-trading-psychology',
    title: 'Practical Trading Psychology',
    author: 'Dr Elvis Justice Bedi',
    category: 'Mind & Money',
    price: '$24.00',
    description: 'A thoughtful guide to the emotional discipline and clear process behind better trading decisions.',
    bio: 'Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.',
    image: '/practical-trading-psychology.png',
    featured: true,
  },
  {
    id: 'the-art-of-attention',
    title: 'The Art of Attention',
    author: 'Mara Linde',
    category: 'Mindfulness',
    price: '$19.00',
    description: 'A quiet invitation to notice more, do less, and make room for what matters.',
    bio: 'Mara Linde writes about attention, rest, and the small rituals that help us return to ourselves. She lives between long walks, marked-up notebooks, and quiet rooms.',
    image: '/practical-trading-psychology.png',
  },
  {
    id: 'small-courage',
    title: 'Small Courage',
    author: 'Jonas Vale',
    category: 'Personal Growth',
    price: '$21.00',
    description: 'Notes on showing up for the meaningful work, one ordinary day at a time.',
    bio: 'Jonas Vale is an essayist and teacher interested in creative practice, resilience, and the courage found in ordinary routines. He writes from a small studio by the sea.',
    image: '/practical-trading-psychology.png',
  },
]

function Cover({ book, className = '' }: { book: typeof books[number]; className?: string }) {
  return (
    <div className={`book-cover ${className}`}>
      <img src={book.image} alt={`${book.title} book cover`} />
    </div>
  )
}

function Countdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(LAUNCH_DATE).getTime() - Date.now()))
  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(Math.max(0, new Date(LAUNCH_DATE).getTime() - Date.now())), 1000)
    return () => window.clearInterval(interval)
  }, [])
  const values = useMemo(() => {
    const total = Math.floor(remaining / 1000)
    return [Math.floor(total / 86400), Math.floor((total % 86400) / 3600), Math.floor((total % 3600) / 60), total % 60]
  }, [remaining])
  if (!remaining) return <p className="launch-live">The book is now available.</p>
  return <div className="countdown" aria-label="Time until book launch">{values.map((value, index) => <div className="countdown-unit" key={index}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][index]}</span></div>)}</div>
}

function Nav({ page, onNavigate, onCart, cartCount }: { page: string; onNavigate: (id: string) => void; onCart: () => void; cartCount: number }) {
  const [open, setOpen] = useState(false)
  const navigate = (id: string) => { onNavigate(id); setOpen(false) }
  const activePage = page.startsWith('details:') ? 'books' : page
  const navItems = [['home', 'Home'], ['books', 'Books'], ['launch', 'Book launch'], ['about', 'About'], ['contact', 'Contact']] as const
  return <header className="site-header"><div className="header-inner"><button className="wordmark" onClick={() => navigate('home')} aria-label="Go home"><span className="wordmark-mark">S</span><span>SERENDIPITY</span></button><nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">{navItems.map(([id, label]) => <button key={id} className={activePage === id ? 'is-active' : ''} aria-current={activePage === id ? 'page' : undefined} onClick={() => navigate(id)}>{label}</button>)}</nav><div className="header-actions"><button className="icon-button" aria-label="Search"><Search /></button><button className="icon-button bag-button" onClick={onCart} aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag /><span>{cartCount}</span></button><button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></div></div></header>
}

function Newsletter() {
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false)
  return <section className="newsletter"><div><p className="eyebrow">The reading list</p><h2>A little more <em>thoughtfully.</em></h2><p>New releases, considered recommendations, and notes from the world of books. Once a month, never noisy.</p></div>{sent ? <div className="newsletter-success"><Check /> You&apos;re on the list.</div> : <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true) }}><label htmlFor="newsletter-email" className="sr-only">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} /><button className="button button-dark" type="submit">Subscribe <ArrowRight /></button></form>}</section>
}

function Home({ onNavigate, onAdd }: { onNavigate: (id: string) => void; onAdd: (book: typeof books[number]) => void }) {
  return <><main id="home"><section className="hero section-shell"><div className="hero-copy"><p className="eyebrow">Independent books for considered lives</p><h1>Books to help you <em>think</em> better.</h1><p className="hero-intro">Serendipity is a modern bookstore for ideas with staying power. Discover books that meet you where you are — and take you somewhere new.</p><div className="hero-actions"><button className="button button-dark" onClick={() => onNavigate('books')}>Explore the collection <ArrowRight /></button><button className="text-button" onClick={() => onNavigate('launch')}>Discover the launch <ArrowRight /></button></div></div><div className="hero-art"><div className="hero-note">EST. 2026</div><Cover book={books[0]} className="hero-cover" /><div className="hero-caption"><span>Featured title</span><strong>Practical Trading Psychology</strong></div></div></section><section className="launch-strip"><div className="section-shell launch-strip-inner"><div><p className="eyebrow">Coming soon</p><h2>Practical Trading Psychology</h2><p>Process over profit. Win in the mind first.</p></div><div className="launch-date"><Clock3 /><span>Launching November 2026</span></div><button className="button button-light" onClick={() => onNavigate('launch')}>View launch <ArrowRight /></button></div></section><section id="books" className="section-shell collection"><div className="section-heading"><div><p className="eyebrow">The collection</p><h2>Find your next <em>good read.</em></h2></div><button className="text-button" onClick={() => onNavigate('books')}>View all books <ArrowRight /></button></div><div className="book-grid">{books.map((book) => <article className="book-card" key={book.id} onClick={() => onAdd(book)}><div className="card-cover-wrap"><Cover book={book} /><span className="card-category">{book.category}</span></div><div className="book-card-meta"><h3>{book.title}</h3><p>{book.author}</p><div><span>{book.price}</span><button className="round-arrow" aria-label={`View ${book.title}`}><ArrowRight /></button></div></div></article>)}</div></section><section className="quote-band"><p className="eyebrow">A note from us</p><blockquote>“A bookstore should be a place where curiosity feels at home.”</blockquote><span>— Serendipity</span></section><Newsletter /></main><Footer onNavigate={onNavigate} /></>
}

function Catalog({ onNavigate, onAdd }: { onNavigate: (id: string) => void; onAdd: (book: typeof books[number]) => void }) {
  const [query, setQuery] = useState(''); const [category, setCategory] = useState('All books')
  const filtered = books.filter((book) => (category === 'All books' || book.category === category) && `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()))
  return <main className="section-shell catalog-page"><div className="catalog-intro"><p className="eyebrow">The bookstore</p><h1>Books for <em>curious minds.</em></h1><p>Browse a small, carefully chosen collection of books that make space for better questions.</p></div><div className="catalog-toolbar"><label className="search-field"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or author" aria-label="Search books" /></label><label className="select-field"><span className="sr-only">Filter by category</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option>All books</option><option>Mind & Money</option><option>Mindfulness</option><option>Personal Growth</option></select><ChevronDown /></label></div>{filtered.length ? <div className="book-grid catalog-grid">{filtered.map((book) => <article className="book-card" key={book.id}><div className="card-cover-wrap"><Cover book={book} /><span className="card-category">{book.category}</span></div><div className="book-card-meta"><h3>{book.title}</h3><p>{book.author}</p><p className="book-description">{book.description}</p><div className="book-card-actions"><span>{book.price}</span><button className="text-button" onClick={() => onNavigate(`details:${book.id}`)}>View details <ArrowRight /></button><button className="button button-dark add-book-button" onClick={() => onAdd(book)}><ShoppingBag /> Add to cart</button></div></div></article>)}</div> : <div className="empty-state"><Search /><h2>No books found</h2><p>Try another title, author, or category.</p></div>}</main>
}

function Launch({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [registered, setRegistered] = useState(false)
  return <main id="launch" className="launch-page"><section className="launch-hero section-shell"><div className="launch-hero-copy"><p className="eyebrow"><Sparkles /> The next release</p><h1>Practical <em>Trading</em> Psychology</h1><p className="launch-author">By Dr Elvis Justice Bedi</p><p className="launch-tagline">Process over profit.<br />Win in the mind first.</p><p className="hero-intro">A practical exploration of the mindset, discipline, emotional control, and decision-making processes that shape a trader&apos;s journey.</p><div className="hero-actions"><button className="button button-dark" onClick={() => document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth' })}>Get notified <ArrowRight /></button><button className="text-button" onClick={() => document.getElementById('about-book')?.scrollIntoView({ behavior: 'smooth' })}>Explore the book <ArrowRight /></button></div></div><div className="launch-cover-stage"><div className="stage-label">SERENDIPITY<br />FIRST EDITION</div><Cover book={books[0]} className="launch-cover" /></div></section><section className="countdown-section"><div className="section-shell countdown-inner"><div><p className="eyebrow">The launch</p><h2>Make room for a better <em>process.</em></h2></div><div><p className="countdown-note">Launching November 06, 2026 · 09:00 CET</p><Countdown /></div></div></section><section id="about-book" className="section-shell about-book"><div className="about-book-heading"><p className="eyebrow">About the book</p><h2>The mind is where every trade <em>begins.</em></h2></div><div className="about-book-copy"><p>Practical Trading Psychology explores the mindset, discipline, emotional control, and decision-making processes that shape a trader&apos;s journey.</p><p>It emphasizes the importance of mastering the mind and building a consistent process rather than being driven solely by profit.</p></div></section><section className="themes section-shell"><div className="section-heading"><div><p className="eyebrow">Inside the work</p><h2>What readers can <em>expect.</em></h2></div></div><div className="theme-grid">{['Emotional discipline', 'Process-driven decision-making', 'Managing trading psychology', 'Developing consistency', 'Building the right mindset'].map((theme, i) => <div className="theme-item" key={theme}><span>0{i + 1}</span><h3>{theme}</h3><ArrowRight /></div>)}</div></section><section className="author-section"><div className="section-shell author-inner"><div className="author-initial">E<span>B</span></div><div><p className="eyebrow">The author</p><h2>Dr Elvis <em>Justice Bedi</em></h2><p>Dr Elvis Justice Bedi is a trader, educator, and author dedicated to helping people understand the psychology behind financial decision-making. Through his work in trading and education, he explores discipline, emotional control, self-awareness, and the habits that turn uncertainty into a more thoughtful process. Practical Trading Psychology brings together his belief that lasting progress begins with mastering the mind before pursuing the outcome.</p></div></div></section><section id="notify" className="section-shell notify-section"><div className="notify-copy"><p className="eyebrow">Stay close to the launch</p><h2>Be first in line for <em>the book.</em></h2><p>Register your interest and we&apos;ll let you know when Practical Trading Psychology is available.</p></div>{registered ? <div className="registration-success"><div className="success-icon"><Check /></div><h3>You&apos;re registered.</h3><p>We&apos;ll be in touch with launch updates.</p></div> : <form className="notify-form" onSubmit={(e) => { e.preventDefault(); setRegistered(true) }}><label>Full name<input required placeholder="Your name" /></label><label>Email address<input type="email" required placeholder="you@example.com" /></label><label>Phone number <span>(optional)</span><input type="tel" placeholder="+44 ..." /></label><label className="checkbox-label"><input type="checkbox" required /><span>I agree to receive launch updates and understand I can unsubscribe at any time.</span></label><button className="button button-dark" type="submit">Notify me <ArrowRight /></button></form>}</section><section className="reserve-section"><p className="eyebrow">Almost here</p><h2>Be among the first to experience<br /><em>Practical Trading Psychology.</em></h2><button className="button button-light" onClick={() => onNavigate('launch')}>Reserve your copy <ArrowRight /></button></section></main>
}

function About({ onNavigate }: { onNavigate: (id: string) => void }) {
  return <main className="about-page"><section className="section-shell about-intro"><div><p className="eyebrow">About Serendipity</p><h1>A bookstore for <em>better questions.</em></h1></div><p className="about-lede">We believe the right book can change the quality of a person&apos;s attention. Serendipity brings together thoughtful books for curious minds, open conversations, and considered lives.</p></section><section className="section-shell about-manifesto"><div className="manifesto-number">01</div><div><p className="eyebrow">Our point of view</p><h2>Less noise.<br /><em>More staying power.</em></h2><p>We choose books with something to return to: a useful idea, a generous perspective, or a sentence that stays with you. Our collection is intentionally small, so every title earns its place.</p><button className="text-button" onClick={() => onNavigate('books')}>Explore the collection <ArrowRight /></button></div></section><section className="section-shell about-values"><div><p className="eyebrow">What guides us</p><h2>Read with <em>intention.</em></h2></div><div className="value-list"><div><span>01</span><h3>Curiosity</h3><p>We make room for questions that lead somewhere unexpected.</p></div><div><span>02</span><h3>Clarity</h3><p>We look for ideas that make the complicated feel more possible.</p></div><div><span>03</span><h3>Connection</h3><p>Books are better when they become part of a wider conversation.</p></div></div></section><section className="section-shell author-bios"><div><p className="eyebrow">The author</p><h2>Meet the <em>author.</em></h2></div><div className="author-bio-grid">{[books[0]].map((book) => <article className="author-bio" key={book.author}><div className="author-initial">{book.author.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><p className="author-number">01</p><h3>{book.author}</h3><p>{book.bio}</p><button className="text-button" onClick={() => onNavigate(`details:${book.id}`)}>Read their book <ArrowRight /></button></div></article>)}</div></section></main>
}

function Contact() {
  const [sent, setSent] = useState(false)
  return <main className="contact-page section-shell"><section className="contact-intro"><p className="eyebrow">Get in touch</p><h1>Let&apos;s start a <em>conversation.</em></h1><p>Have a question about an order, a recommendation, or a possible collaboration? We&apos;d love to hear from you.</p><a className="contact-email" href="mailto:hello@serendipity.books">hello@serendipity.books <ArrowRight /></a></section><section className="contact-form-wrap">{sent ? <div className="contact-success"><Check /><p><strong>Thank you for writing.</strong><br />We&apos;ll be in touch soon.</p></div> : <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><label>Name<input required name="name" autoComplete="name" /></label><label>Email<input required type="email" name="email" autoComplete="email" /></label><label>How can we help?<textarea required name="message" rows={5} /></label><button className="button button-dark" type="submit">Send message <ArrowRight /></button></form>}</section></main>
}

function Footer({ onNavigate }: { onNavigate: (id: string) => void }) { return <footer id="contact" className="site-footer"><div className="section-shell footer-top"><div className="footer-intro"><button className="wordmark footer-mark" onClick={() => onNavigate('home')}><span className="wordmark-mark">S</span><span>SERENDIPITY</span></button><p>A considered bookstore for curious minds, thoughtful conversations, and books worth returning to.</p><button className="footer-cta" onClick={() => onNavigate('books')}>Find your next read <ArrowRight /></button></div><div className="footer-links"><div><p className="footer-label">Explore</p><button onClick={() => onNavigate('books')}>Books</button><button onClick={() => onNavigate('launch')}>Book launch</button><button onClick={() => onNavigate('about')}>About us</button></div><div><p className="footer-label">Say hello</p><button onClick={() => onNavigate('contact')}>Get in touch</button><a href="mailto:hello@serendipity.books">hello@serendipity.books</a><p>London · Accra · Online</p></div><div><p className="footer-label">Follow along</p><div className="socials"><a href="https://www.instagram.com/elvisjusticeofficial_/" target="_blank" rel="noreferrer" aria-label="Instagram"><Camera /></a><a href="https://www.tiktok.com/@elvisjusticeofficial_" target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 /></a><a href="https://twitter.com/manofserendipty" target="_blank" rel="noreferrer" aria-label="Twitter"><AtSign /></a></div></div></div></div><div className="section-shell footer-bottom"><span>© 2026 Serendipity</span><span>Made for readers with intention.</span><span>Privacy · Terms</span><button className="footer-admin-link" onClick={() => onNavigate('admin-login')}>Admin access</button></div></footer> }

function AdminLogin({ onNavigate, onLogin }: { onNavigate: (id: string) => void; onLogin: () => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  return <main className="admin-auth-page"><div className="admin-auth-card"><div className="admin-auth-mark"><LockKeyhole /></div><p className="eyebrow">Serendipity admin</p><h1>Welcome <em>back.</em></h1><p className="admin-auth-copy">Sign in to manage your collection, launch content, and reader conversations.</p><form onSubmit={(event) => { event.preventDefault(); onLogin() }} className="admin-auth-form"><label>Email address<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@serendipity.books" /></label><label>Password<input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /></label><button className="button button-dark" type="submit">Sign in <ArrowRight /></button></form><p className="admin-demo-note">Prototype access: any valid email and 6+ character password.</p><button className="text-button" onClick={() => onNavigate('home')}><ArrowLeft /> Return to storefront</button></div></main>
}

function AdminDashboard({ onNavigate, onLogout }: { onNavigate: (id: string) => void; onLogout: () => void }) {
  return <main className="admin-page section-shell"><div className="admin-topbar"><div><p className="eyebrow">Serendipity admin</p><h1>Good morning, <em>Elvis.</em></h1></div><button className="text-button" onClick={onLogout}><LogOut /> Sign out</button></div><div className="admin-stats"><article><span><BookOpen /></span><p>Books in collection</p><strong>03</strong><small>+1 this season</small></article><article><span><Users /></span><p>Reader subscribers</p><strong>248</strong><small>+18 this month</small></article><article><span><BarChart3 /></span><p>Monthly visits</p><strong>1,842</strong><small>+12.4% from last month</small></article><article><span><ShoppingBag /></span><p>Sales this month</p><strong>126</strong><small>+22.3% from last month</small></article><article><span><span className="admin-currency">$</span></span><p>Revenue this month</p><strong>$2,964</strong><small>+18.7% from last month</small></article></div><div className="admin-content-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">Collection</p><h2>Manage books</h2></div><button className="button button-dark"><BookOpen /> Add book</button></div><div className="admin-book-list">{books.map((book) => <div className="admin-book-row" key={book.id}><Cover book={book} /><div><strong>{book.title}</strong><p>{book.author}</p></div><span>{book.price}</span><button className="icon-button" aria-label={`Edit ${book.title}`}><Settings2 /></button></div>)}</div></section><section className="admin-panel admin-activity"><div className="admin-panel-heading"><div><p className="eyebrow">Recent activity</p><h2>Keep an eye on it.</h2></div></div><div className="activity-item"><span><Mail /></span><div><strong>New contact message</strong><p>Someone reached out about a collaboration.</p><small>12 minutes ago</small></div></div><div className="activity-item"><span><Users /></span><div><strong>18 new subscribers</strong><p>Your reading list is growing steadily.</p><small>Yesterday</small></div></div></section></div><button className="admin-storefront-link" onClick={() => onNavigate('home')}><ArrowLeft /> Back to storefront</button></main>
}

function BookDetails({ book, onBack, onAdd, onNavigate }: { book: typeof books[number]; onBack: () => void; onAdd: (book: typeof books[number]) => void; onNavigate: (id: string) => void }) {
  const recommendations = books.filter((candidate) => candidate.id !== book.id)
  return <main className="section-shell detail-page"><button className="text-button" onClick={onBack}><ArrowLeft /> Back to books</button><div className="detail-layout"><Cover book={book} className="detail-cover" /><div className="detail-copy"><p className="eyebrow">{book.category}</p><h1>{book.title}</h1><p className="detail-author">By {book.author}</p><p className="detail-description">{book.description}</p><div className="detail-author-bio"><p className="eyebrow">About the author</p><p>{book.bio}</p></div><p className="detail-description">A considered edition for readers who want ideas they can return to, underline, and carry into everyday life.</p><div className="detail-purchase"><strong>{book.price}</strong><button className="button button-dark" onClick={() => onAdd(book)}><ShoppingBag /> Add to cart</button></div></div></div><section className="related-books"><div className="section-heading"><div><p className="eyebrow">Keep exploring</p><h2>You might also <em>like these.</em></h2></div><button className="text-button" onClick={onBack}>View all books <ArrowRight /></button></div><div className="book-grid related-book-grid">{recommendations.map((recommended) => <article className="book-card" key={recommended.id}><button className="related-book-cover" onClick={() => onNavigate(`details:${recommended.id}`)} aria-label={`View ${recommended.title}`}><Cover book={recommended} /></button><div className="book-card-meta"><h3>{recommended.title}</h3><p>{recommended.author}</p><div className="book-card-actions"><span>{recommended.price}</span><button className="button button-dark add-book-button" onClick={() => onAdd(recommended)}><ShoppingBag /> Add to cart</button></div></div></article>)}</div></section></main>
}

function Cart({ items, onClose, onRemove, onChange }: { items: { book: typeof books[number]; quantity: number }[]; onClose: () => void; onRemove: (id: string) => void; onChange: (id: string, quantity: number) => void }) {
  const total = items.reduce((sum, item) => sum + Number(item.book.price.replace('$', '')) * item.quantity, 0)
  return <div className="cart-panel" role="dialog" aria-modal="true" aria-label="Shopping cart"><div className="cart-header"><div><p className="eyebrow">Your selection</p><h2>Shopping bag</h2></div><button className="icon-button" onClick={onClose} aria-label="Close shopping bag"><X /></button></div>{items.length ? <><div className="cart-items">{items.map(({ book, quantity }) => <div className="cart-item" key={book.id}><Cover book={book} /><div><h3>{book.title}</h3><p>{book.price}</p><div className="quantity-control"><button onClick={() => onChange(book.id, quantity - 1)} aria-label={`Decrease ${book.title} quantity`}><Minus /></button><span>{quantity}</span><button onClick={() => onChange(book.id, quantity + 1)} aria-label={`Increase ${book.title} quantity`}><Plus /></button></div></div><button className="icon-button" onClick={() => onRemove(book.id)} aria-label={`Remove ${book.title}`}><Trash2 /></button></div>)}</div><div className="cart-footer"><div><span>Total</span><strong>${total.toFixed(2)}</strong></div><button className="button button-dark">Checkout <ArrowRight /></button></div></> : <div className="cart-empty"><ShoppingBag /><p>Your bag is waiting for a good story.</p></div>}</div>
}

export default function BookstoreClient() {
  const [page, setPage] = useState('home'); const [cartOpen, setCartOpen] = useState(false); const [cart, setCart] = useState<{ book: typeof books[number]; quantity: number }[]>([])
  const addToCart = (book: typeof books[number]) => { setCart((current) => { const existing = current.find((item) => item.book.id === book.id); return existing ? current.map((item) => item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { book, quantity: 1 }] }); setCartOpen(true) }
  const updateQuantity = (id: string, quantity: number) => setCart((current) => quantity < 1 ? current.filter((item) => item.book.id !== id) : current.map((item) => item.book.id === id ? { ...item, quantity } : item))
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const onNavigate = (id: string) => { setPage(id === 'books' || id === 'launch' || id === 'about' || id === 'contact' || id === 'admin-login' || id === 'admin' || id.startsWith('details:') ? id : 'home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const selectedBook = page.startsWith('details:') ? books.find((book) => book.id === page.slice(8)) : undefined
  if (page === 'admin-login') return <AdminLogin onNavigate={onNavigate} onLogin={() => { setAdminAuthenticated(true); onNavigate('admin') }} />
  if (page === 'admin') return adminAuthenticated ? <AdminDashboard onNavigate={onNavigate} onLogout={() => { setAdminAuthenticated(false); onNavigate('admin-login') }} /> : <AdminLogin onNavigate={onNavigate} onLogin={() => { setAdminAuthenticated(true); onNavigate('admin') }} />
  return <><Nav page={page} onNavigate={onNavigate} onCart={() => setCartOpen(true)} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} /><div className="cart-trigger"><button className="icon-button bag-button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag, ${cart.reduce((sum, item) => sum + item.quantity, 0)} items`}><ShoppingBag /><span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></button></div>{page === 'home' && <Home onNavigate={onNavigate} onAdd={addToCart} />}{page === 'books' && <Catalog onNavigate={onNavigate} onAdd={addToCart} />}{selectedBook && <BookDetails book={selectedBook} onBack={() => onNavigate('books')} onAdd={addToCart} onNavigate={onNavigate} />}{page === 'launch' && <Launch onNavigate={onNavigate} />}{page === 'about' && <About onNavigate={onNavigate} />}{page === 'contact' && <Contact />}<Footer onNavigate={onNavigate} />{cartOpen && <Cart items={cart} onClose={() => setCartOpen(false)} onRemove={(id) => updateQuantity(id, 0)} onChange={updateQuantity} />}</>
}
