import { NextRequest, NextResponse } from 'next/server'
import { getDb, DEFAULT_LAUNCH } from '@/lib/db'
import { isAuthorizedAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: true, launch: DEFAULT_LAUNCH })
  }

  try {
    const launches = await sql`
      SELECT * FROM book_launches WHERE id = ${id} OR slug = ${id} LIMIT 1;
    `
    if (!launches.length) {
      return NextResponse.json({ success: false, error: 'Launch not found' }, { status: 404 })
    }

    const l = launches[0]
    const launchObj = {
      ...l,
      author: 'Dr Elvis Justice Bedi',
      author_bio: DEFAULT_LAUNCH.author_bio,
      author_image: DEFAULT_LAUNCH.author_image,
      themes: typeof l.themes === 'string' ? JSON.parse(l.themes) : l.themes,
    }

    return NextResponse.json({ success: true, launch: launchObj })
  } catch (error: any) {
    console.error('Fetch launch by id error:', error)
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const {
      title,
      tagline,
      intro,
      description,
      themes,
      cover_image,
      launch_date,
      is_active,
    } = body

    if (!title || !launch_date) {
      return NextResponse.json(
        { success: false, error: 'Title and Launch Date are required' },
        { status: 400 }
      )
    }

    const themesJson = JSON.stringify(
      Array.isArray(themes)
        ? themes
        : typeof themes === 'string'
        ? themes.split(',').map((t: string) => t.trim()).filter(Boolean)
        : ['Emotional discipline', 'Process over outcome', 'Building consistency']
    )

    if (is_active) {
      // Deactivate all first
      await sql`UPDATE book_launches SET is_active = false;`
    }

    // Check if record exists
    const existing = await sql`SELECT id FROM book_launches WHERE id = ${id} OR slug = ${id} LIMIT 1;`

    let updated
    if (existing.length > 0) {
      updated = await sql`
        UPDATE book_launches
        SET
          title = ${title},
          tagline = ${tagline || ''},
          intro = ${intro || ''},
          description = ${description || ''},
          themes = ${themesJson}::jsonb,
          cover_image = ${cover_image || '/practical-trading-psychology.png'},
          launch_date = ${launch_date},
          is_active = ${Boolean(is_active)},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
        RETURNING *;
      `
    } else {
      // Insert if not exists (e.g. initial launch record)
      const slug =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') || `launch-${Date.now()}`

      updated = await sql`
        INSERT INTO book_launches (
          id, slug, title, tagline, intro, description, themes, cover_image, launch_date, is_active
        )
        VALUES (
          ${id},
          ${slug},
          ${title},
          ${tagline || 'Process over profit.\nWin in the mind first.'},
          ${intro || ''},
          ${description || ''},
          ${themesJson}::jsonb,
          ${cover_image || '/practical-trading-psychology.png'},
          ${launch_date},
          ${Boolean(is_active)}
        )
        RETURNING *;
      `
    }

    const launchObj = {
      ...updated[0],
      author: 'Dr Elvis Justice Bedi',
      author_bio: DEFAULT_LAUNCH.author_bio,
      author_image: DEFAULT_LAUNCH.author_image,
      themes:
        typeof updated[0].themes === 'string'
          ? JSON.parse(updated[0].themes)
          : updated[0].themes,
    }

    return NextResponse.json({ success: true, launch: launchObj })
  } catch (error: any) {
    console.error('Update launch error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update launch' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const sql = getDb()
  if (!sql) {
    return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 500 })
  }

  try {
    await sql`DELETE FROM book_launches WHERE id = ${id} OR slug = ${id};`
    return NextResponse.json({ success: true, message: `Launch ${id} deleted` })
  } catch (error: any) {
    console.error('Delete launch error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete launch' },
      { status: 500 }
    )
  }
}
