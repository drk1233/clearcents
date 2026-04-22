'use client'

interface CalcInputProps {
  label: string
  value: string | number
  onChange: (val: string) => void
  prefix?: string
  suffix?: string
  type?: string
  min?: number
  max?: number
  step?: number
  hint?: string
}

export default function CalcInput({
  label, value, onChange, prefix, suffix, type = 'number', min, max, step, hint
}: CalcInputProps) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--ink-muted)',
        marginBottom: 6
      }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {prefix && (
          <span style={{
            background: 'var(--surface-3)',
            border: '1px solid var(--border)',
            borderRight: 'none',
            borderRadius: '8px 0 0 8px',
            padding: '0 12px',
            height: 44,
            display: 'flex', alignItems: 'center',
            fontSize: 14, color: 'var(--ink-muted)',
            fontWeight: 500, flexShrink: 0
          }}>{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min} max={max} step={step}
          style={{
            flex: 1,
            height: 44,
            border: '1px solid var(--border)',
            borderRadius: prefix ? '0 8px 8px 0' : suffix ? '8px 0 0 8px' : 8,
            padding: '0 12px',
            fontSize: 15,
            color: 'var(--ink)',
            background: 'var(--surface)',
            outline: 'none',
            width: '100%'
          }}
        />
        {suffix && (
          <span style={{
            background: 'var(--surface-3)',
            border: '1px solid var(--border)',
            borderLeft: 'none',
            borderRadius: '0 8px 8px 0',
            padding: '0 12px',
            height: 44,
            display: 'flex', alignItems: 'center',
            fontSize: 14, color: 'var(--ink-muted)',
            fontWeight: 500, flexShrink: 0
          }}>{suffix}</span>
        )}
      </div>
      {hint && <p style={{ fontSize: 12, color: 'var(--ink-faint)', margin: '4px 0 0' }}>{hint}</p>}
    </div>
  )
}
