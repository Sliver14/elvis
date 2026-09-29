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

export type BookFormat =
  | 'digital_ebook'
  | 'audiobook'
  | 'printed_hardcover'
  | 'printed_paperback'
  | 'collectors_bundle'

export type PaymentMethodType =
  | 'bank_transfer'
  | 'mtn_momo'
  | 'vodafone_momo'
  | 'btc'
  | 'usdt_trc20'
  | 'usdt_erc20'
  | 'usdt_bep20'
  | 'paystack'

export type PaymentStatus =
  | 'Awaiting Payment'
  | 'Proof Submitted'
  | 'Under Review'
  | 'Confirmed'
  | 'Rejected'
  | 'Expired'
  | 'Refunded'

export type FulfilmentStatus =
  | 'Pending Payment'
  | 'Confirmed'
  | 'Awaiting Book Release'
  | 'Ready for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded'

export interface ShippingAddress {
  street: string
  city: string
  state?: string
  postal_code?: string
  country: string
  notes?: string
}

export interface PresaleOrder {
  id: string
  order_number: string
  access_token: string
  launch_id: string
  book_id?: string
  book_title: string
  book_format: BookFormat
  quantity: number
  unit_price: number
  shipping_fee: number
  total_amount: number
  currency: string
  payment_method: PaymentMethodType
  payment_status: PaymentStatus
  fulfilment_status: FulfilmentStatus
  customer_name: string
  customer_email: string
  customer_phone?: string
  country?: string
  shipping_address?: ShippingAddress | null
  notes?: string
  rejection_reason?: string
  tracking_reference?: string
  courier_name?: string
  pdf_sent?: boolean
  items?: any
  created_at: string
  updated_at: string
}

export interface PaymentProof {
  id: number
  order_id: string
  order_number: string
  payment_method: PaymentMethodType
  reference_number?: string
  transaction_hash?: string
  sender_name_or_phone?: string
  crypto_network?: string
  amount_submitted?: number
  currency?: string
  receipt_url?: string
  notes?: string
  status: 'Under Review' | 'Verified' | 'Rejected'
  submitted_at: string
  reviewed_by?: string
  reviewed_at?: string
  rejection_reason?: string
}

export interface BankPaymentConfig {
  enabled: boolean
  bank_name: string
  account_name: string
  account_number: string
  routing_or_sort_code?: string
  swift_bic?: string
  currency: string
  instructions: string
}

export interface MobileMoneyConfig {
  enabled: boolean
  provider_name: string
  account_name: string
  phone_or_merchant_id: string
  country: string
  currency: string
  instructions: string
}

export interface CryptoConfig {
  enabled: boolean
  wallet_address: string
  network: string
  network_name: string
  instructions: string
  usd_rate?: number
}

export interface USDTConfig {
  enabled: boolean
  trc20_address: string
  erc20_address: string
  bep20_address: string
  instructions: string
}

export interface FormatPricing {
  format: BookFormat
  name: string
  description: string
  price: number
  currency: string
  is_physical: boolean
  available: boolean
}

export interface PaymentSettings {
  presale_active: boolean
  expected_release_date: string
  early_delivery_enabled: boolean
  shipping_fee_domestic: number
  shipping_fee_international: number
  currency: string
  formats: FormatPricing[]
  bank: BankPaymentConfig
  mtn_momo: MobileMoneyConfig
  vodafone_momo: MobileMoneyConfig
  btc: CryptoConfig
  usdt: USDTConfig
}

export interface PreviewChapter {
  id: string
  chapter_number: string
  title: string
  subtitle?: string
  read_time: string
  excerpt_badge?: string
  content: string // Rich markdown/html text
  key_takeaways?: string[]
}

export interface BookPreview {
  id: string
  slug: string
  title: string
  author: string
  tagline?: string
  cover_image: string
  is_published: boolean
  chapters: PreviewChapter[]
  updated_at: string
}

export interface AdminAuditLog {
  id: number
  admin_email: string
  action: string
  entity_type: string
  entity_id: string
  details: Record<string, any>
  created_at: string
}

export interface BookEntitlement {
  id: number
  order_id: string
  order_number: string
  customer_email: string
  download_token: string
  download_count: number
  max_downloads: number
  last_downloaded_at?: string
  is_revoked: boolean
  created_at: string
}

export const DEFAULT_BOOKS: Book[] = []

