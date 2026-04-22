import Link from 'next/link'

interface RelatedCalc {
  href: string
  label: string
}

interface CalcLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  explainer: React.ReactNode
  related?: RelatedCalc[]
}

export default function CalcLayout({ title, description, children, explainer, related }: CalcLayoutProps) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 700,
          color: 'var(--ink)',
          margin: '0 0 0.5rem',
          letterSpacing: '-0.02em',
          lineHeight: 1.2
        }}>{title}</h1>
        <p style={{ fontSize: 16, color: 'var(--ink-muted)', margin: 0, lineHeight: 1.6 }}>{description}</p>
      </div>

      {/* Calculator card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        {children}
      </div>

      {/* Related calculators */}
      {related && related.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-faint)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Related calculators
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {related.map(r => (
              <Link key={r.href} href={r.href} style={{
                fontSize: 13,
                padding: '6px 14px',
                border: '1px solid var(--border)',
                borderRadius: 20,
                color: 'var(--ink-muted)',
                textDecoration: 'none',
                background: 'var(--surface)',
                transition: 'border-color 0.15s'
              }}>{r.label}</Link>
            ))}
          </div>
        </div>
      )}

      {/* SEO explainer content */}
      <div style={{
        fontSize: 15,
        color: 'var(--ink-muted)',
        lineHeight: 1.8,
        borderTop: '1px solid var(--border)',
        paddingTop: '2rem'
      }}>
        {explainer}
      </div>

    </div>
  )
}
