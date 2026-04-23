'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function CarLoanPage() {
  const [price, setPrice] = useState('30000')
  const [down, setDown] = useState('5000')
  const [rate, setRate] = useState('7')
  const [term, setTerm] = useState('60')

  const results = useMemo(() => {
    const principal = (parseFloat(price) || 0) - (parseFloat(down) || 0)
    const r = (parseFloat(rate) || 0) / 100 / 12
    const n = parseFloat(term) || 60

    if (principal <= 0) return { monthly: 0, totalPaid: 0, totalInterest: 0 }

    const monthly = r > 0
      ? principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : principal / n

    const totalPaid = monthly * n
    const totalInterest = totalPaid - principal

    return { monthly: Math.round(monthly), totalPaid: Math.round(totalPaid), totalInterest: Math.round(totalInterest) }
  }, [price, down, rate, term])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        The real cost of a car loan
      </h2>
      <p>A car loan spreads the cost of a vehicle over time, but interest means you end up paying significantly more than the sticker price. On a $30,000 car financed at 7% for 5 years, you&apos;ll pay over $5,600 in interest — nearly 19% more than the vehicle&apos;s price.</p>
      <p style={{ marginTop: '1rem' }}>A larger down payment reduces both your monthly payment and total interest. Even an extra $2,000 upfront can save more than $2,000 in interest over the loan&apos;s life because each month&apos;s interest accrues on a smaller balance.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>The 20/4/10 rule</h3>
      <p>A popular guideline: put at least <strong>20%</strong> down, finance for no more than <strong>4</strong> years, and keep total car expenses (payment + insurance) under <strong>10%</strong> of gross monthly income. This keeps you from being &quot;underwater&quot; or car-poor.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Shorter terms save money</h3>
      <p>A 36-month loan has higher payments than a 72-month loan, but you&apos;ll pay far less interest and own the vehicle outright sooner. Long-term car loans (72–84 months) often lead to negative equity — owing more than the car is worth — especially given typical depreciation curves.</p>
    </>
  )

  return (
    <CalcLayout
      title="Car Loan Calculator"
      description="Calculate your monthly car payment and see the total cost of your auto loan. Adjust the down payment, interest rate, and term to find the right deal."
      explainer={explainer}
      related={[
        { href: '/car-affordability', label: 'Car affordability' },
        { href: '/debt-payoff', label: 'Debt payoff' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/house-affordability', label: 'House affordability' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <div>
          <CalcInput label="Vehicle price" value={price} onChange={setPrice} prefix="$" min={0} />
          <CalcInput label="Down payment" value={down} onChange={setDown} prefix="$" min={0} />
        </div>
        <div>
          <CalcInput label="Annual interest rate (APR)" value={rate} onChange={setRate} suffix="%" min={0} max={30} step={0.25} />
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 6 }}>Loan term</label>
            <select value={term} onChange={e => setTerm(e.target.value)} style={{ width: '100%', height: 44, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', fontSize: 15, color: 'var(--ink)', background: 'var(--surface)', outline: 'none' }}>
              <option value="24">24 months (2 years)</option>
              <option value="36">36 months (3 years)</option>
              <option value="48">48 months (4 years)</option>
              <option value="60">60 months (5 years)</option>
              <option value="72">72 months (6 years)</option>
              <option value="84">84 months (7 years)</option>
            </select>
          </div>
        </div>
      </div>

      <ResultRow>
        <ResultCard label="Monthly payment" value={fmt(results.monthly)} accent />
        <ResultCard label="Total interest" value={fmt(results.totalInterest)} />
        <ResultCard label="Total cost" value={fmt(results.totalPaid + (parseFloat(down) || 0))} sublabel="Including down payment" />
      </ResultRow>
    </CalcLayout>
  )
}
