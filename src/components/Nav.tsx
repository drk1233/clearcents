'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const path = usePathname()
  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 1.5rem',
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20, fontWeight: 700,
          color: 'var(--brand)',
          textDecoration: 'none',
          letterSpacing: '-0.02em'
        }}>
          AceCents
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/" style={{
            fontSize: 14, color: path === '/' ? 'var(--brand)' : 'var(--ink-muted)',
            textDecoration: 'none', fontWeight: 500
          }}>All calculators</Link>
          <Link href="/compound-interest" style={{
            fontSize: 14, color: 'var(--ink-muted)',
            textDecoration: 'none'
          }}>Investing</Link>
          <Link href="/debt-payoff" style={{
            fontSize: 14, color: 'var(--ink-muted)',
            textDecoration: 'none'
          }}>Debt</Link>
          <Link href="/savings-goal" style={{
            fontSize: 14, color: 'var(--ink-muted)',
            textDecoration: 'none'
          }}>Savings</Link>
        </nav>
      </div>
    </header>
  )
}
