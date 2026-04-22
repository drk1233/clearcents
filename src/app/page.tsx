import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ClearCents — Free Financial Calculators',
  description: 'Simple, honest financial calculators. Compound interest, debt payoff, savings goals, budgeting and more. No sign-up required.',
}

const calculators = [
  {
    category: 'Investing',
    items: [
      { href: '/compound-interest', label: 'Compound Interest', desc: 'See how your money grows over time', icon: '📈' },
      { href: '/investment-return', label: 'Investment Return (ROI)', desc: 'Simple and annualised return on any investment', icon: '💰' },
      { href: '/dollar-cost-averaging', label: 'Dollar Cost Averaging', desc: 'Invest a fixed amount regularly', icon: '🔄' },
      { href: '/fire-calculator', label: 'FIRE Calculator', desc: 'How many years until financial independence', icon: '🔥' },
      { href: '/retirement-savings', label: 'Retirement Savings', desc: 'Will you have enough at retirement?', icon: '🏖️' },
    ]
  },
  {
    category: 'Savings',
    items: [
      { href: '/savings-goal', label: 'Savings Goal', desc: 'How long to save any amount', icon: '🎯' },
      { href: '/emergency-fund', label: 'Emergency Fund', desc: 'How much safety net you need', icon: '🛡️' },
      { href: '/inflation-impact', label: 'Inflation Impact', desc: 'What your money is worth in the future', icon: '📉' },
    ]
  },
  {
    category: 'Debt',
    items: [
      { href: '/debt-payoff', label: 'Debt Payoff', desc: 'Snowball vs avalanche comparison', icon: '⛄' },
      { href: '/credit-card-payoff', label: 'Credit Card Payoff', desc: 'The true cost of minimum payments', icon: '💳' },
      { href: '/student-loan', label: 'Student Loan Payoff', desc: 'Payoff timeline and total interest', icon: '🎓' },
      { href: '/car-loan', label: 'Car Loan', desc: 'Monthly payment and total cost', icon: '🚗' },
    ]
  },
  {
    category: 'Budgeting',
    items: [
      { href: '/budget-50-30-20', label: '50/30/20 Budget', desc: 'Split your income the smart way', icon: '📊' },
      { href: '/net-worth', label: 'Net Worth', desc: 'Your assets minus liabilities', icon: '🏦' },
      { href: '/cost-of-living', label: 'Cost of Living Comparison', desc: 'Compare salaries across cities', icon: '🏙️' },
      { href: '/pay-raise', label: 'Pay Raise Impact', desc: 'How much more you take home', icon: '💼' },
    ]
  },
  {
    category: 'Everyday',
    items: [
      { href: '/tip-calculator', label: 'Tip Calculator', desc: 'Split bills and calculate tips', icon: '🍽️' },
      { href: '/car-affordability', label: 'Car Affordability', desc: 'Max car price based on your income', icon: '🚙' },
      { href: '/house-affordability', label: 'House Affordability', desc: 'How much home can you afford', icon: '🏠' },
      { href: '/freelance-rate', label: 'Freelance Hourly Rate', desc: 'What to charge to hit your income goal', icon: '💻' },
    ]
  },
]

export default function Home() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: 600, margin: '0 auto 3.5rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--ink)',
          lineHeight: 1.1,
          margin: '0 0 1rem'
        }}>
          Financial calculators.<br />
          <span style={{ color: 'var(--brand)' }}>No fluff. Just answers.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-muted)', margin: 0, lineHeight: 1.7 }}>
          Free tools to help you save more, pay off debt, and invest smarter. No sign-up, no ads that follow you around, no financial advice disguised as content.
        </p>
      </div>

      {/* Calculator grid by category */}
      {calculators.map(cat => (
        <div key={cat.category} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--ink-faint)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 1rem'
          }}>{cat.category}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 10
          }}>
            {cat.items.map(calc => (
              <Link key={calc.href} href={calc.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                  transition: 'border-color 0.15s, transform 0.1s',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start'
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{calc.icon}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', margin: '0 0 2px' }}>{calc.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-faint)', margin: 0, lineHeight: 1.4 }}>{calc.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

    </div>
  )
}