export const DEFAULT_LAUNCH: BookLaunch = {
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

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  presale_active: true,
  expected_release_date: '2026-11-06T09:00:00+01:00',
  early_delivery_enabled: false,
  shipping_fee_domestic: 10.00,
  shipping_fee_international: 25.00,
  currency: 'USD',
  formats: [
    {
      format: 'digital_ebook',
      name: 'Ebook / PDF Edition',
      description: 'Complete high-definition digital eBook (PDF & EPUB). Delivered directly to your inbox upon official release.',
      price: 22.00,
      currency: 'USD',
      is_physical: false,
      available: true,
    },
    {
      format: 'audiobook',
      name: 'Audiobook Edition',
      description: 'Studio narrated audio masterclass edition with full chapter commentary and mindset exercises.',
      price: 28.00,
      currency: 'USD',
      is_physical: false,
      available: true,
    },
    {
      format: 'printed_hardcover',
      name: 'Hard Copy Edition',
      description: 'Executive clothbound hardcover with embossed gold foil lettering, delivered directly to your doorstep.',
      price: 45.00,
      currency: 'USD',
      is_physical: true,
      available: true,
    },
  ],
  bank: {
    enabled: false,
    bank_name: 'Standard Chartered Bank / Zenith Bank',
    account_name: 'MUZAKIR\'S ENTERPRISE',
    account_number: '0100234891100',
    routing_or_sort_code: 'SCBLGHAC',
    swift_bic: 'SCBLGHACXXX',
    currency: 'USD / GHS',
    instructions: 'Please initiate a wire or bank transfer for the exact total amount. Use your unique Order Reference Number as the transfer narrative/memo. Once transfer is completed, upload your transfer receipt below.',
  },
  mtn_momo: {
    enabled: true,
    provider_name: 'MTN Mobile Money',
    account_name: 'MUZAKIR\'S ENTERPRISE',
    phone_or_merchant_id: '0597433167',
    country: 'Ghana / West Africa',
    currency: 'GHS',
    instructions: 'Send money to MTN MoMo line: 0597433167 (MUZAKIR\'S ENTERPRISE). Enter your unique Order Number in the Reference field. Submit the Transaction ID or screenshot after sending.',
  },
  vodafone_momo: {
    enabled: true,
    provider_name: 'Vodafone Cash / Telecel Cash',
    account_name: 'MUZAKIR\'S ENTERPRISE',
    phone_or_merchant_id: '339042',
    country: 'Ghana',
    currency: 'GHS',
    instructions: 'Send payment to Vodafone / Telecel Cash Till No: 339042 (MUZAKIR\'S ENTERPRISE). Include your Order Number in reference notes. Submit the transaction ID or screenshot after sending.',
  },
  btc: {
    enabled: true,
    wallet_address: '1kPLHZutsrkFsf9DoTPuhDkQs6uKaTvb1',
    network: 'BTC',
    network_name: 'Bitcoin Mainnet',
    instructions: 'Send the exact amount in BTC to our verified Bitcoin Mainnet address: 1kPLHZutsrkFsf9DoTPuhDkQs6uKaTvb1. Copy the transaction hash (TxID) from your wallet and paste it below after broadcasting.',
  },
  usdt: {
    enabled: true,
    trc20_address: 'TM9Nhjsonrw5f15ePBoJG6cXpw5xZ5aggb',
    erc20_address: '',
    bep20_address: '',
    instructions: 'Send USDT via TRON (TRC20) network to our official address: TM9Nhjsonrw5f15ePBoJG6cXpw5xZ5aggb. Verify the selected network before transferring. Submit the Transaction Hash (TxID) below.',
  },
}

