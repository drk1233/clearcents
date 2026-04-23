'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function FireCalculatorPage() {
  const [expenses, setExpenses] = useState('4000')
  const [savings, setSavings] = useState('80000')
  const [monthly, setMonthly] = useState('2000')
  const [rate, setRate] = useState('7')

  const results = useMemo(() => {
    const annualExpenses = (parseFloat(expenses) || 0) * 12
    const fireNumber = annualExpenses * 25
    const currentSavings = parseFloat(savings) || 0
    const monthlyContrib = parseFloat(monthly) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12

    if (fireNumber <= currentSavings) return { fireNumber, years: 0, months: 0, progress: 100 }

    let balance = currentSavings
    let months = 0
    while (balance < fireNumber && months < 600) {
      balance = balance * (1 + r) + monthlyContrib
      months++
    }

    const progress = Math.min(100, Math.round((currentSavings / fireNumber) * 100))
    return { fireNumber, years: Math.floor(months / 12), months: months % 12, progress, reachable: months < 600 }
  }, [expenses, savings, monthly, rate])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        What is FIRE and how does the 25x rule work?
      </h2>
      <p>FIRE stands for Financial Independence, Retire Early. The core idea: accumulate enough invested assets that your portfolio&apos;s returns can cover your living expenses indefinitely — and you never need to work again unless you choose to.</p>
      <p style={{ marginTop: '1rem' }}>The 25x rule comes from the Trinity Study (1998), which found that a portfolio could sustainably withdraw 4% annually with a very high success rate across 30-year periods. Working backwards: if you need $50,000/year, you need $50,000 × 25 = $1,250,000 invested. That&apos;s your FIRE number.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>The 4% rule caveats</h3>
      <p>The 4% rule was designed for 30-year retirements. If you&apos;re retiring at 40 with a 50-year horizon, many FIRE followers use 3–3.5% to be safer. Fat FIRE (higher expenses), Lean FIRE (frugal), and Coast FIRE (stop contributing and let it grow) are common variations.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>The fastest lever to pull</h3>
      <p>Your savings rate is the biggest variable. Someone saving 10% of income may take 40+ years to reach FIRE. Someone saving 50% can often reach it in 15–17 years. Reducing expenses does double duty: it lowers your FIRE number AND increases your savings rate simultaneously.</p>
    </>
  )

  return (
    <CalcLayout
      title="FIRE Calculator"
      description="How many years until financial independence? Calculate your FIRE number using the 25x rule and see exactly how long it'll take at your current savings rate."
      explainer={explainer}
      related={[
        { href: '/compound-interest', label: 'Compound interest' },
        { href: '/retirement-savings', label: 'Retirement savings' },
        { href: '/dollar-cost-averaging', label: 'Dollar cost averaging' },
        { href: '/savings-goal', label: 'Savings goal' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <div>
          <CalcInput label="Monthly expenses" value={expenses} onChange={setExpenses} prefix="$" min={0} hint="Your total monthly spending in retirement" />
          <CalcInput label="Current savings / investments" value={savings} onChange={setSavings} prefix="$" min={0} />
        </div>
        <div>
          <CalcInput label="Monthly contribution" value={monthly} onChange={setMonthly} prefix="$" min={0} />
          <CalcInput label="Expected annual return" value={rate} onChange={setRate} suffix="%" min={0} max={20} step={0.5} hint="Historical S&P 500 avg ~7% real" />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ margin: '1rem 0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>Progress to FIRE number ({fmt(results.fireNumber)})</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--brand)' }}>{results.progress}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${results.progress}%`, background: 'var(--brand)', borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
      </div>

      <ResultRow>
        <ResultCard label="FIRE number" value={fmt(results.fireNumber)} />
        <ResultCard
          label="Time to FIRE"
          value={results.progress >= 100 ? "You're there!" : results.reachable ? `${results.years}y ${results.months}m` : '50+ years'}
          accent
        />
        <ResultCard label="4% annual withdrawal" value={fmt((parseFloat(expenses) || 0) * 12)} sublabel="What you can spend per year" />
      </ResultRow>
    </CalcLayout>
  )
}
