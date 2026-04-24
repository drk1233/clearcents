export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      marginTop: '4rem',
      padding: '2rem 1.5rem'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: 0 }}>
          © {new Date().getFullYear()} AceCents. For informational purposes only — not financial advice.
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: 0 }}>
          Free calculators. No sign-up required.
        </p>
      </div>
    </footer>
  )
}
