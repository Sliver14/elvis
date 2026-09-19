import { NextRequest, NextResponse } from 'next/server'
import { getDb, DEFAULT_LAUNCH } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({
      success: true,
      launches: [
        {
          ...DEFAULT_LAUNCH,
          registrations_count: 89,
          themes: typeof DEFAULT_LAUNCH.themes === 'string' ? JSON.parse(DEFAULT_LAUNCH.themes) : DEFAULT_LAUNCH.themes
        }
      ],
      source: 'fallback'
    })
  }

  try {
    const launches = await sql`
      SELECT
        bl.id,
        bl.slug,
        bl.title,
        bl.author,
        bl.author_bio,
        bl.author_image,
        bl.tagline,
        bl.intro,
        bl.description,
        bl.themes,
        bl.cover_image,
        bl.launch_date,
        bl.is_active,
        bl.created_at,
        COUNT(lr.id)::int as registrations_count
      FROM book_launches bl
      LEFT JOIN launch_registrations lr ON bl.id = lr.launch_id
      GROUP BY bl.id
      ORDER BY bl.created_at DESC;
    `

    const formatted = launches.map((l: any) => ({
      ...l,
      themes: typeof l.themes === 'string' ? JSON.parse(l.themes) : l.themes,
    }))

    return NextResponse.json({ success: true, launches: formatted, source: 'neon' })
  } catch (error: any) {
    console.error('Fetch admin launches error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const {
      title,
      author,
      author_bio,
      author_image,
      tagline,
      intro,
      description,
      themes,
      cover_image,
      launch_date,
      is_active,
    } = body

    if (!title || !author || !cover_image || !launch_date) {
      return NextResponse.json({
        success: false,
        error: 'Title, Author, Cover Image, and Launch Date are required',
      }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `launch-${Date.now()}`
    const id = `launch-${slug}-${Date.now()}`
    const themesJson = JSON.stringify(Array.isArray(themes) ? themes : ['Emotional discipline', 'Process over outcome', 'Building consistency'])

    // If activating this launch, deactivate all others
    if (is_active) {
      await sql`UPDATE book_launches SET is_active = false;`
    }

    const newLaunch = await sql`
      INSERT INTO book_launches (
        id, slug, title, author, author_bio, author_image, tagline, intro, description, themes, cover_image, launch_date, is_active
      )
      VALUES (
        ${id},
        ${slug},
        ${title},
        ${author},
        ${author_bio || ''},
        ${author_image || '/elvis.jpeg'},
        ${tagline || 'Process over profit.\nWin in the mind first.'},
        ${intro || ''},
        ${description || ''},
        ${themesJson}::jsonb,
        ${cover_image},
        ${launch_date},
        ${Boolean(is_active)}
      )
      RETURNING *;
    `

    return NextResponse.json({ success: true, launch: newLaunch[0] }, { status: 201 })
  } catch (error: any) {
    console.error('Create launch error:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create launch' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 500 })
  }

  try {
    const { launch_id, is_active } = await request.json()

    if (!launch_id) {
      return NextResponse.json({ success: false, error: 'launch_id is required' }, { status: 400 })
    }

    if (is_active) {
      // Deactivate all first
      await sql`UPDATE book_launches SET is_active = false;`
    }

    const updated = await sql`
      UPDATE book_launches
      SET is_active = ${Boolean(is_active)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${launch_id}
      RETURNING *;
    `

    return NextResponse.json({ success: true, launch: updated[0] })
  } catch (error: any) {
    console.error('Toggle launch active error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}
