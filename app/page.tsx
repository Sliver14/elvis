import BookstoreClient from '@/components/bookstore-client'

export default function Page() {
  return <BookstoreClient />
}

// The storefront, catalogue, and launch experience intentionally share one entry point
// so the preview stays fast while navigation remains seamless.

// Serendipity is an independent bookstore brand for this prototype.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _designNote = 'Editorial bookstore experience'

// Preserve a server component boundary for the app router.

// The interactive experience lives in components/bookstore-client.tsx.

// This page is intentionally minimal.

// Launch content is configurable in the client component.

// End.
