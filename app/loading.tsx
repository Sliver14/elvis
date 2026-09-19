import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: 'var(--color-primary, #2A2421)',
      }}
      aria-live="polite"
      aria-label="Loading page content"
    >
      <Loader2
        className="animate-spin"
        style={{
          width: 32,
          height: 32,
          color: 'var(--color-accent, #B08968)',
        }}
      />
      <span
        style={{
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--color-muted, #766E65)',
        }}
      >
        Loading...
      </span>
    </div>
  )
}
