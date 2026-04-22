import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | ClearCents',
}

export default function NotFound() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '6rem 1.5rem', textAlign: 'center' }}>
      <p style={{ fontSize: 64, margin: '0 0 1rem' }}>🔍</p>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: 700,
        color: 'var(--ink)',
        margin: '0 0 0.75rem',
        letterSpacing: '-0.02em'
      }}>
        Page not found
      </h1>
      <p style={{ fontSize: 16, color: 'var(--ink-muted)', lineHeight: 1.6, margin: '0 0 2rem' }}>
        That calculator doesn&apos;t exist yet — or the link is wrong.
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        background: 'var(--brand)',
        color: 'white',
        padding: '10px 24px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none'
      }}>
        ← Back to all calculators
      </Link>
    </div>
  )
}
