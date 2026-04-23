'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

export default function FreelanceRatePage() {
  const [targetIncome, setTargetIncome] = useState('80000')
  const [weeks, setWeeks] = useState('48')
  const [hoursPerWeek, setHoursPerWeek] = useState('30')
  const [expenses, setExpenses] = useState('8000')
  const [taxRate, setTaxRate] = useState('30')

  const results = useMemo(() => {
    const income = parseFloat(targetIncome) || 0
    const w = parseFloat(weeks) || 48
    const h = parseFloat(hoursPerWeek) || 30
    const exp = parseFloat(expenses) || 0
    const t = (parseFloat(taxRate) || 0) / 100

    const annualBillable = w * h
    const grossNeeded = (income + exp) / (1 - t)
    const hourlyRate = annualBillable > 0 ? grossNeeded / annualBillable : 0

    const daily = hourlyRate * 8
    const weekly = hourlyRate * h

    return { hourlyRate, daily, weekly, grossNeeded, annualBillable }
  }, [targetIncome, weeks, hoursPerWeek, expenses, taxRate])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How to calculate your freelance hourly rate
      </h2>
      <p>Setting your freelance rate isn&apos;t about what you want to earn per hour — it&apos;s about what you <em>need</em> to charge to actually hit your income goal after accounting for unbillable time, business expenses, and self-employment taxes.</p>
      <p style={{ marginTop: '1rem' }}>The formula works backwards: start with your desired take-home income, add business expenses, then gross up for taxes (since freelancers pay both employee and employer portions of self-employment tax), and divide by your actual billable hours. This is your minimum viable rate.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>The billable hours reality check</h3>
      <p>As a freelancer, you only charge for time spent on client work. Admin, marketing, invoicing, meetings, learning, and business development are all unbillable. A realistic freelancer might bill 60–75% of their working hours. Someone working 40 hours/week might only bill 25–30 hours.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Self-employment tax</h3>
      <p>In the US, self-employed individuals pay 15.3% self-employment tax (covering Social Security and Medicare) on top of regular income tax. Combined with federal and state income tax, effective rates of 30–40% are common. Budget carefully — no employer is withholding for you. Set aside 25–35% of every invoice for taxes.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Your rate is a floor, not a ceiling</h3>
      <p>This calculator gives you your minimum rate. Your actual rate should be higher based on your expertise, market demand, project complexity, and urgency. Raising rates with existing clients by 10–15% annually is normal and expected. Never set your rate by what you think sounds reasonable — always calculate from your actual costs first.</p>
    </>
  )

  return (
    <CalcLayout
      title="Freelance Hourly Rate Calculator"
      description="What should you charge per hour? Work backwards from your income goal, expenses, and tax rate to find the minimum rate that makes freelancing sustainable."
      explainer={explainer}
      related={[
        { href: '/pay-raise', label: 'Pay raise impact' },
        { href: '/cost-of-living', label: 'Cost of living comparison' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/savings-goal', label: 'Savings goal' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <div>
          <CalcInput label="Desired annual take-home" value={targetIncome} onChange={setTargetIncome} prefix="$" min={0} hint="After taxes, what you want to keep" />
          <CalcInput label="Annual business expenses" value={expenses} onChange={setExpenses} prefix="$" min={0} hint="Software, insurance, equipment, etc." />
          <CalcInput label="Effective tax rate" value={taxRate} onChange={setTaxRate} suffix="%" min={0} max={60} step={1} hint="Include self-employment tax (~15%)" />
        </div>
        <div>
          <CalcInput label="Billable weeks per year" value={weeks} onChange={setWeeks} suffix="weeks" min={1} max={52} hint="Subtract holidays & vacation" />
          <CalcInput label="Billable hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs" min={1} max={80} hint="Client work only, not admin" />
        </div>
      </div>

      <ResultRow>
        <ResultCard label="Minimum hourly rate" value={fmt(results.hourlyRate)} accent />
        <ResultCard label="Daily rate (8 hrs)" value={fmt(results.daily)} />
        <ResultCard label="Weekly revenue needed" value={fmt(results.weekly)} sublabel={`${results.annualBillable.toFixed(0)} billable hours/year`} />
      </ResultRow>
    </CalcLayout>
  )
}
