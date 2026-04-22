interface ResultCardProps {
  label: string
  value: string
  sublabel?: string
  accent?: boolean
}

export function ResultCard({ label, value, sublabel, accent }: ResultCardProps) {
  return (
    <div style={{
      background: accent ? 'var(--brand-light)' : 'var(--surface-3)',
      border: `1px solid ${accent ? '#bbf7d0' : 'var(--border)'}`,
      borderRadius: 12,
      padding: '1.25rem 1.5rem',
      flex: 1,
      minWidth: 140
    }}>
      <p style={{ fontSize: 12, fontWeight: 500, color: accent ? 'var(--brand)' : 'var(--ink-faint)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: accent ? 'var(--brand-dark)' : 'var(--ink)', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{value}</p>
      {sublabel && <p style={{ fontSize: 12, color: accent ? 'var(--brand)' : 'var(--ink-faint)', margin: 0 }}>{sublabel}</p>}
    </div>
  )
}

interface ResultRowProps {
  children: React.ReactNode
}

export function ResultRow({ children }: ResultRowProps) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
      {children}
    </div>
  )
}
