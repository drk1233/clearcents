'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function CreditCardPayoffPage() {
  const [balance, setBalance] = useState('5000')
  const [apr, setApr] = useState('22')
  const [payment, setPayment] = useState('100')

  const results = useMemo(() => {
    const b = parseFloat(balance) || 0
    const r = (parseFloat(apr) || 0) / 100 / 12
    const p = parseFloat(payment) || 0

    const minRequired = b * r * 1.01
    if (p <= b * r || b <= 0) return { months: Infinity, totalInterest: 0, totalPaid: 0, minPayment: Math.ceil(minRequired) }

    let remaining = b
    let months = 0
    let totalInterest = 0
    while (remaining > 0 && months < 1200) {
      const interest = remaining * r
      totalInterest += interest
      remaining = remaining + interest - p
      if (remaining < 0) remaining = 0
      months++
    }
    return { months, totalInterest: Math.round(totalInterest), totalPaid: Math.round(b + totalInterest), minPayment: Math.ceil(minRequired) }
  }, [balance, apr, payment])

  const timeStr = results.months === Infinity ? 'Never — payment too low' : results.months < 1200 ? `${Math.floor(results.months / 12)}y ${results.months % 12}m` : '100+ years'

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        The minimum payment trap
      </h2>
      <p>Credit card companies design minimum payments to maximise the interest you pay. A typical minimum is 1–2% of your balance plus interest, which barely dents the principal. On a $5,000 balance at 22% APR, paying only the minimum can mean 15+ years of payments and $5,000+ in interest — effectively doubling the cost.</p>
      <p style={{ marginTop: '1rem' }}>This calculator shows you the real cost of your current payment and lets you see how increasing it — even by $50–100/month — dramatically shortens your payoff timeline and cuts total interest paid.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Strategies to pay off faster</h3>
      <p><strong>Balance transfer:</strong> Move your balance to a 0% APR introductory card and pay aggressively during the promo period. Be disciplined about clearing it before the rate resets.</p>
      <p style={{ marginTop: '0.75rem' }}><strong>Debt avalanche:</strong> If you have multiple cards, put extra payments toward the highest-rate balance first while paying minimums on others. This minimises total interest mathematically.</p>
      <p style={{ marginTop: '0.75rem' }}><strong>Stop using it:</strong> You can&apos;t fill a bucket while the tap is running. Pause credit card spending on the card you&apos;re paying down until the balance is clear.</p>
    </>
  )

  return (
    <CalcLayout
      title="Credit Card Payoff Calculator"
      description="See the true cost of minimum payments on your credit card. Adjust your monthly payment to find out exactly when you'll be debt-free."
      explainer={explainer}
      related={[
        { href: '/debt-payoff', label: 'Debt payoff (snowball vs avalanche)' },
        { href: '/student-loan', label: 'Student loan payoff' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/emergency-fund', label: 'Emergency fund' },
      ]}
    >
      <CalcInput label="Credit card balance" value={balance} onChange={setBalance} prefix="$" min={0} />
      <CalcInput label="Annual interest rate (APR)" value={apr} onChange={setApr} suffix="%" min={0} max={60} step={0.5} />
      <CalcInput label="Monthly payment" value={payment} onChange={setPayment} prefix="$" min={0} hint={`Minimum required: ~$${results.minPayment}/mo`} />

      <ResultRow>
        <ResultCard label="Time to pay off" value={timeStr} accent={results.months < 1200} />
        <ResultCard label="Total interest paid" value={fmt(results.totalInterest)} />
        <ResultCard label="Total amount paid" value={fmt(results.totalPaid)} sublabel={`$${fmt(parseFloat(balance) || 0)} balance + interest`} />
      </ResultRow>
    </CalcLayout>
  )
}