export const DEFAULT_BOOK_PREVIEW: BookPreview = {
  id: 'preview-practical-trading-psychology',
  slug: 'practical-trading-psychology',
  title: 'Practical Trading Psychology',
  author: 'Dr Elvis Justice Bedi',
  tagline: 'Process over profit. Win in the mind first.',
  cover_image: '/practical-trading-psychology.png',
  is_published: true,
  updated_at: new Date().toISOString(),
  chapters: [
    {
      id: 'preface',
      chapter_number: 'Author’s Preface',
      title: 'Trapped Between Ambition and Reality',
      subtitle: 'Who this book was written for and why the mind behind the trade matters most',
      read_time: '4 min read',
      excerpt_badge: 'Author’s Introduction',
      content: `### Who This Book Was Written For

I wrote this book for the trader who has ever felt trapped between ambition and reality.

For the trader who has studied the charts, learned the strategies, followed the rules, and still struggled to produce consistent results.

For the trader who knows what they are supposed to do—but somehow keeps doing the opposite when real money is on the line.

For the trader starting with a small account, limited capital, limited time, and a dream that feels much bigger than their current circumstances.

### The Illusion of Charts and Indicators

Trading is often presented as a game of charts, indicators, strategies, and technical analysis.

But beneath all of that is something far more difficult to master:
- You.
- Your emotions.
- Your impulses.
- Your fears.
- Your expectations.
- Your relationship with money.
- Your ability to remain disciplined when the market is moving against you.
- And your ability to remain disciplined when everything appears to be going your way.

> "This is not another book promising a secret strategy, a perfect indicator, or a guaranteed path to profitability. It is not about predicting every market move or finding the perfect entry."

### The Mind Behind the Trade

And it is certainly not about convincing yourself that you can simply “manifest” success.

This book is about the part of trading that most traders underestimate: the mind behind the trade.

Because knowing what to do and actually doing it are two completely different skills.`,
      key_takeaways: [
        'Trading is not merely charts and indicators—it is the mastery of the mind behind the trade.',
        'Knowing what to do and actually doing it under pressure are two completely different skills.',
        'Success cannot be manifested; it requires mastering your emotions and impulses.'
      ]
    },
    {
      id: 'chapter-1',
      chapter_number: 'Chapter 01',
      title: 'The Real Battle: Why Traders Lose Discipline',
      subtitle: 'Understanding destructive cycles, emotional triggers, and account erosion',
      read_time: '5 min read',
      excerpt_badge: 'Approved Excerpt',
      content: `### Where the Real Battle Begins

You can have a profitable strategy and still lose money because you overtrade.

You can understand risk management and still increase your position after a loss because you desperately want to recover.

You can have a trading plan and abandon it the moment fear takes over.

You can spend years studying the markets and remain inconsistent because your emotions keep overriding your knowledge.

That is where the real battle begins.

### How Accounts Are Actually Destroyed

The market does not need to destroy your account in one trade. Sometimes it happens gradually:
- One impulsive entry.
- One revenge trade.
- One oversized position.
- One decision made from fear.
- One attempt to recover yesterday's loss today.

And eventually, a trader who started with a plan finds themselves trading emotionally, reacting instead of thinking, and hoping instead of executing.

> "The problem is rarely just the losing trade. The deeper problem is what the loss makes you do next."

### The Destructive Cycle

This book is for the trader who has experienced that cycle:
- The trader who has turned a small account into a meaningful profit, only to give it all back.
- The trader who keeps changing strategies because the previous one stopped working.
- The trader who takes profits too quickly but allows losses to grow.
- The trader who moves a stop-loss because they cannot accept being wrong.
- The trader who keeps entering the market after a losing streak because they believe the next trade will fix everything.
- The trader who knows discipline matters but struggles to maintain it when money, pressure, and emotion collide.`,
      key_takeaways: [
        'Accounts are rarely destroyed by market moves alone; they are destroyed by revenge trading and impulsivity.',
        'The problem is rarely the losing trade—it is what the loss makes you do next.',
        'A disciplined trader protects capital by breaking the cycle of emotional reactions.'
      ]
    },
    {
      id: 'chapter-2',
      chapter_number: 'Chapter 02',
      title: 'The Emotional Battlefield: Making Rational Decisions',
      subtitle: 'What actually works when nothing is working pragmatically',
      read_time: '6 min read',
      excerpt_badge: 'Core Manifesto',
      content: `### The Truth About Trading Psychology

Trading psychology is not about eliminating emotions.

You cannot remove fear from trading. You cannot eliminate greed. You cannot prevent disappointment. You cannot guarantee that you will never experience frustration, doubt, or hesitation.

The objective is different:
**The goal is to become capable of making rational decisions while those emotions are present.**

That requires self-awareness. It requires structure. It requires patience. It requires understanding your own patterns.

And most importantly, it requires accepting that profitability is not created by one great trade. It is built through thousands of decisions, repeated with discipline over time.

### When the Market Becomes an Emotional Battlefield

When your account is growing, psychology matters. When your account is falling, psychology matters even more.

When you are trading with money you cannot afford to lose, psychology can become the difference between following your plan and destroying it.

When you are under financial pressure, exhausted, desperate, or determined to recover a previous loss, the market can become more than a market.

It can become an emotional battlefield. And that is when your greatest enemy may no longer be volatility. It may be your own decision-making.

### A Framework for Better Decision-Making

This book is about learning to recognize that battle before it controls you. It is about understanding why you behave differently when real money is at risk.

It is about breaking destructive trading patterns, developing emotional control, managing risk intelligently, and building the discipline required to execute a strategy consistently.

You will not find a promise that every trade will win. You will not find a formula that removes uncertainty from the markets. Instead, you will find a framework for becoming a better decision-maker.

Because successful trading is not about being right all the time:
- It is about knowing how to behave when you are wrong.
- It is about protecting your capital when conditions are unfavorable.
- It is about remaining patient when there is nothing worth trading.
- It is about taking responsibility for your decisions instead of blaming the market.
- And it is about developing enough discipline to walk away when your emotions are telling you to stay.

### Control the Trader Behind the Screen

If you have ever looked at your trading history and wondered, “Why do I keep doing this to myself?”

If you have ever broken your own rules and regretted it minutes later. If you have ever watched a winning account turn into a losing one because you could not stop trading. If you have ever felt the pressure of needing the next trade to work.

Then this book was written for you.

Because before you can consistently control the market risk in front of you, you must learn to control the trader sitting behind the screen.

> "The market will always be uncertain. Your decisions don't have to be."

### What Actually Works Pragmatically

I wrote this book for everyone who’s ever stuck with nothing to give.

I wrote this book for everyone who did everything right, worked hard, followed rules or finding it hard to be consistent.

I wrote this book for someone with no capital yet with dreams of being at the top one day.

This isn’t a mindset book. It’s not just about manifesting and visualizing.

**It’s about what actually works when nothing is working pragmatically.**`,
      key_takeaways: [
        'The goal of psychology is not eliminating emotions, but making rational decisions while emotions exist.',
        'Trading success is built through thousands of disciplined decisions, not one lucky trade.',
        'Before you can control the market risk in front of you, you must control the trader behind the screen.',
        'This is not theory or manifestation—it is what actually works pragmatically when nothing else is.'
      ]
    }
  ]
}

