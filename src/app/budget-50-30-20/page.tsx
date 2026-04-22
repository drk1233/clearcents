'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'

export default function BudgetPage() {
  const [income, setIncome] = useState('5000')
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly')

  const monthly = useMemo(() => {
    const raw = parseFloat(income) || 0
    return period === 'annual' ? raw / 12 : raw
  }, [income, period])

  const needs = monthly * 0.5
  const wants = monthly * 0.3
  const savings = monthly * 0.2

  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`

  const categories = [
    { label: 'Needs', pct: 50, amount: needs, color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0', examples: 'Rent/mortgage, groceries, utilities, insurance, minimum debt payments, transport to work' },
    { label: 'Wants', pct: 30, amount: wants, color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe', examples: 'Dining out, subscriptions, hobbies, travel, entertainment, gym membership' },
    { label: 'Savings & debt', pct: 20, amount: savings, color: '#7c3aed', bg: '#ede9fe', border: '#ddd6fe', examples: 'Emergency fund, retirement contributions, extra debt payments, investments' },
  ]

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        The 50/30/20 rule explained
      </h2>
      <p>The 50/30/20 rule is a simple budgeting framework popularised by Senator Elizabeth Warren in her book "All Your Worth." It divides your after-tax income into three categories: 50% for needs, 30% for wants, and 20% for savings and debt repayment.</p>
      <p style={{ marginTop: '1rem' }}>The appeal is simplicity. Unlike zero-based budgeting where you track every expense, the 50/30/20 rule gives you guardrails without micromanagement. If you're spending less than 50% on needs and saving at least 20%, you're broadly on track.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Adjusting for your situation</h3>
      <p>In high cost-of-living cities, your "needs" may naturally consume more than 50%. That's okay — adjust by trimming wants first before touching savings. The 20% savings target is the most important number to protect, especially in your 20s and 30s when compound growth has the most time to work.</p>
    </>
  )

  return (
    <CalcLayout
      title="50/30/20 Budget Calculator"
      description="Split your income using the most popular budgeting rule. Enter your take-home pay to see exactly how much goes to needs, wants, and savings."
      explainer={explainer}
      related={[
        { href: '/savings-goal', label: 'Savings goal' },
        { href: '/emergency-fund', label: 'Emergency fund' },
        { href: '/debt-payoff', label: 'Debt payoff' },
        { href: '/net-worth', label: 'Net worth' },
      ]}
    >
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem' }}>
        {(['monthly', 'annual'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontWeight: 500,
            background: period === p ? 'var(--brand)' : 'var(--surface)',
            color: period === p ? 'white' : 'var(--ink-muted)',
            border: period === p ? '1px solid var(--brand)' : '1px solid var(--border)'
          }}>
            {p === 'monthly' ? 'Monthly income' : 'Annual income'}
          </button>
        ))}
      </div>

      <CalcInput
        label={`${period === 'monthly' ? 'Monthly' : 'Annual'} take-home pay (after tax)`}
        value={income}
        onChange={setIncome}
        prefix="$"
        min={0}
        hint="Use your net pay — after income tax and deductions"
      />

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {categories.map(cat => (
          <div key={cat.label} style={{
            background: cat.bg, border: `1px solid ${cat.border}`,
            borderRadius: 12, padding: '1rem 1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', color: cat.color }}>{cat.pct}% {cat.label}</span>
                <p style={{ fontSize: 12, color: cat.color, margin: '2px 0 0', opacity: 0.8 }}>{cat.examples}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                <p style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: cat.color, margin: 0 }}>{fmt(cat.amount)}</p>
                <p style={{ fontSize: 11, color: cat.color, margin: '2px 0 0', opacity: 0.7 }}>per month</p>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 4, background: 'rgba(255,255,255,0.5)', borderRadius: 2, marginTop: 10 }}>
              <div style={{ height: '100%', width: `${cat.pct}%`, background: cat.color, borderRadius: 2, opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>
    </CalcLayout>
  )
}
