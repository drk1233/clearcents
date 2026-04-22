'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

export default function SavingsGoalPage() {
  const [goal, setGoal] = useState('20000')
  const [saved, setSaved] = useState('2000')
  const [monthly, setMonthly] = useState('500')
  const [rate, setRate] = useState('4.5')

  const results = useMemo(() => {
    const g = parseFloat(goal) || 0
    const s = parseFloat(saved) || 0
    const m = parseFloat(monthly) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const remaining = g - s
    if (remaining <= 0) return { months: 0, years: 0, totalContributed: s, totalInterest: 0, reachable: true }
    if (m <= 0) return { months: Infinity, years: Infinity, totalContributed: 0, totalInterest: 0, reachable: false }

    let balance = s
    let months = 0
    while (balance < g && months < 1200) {
      balance = balance * (1 + r) + m
      months++
    }

    const totalContributed = s + (m * months)
    const totalInterest = g - totalContributed

    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    return { months, years, remainingMonths, totalContributed, totalInterest: Math.max(0, totalInterest), reachable: months < 1200 }
  }, [goal, saved, monthly, rate])

  const timeStr = results.months === 0
    ? "Already there!"
    : !results.reachable
    ? "Never (increase contributions)"
    : results.years === 0
    ? `${results.remainingMonths} months`
    : `${results.years}y ${results.remainingMonths}m`

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How to use a savings goal calculator
      </h2>
      <p>A savings goal calculator works backwards from a target amount to tell you exactly how long it'll take to get there — factoring in what you've already saved, how much you add each month, and the interest you'll earn along the way.</p>
      <p style={{ marginTop: '1rem' }}>The interest rate to use depends on where you're saving. A high-yield savings account in the US currently offers around 4–5% APY. A standard savings account might offer 0.5–1%. If you're investing, the historical S&P 500 average is around 7–10%.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Tips to reach your goal faster</h3>
      <p>Even small increases to monthly contributions make a significant difference. Adding an extra $100/month to a $20,000 goal at 4.5% can cut months off your timeline. Windfalls like tax refunds or bonuses dropped straight into savings also accelerate your timeline significantly.</p>
    </>
  )

  return (
    <CalcLayout
      title="Savings Goal Calculator"
      description="How long will it take to save a specific amount? Enter your goal, what you've already saved, and your monthly contribution."
      explainer={explainer}
      related={[
        { href: '/compound-interest', label: 'Compound interest' },
        { href: '/emergency-fund', label: 'Emergency fund' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
      ]}
    >
      <CalcInput label="Savings goal" value={goal} onChange={setGoal} prefix="$" min={0} />
      <CalcInput label="Already saved" value={saved} onChange={setSaved} prefix="$" min={0} hint="Enter 0 if starting from scratch" />
      <CalcInput label="Monthly contribution" value={monthly} onChange={setMonthly} prefix="$" min={0} />
      <CalcInput label="Annual interest rate (APY)" value={rate} onChange={setRate} suffix="%" min={0} max={30} step={0.1} hint="Use your savings account APY or expected investment return" />

      <ResultRow>
        <ResultCard label="Time to goal" value={timeStr} accent />
        <ResultCard label="Total saved" value={`$${Math.round(parseFloat(goal) || 0).toLocaleString()}`} />
        <ResultCard label="Interest earned" value={`$${Math.round(results.totalInterest).toLocaleString()}`} sublabel="Free money from your bank" />
      </ResultRow>
    </CalcLayout>
  )
}
