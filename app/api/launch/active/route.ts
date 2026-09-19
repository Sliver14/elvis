import { NextResponse } from 'next/server'
import { getDb, DEFAULT_LAUNCH } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  if (!sql) {
    return NextResponse.json({
      success: true,
      launch: {
        ...DEFAULT_LAUNCH,
        themes: typeof DEFAULT_LAUNCH.themes === 'string' ? JSON.parse(DEFAULT_LAUNCH.themes) : DEFAULT_LAUNCH.themes
      },
      source: 'fallback'
    })
  }

  try {
    const launches = await sql`
      SELECT id, slug, title, author, author_bio, author_image, tagline, intro, description, themes, cover_image, launch_date, is_active, created_at
      FROM book_launches
      WHERE is_active = true
      ORDER BY updated_at DESC
      LIMIT 1;
    `

    if (!launches.length) {
      // If none active, return the most recent one or fallback
      const recent = await sql`
        SELECT id, slug, title, author, author_bio, author_image, tagline, intro, description, themes, cover_image, launch_date, is_active, created_at
        FROM book_launches
        ORDER BY created_at DESC
        LIMIT 1;
      `
      if (recent.length) {
        const item = recent[0]
        return NextResponse.json({
          success: true,
          launch: {
            ...item,
            themes: typeof item.themes === 'string' ? JSON.parse(item.themes) : item.themes
          },
          source: 'neon'
        })
      }

      return NextResponse.json({
        success: true,
        launch: {
          ...DEFAULT_LAUNCH,
          themes: typeof DEFAULT_LAUNCH.themes === 'string' ? JSON.parse(DEFAULT_LAUNCH.themes) : DEFAULT_LAUNCH.themes
        },
        source: 'fallback'
      })
    }

    const activeLaunch = launches[0]
    return NextResponse.json({
      success: true,
      launch: {
        ...activeLaunch,
        themes: typeof activeLaunch.themes === 'string' ? JSON.parse(activeLaunch.themes) : activeLaunch.themes
      },
      source: 'neon'
    })
  } catch (error: any) {
    console.error('Fetch active launch error:', error)
    return NextResponse.json({
      success: true,
      launch: {
        ...DEFAULT_LAUNCH,
        themes: typeof DEFAULT_LAUNCH.themes === 'string' ? JSON.parse(DEFAULT_LAUNCH.themes) : DEFAULT_LAUNCH.themes
      },
      source: 'fallback_error',
      error: error?.message
    })
  }
}
