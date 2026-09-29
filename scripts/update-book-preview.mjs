import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('DATABASE_URL is missing in .env.local')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function updateBookPreviewInDb() {
  console.log('Updating Book Preview in Neon DB...')

  const previewData = {
    id: 'preview-practical-trading-psychology',
    slug: 'practical-trading-psychology',
    title: 'Practical Trading Psychology',
    author: 'Dr Elvis Justice Bedi',
    tagline: 'Process over profit. Win in the mind first.',
    cover_image: '/practical-trading-psychology.png',
    is_published: true,
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

  await sql`
    INSERT INTO book_previews (id, slug, title, author, tagline, cover_image, is_published, chapters, updated_at)
    VALUES (
      ${previewData.id},
      ${previewData.slug},
      ${previewData.title},
      ${previewData.author},
      ${previewData.tagline},
      ${previewData.cover_image},
      ${previewData.is_published},
      ${JSON.stringify(previewData.chapters)}::jsonb,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO UPDATE
    SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      author = EXCLUDED.author,
      tagline = EXCLUDED.tagline,
      cover_image = EXCLUDED.cover_image,
      is_published = EXCLUDED.is_published,
      chapters = EXCLUDED.chapters,
      updated_at = CURRENT_TIMESTAMP;
  `

  console.log('Book preview successfully synchronized to Neon DB!')
}

updateBookPreviewInDb().catch((err) => {
  console.error('Error updating book preview in DB:', err)
  process.exit(1)
})
