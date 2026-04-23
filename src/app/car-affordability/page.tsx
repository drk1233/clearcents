'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function CarAffordabilityPage() {
  const [income, setIncome] = useState('70000')
  const [rate, setRate] = useState('7')

  const results = useMemo(() => {
    const annual = parseFloat(income) || 0
    const monthly = annual / 12
    const r = (parseFloat(rate) || 0) / 100 / 12

    // 20/4/10 rule: max 10% of gross monthly income on car expenses
    const maxMonthlyPayment = monthly * 0.10
    const n = 48 // 4-year term by 20/4/10 rule

    // Max loan amount (PV of maxMonthlyPayment annuity)
    const maxLoan = r > 0
      ? maxMonthlyPayment * ((1 - Math.pow(1 + r, -n)) / r)
      : maxMonthlyPayment * n

    // Assuming 20% down payment, total car price = maxLoan / 0.8
    const maxPrice = maxLoan / 0.8
    const downPayment = maxPrice * 0.2

    return { maxMonthlyPayment, maxLoan, maxPrice, downPayment }
  }, [income, rate])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        The 20/4/10 rule for car buying
      </h2>
      <p>The 20/4/10 rule is a widely used guideline to avoid being car-poor: put at least <strong>20%</strong> down, finance for no more than <strong>4 years</strong>, and keep total car expenses (payment + insurance) below <strong>10% of gross monthly income</strong>.</p>
      <p style={{ marginTop: '1rem' }}>This calculator uses the 10% threshold on your gross monthly income with a 4-year loan to determine your maximum car price assuming a 20% down payment. It gives you a ceiling, not a target — buying within this limit leaves room for insurance, fuel, and maintenance.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Why cars are expensive beyond the sticker price</h3>
      <p>A car&apos;s true cost includes: loan interest, insurance (can be $1,200–$3,000+/yr), fuel, maintenance, registration, and depreciation. New cars lose 15–20% of their value in the first year and ~50% within 5 years. This is why buying a 2–3 year old certified pre-owned vehicle often offers the best value — someone else absorbed the steepest depreciation.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>When to bend the rules</h3>
      <p>The 20/4/10 rule is a conservative guideline. If you live in a city with excellent public transport, a car is optional. If you live rurally and commute long distances, higher spend may be justified. The rule breaks down if you ignore insurance costs, which can make an "affordable" car payment unaffordable in total.</p>
    </>
  )

  return (
    <CalcLayout
      title="Car Affordability Calculator"
      description="How much car can you afford? Based on the 20/4/10 rule — 20% down, 4-year loan, 10% of gross monthly income."
      explainer={explainer}
      related={[
        { href: '/car-loan', label: 'Car loan calculator' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/debt-payoff', label: 'Debt payoff' },
        { href: '/house-affordability', label: 'House affordability' },
      ]}
    >
      <CalcInput label="Annual gross income" value={income} onChange={setIncome} prefix="$" min={0} hint="Before taxes" />
      <CalcInput label="Estimated loan APR" value={rate} onChange={setRate} suffix="%" min={0} max={30} step={0.25} />

      <ResultRow>
        <ResultCard label="Max vehicle price" value={fmt(results.maxPrice)} accent />
        <ResultCard label="Max monthly payment" value={fmt(results.maxMonthlyPayment)} sublabel="10% of monthly gross income" />
        <ResultCard label="Down payment (20%)" value={fmt(results.downPayment)} />
      </ResultRow>
    </CalcLayout>
  )
}
