'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

export default function EmergencyFundPage() {
  const [rent, setRent] = useState('1500')
  const [food, setFood] = useState('400')
  const [transport, setTransport] = useState('300')
  const [utilities, setUtilities] = useState('150')
  const [insurance, setInsurance] = useState('200')
  const [other, setOther] = useState('200')
  const [months, setMonths] = useState('6')
  const [saved, setSaved] = useState('1000')
  const [monthly, setMonthly] = useState('300')

  const results = useMemo(() => {
    const total = [rent, food, transport, utilities, insurance, other].reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
    const target = total * (parseFloat(months) || 6)
    const alreadySaved = parseFloat(saved) || 0
    const remaining = Math.max(0, target - alreadySaved)
    const monthlyContrib = parseFloat(monthly) || 0
    const monthsToGoal = monthlyContrib > 0 ? Math.ceil(remaining / monthlyContrib) : Infinity
    const yearsToGoal = Math.floor(monthsToGoal / 12)
    const remMonths = monthsToGoal % 12
    const timeStr = monthsToGoal === 0 ? 'Already funded!' : monthsToGoal === Infinity ? 'Set a monthly amount' : yearsToGoal > 0 ? `${yearsToGoal}y ${remMonths}m` : `${monthsToGoal} months`
    const pct = target > 0 ? Math.min(100, Math.round((alreadySaved / target) * 100)) : 0
    return { total, target, remaining, timeStr, pct }
  }, [rent, food, transport, utilities, insurance, other, months, saved, monthly])

  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How big should your emergency fund be?
      </h2>
      <p>Most financial experts recommend 3–6 months of essential living expenses. The right number for you depends on your job stability, income sources, and dependants. Freelancers, self-employed people, and single-income households should aim for 6–9 months.</p>
      <p style={{ marginTop: '1rem' }}>The key word is "essential." Your emergency fund covers the expenses you absolutely need to survive — rent, food, utilities, transport, insurance. Not Netflix, gym memberships, or dining out. This is why the number is often smaller than people expect.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Where to keep it</h3>
      <p>Your emergency fund should be liquid and accessible — not invested in the stock market. A high-yield savings account (HYSA) is ideal. It earns meaningful interest (4–5% in 2024) while remaining accessible the same or next business day. Don't tie it up in a CD with early withdrawal penalties.</p>
    </>
  )

  return (
    <CalcLayout
      title="Emergency Fund Calculator"
      description="How much do you need in your emergency fund? Enter your essential monthly expenses to find your target and how long it'll take to get there."
      explainer={explainer}
      related={[
        { href: '/savings-goal', label: 'Savings goal' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/compound-interest', label: 'Compound interest' },
      ]}
    >
      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 1rem' }}>
        Monthly essential expenses
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <CalcInput label="Rent / mortgage" value={rent} onChange={setRent} prefix="$" />
        <CalcInput label="Food & groceries" value={food} onChange={setFood} prefix="$" />
        <CalcInput label="Transport" value={transport} onChange={setTransport} prefix="$" />
        <CalcInput label="Utilities" value={utilities} onChange={setUtilities} prefix="$" />
        <CalcInput label="Insurance" value={insurance} onChange={setInsurance} prefix="$" />
        <CalcInput label="Other essentials" value={other} onChange={setOther} prefix="$" />
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 6 }}>Months of expenses to save</label>
          <select value={months} onChange={e => setMonths(e.target.value)} style={{ width: '100%', height: 44, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', fontSize: 15, color: 'var(--ink)', background: 'var(--surface)', outline: 'none' }}>
            <option value="3">3 months (minimum)</option>
            <option value="6">6 months (recommended)</option>
            <option value="9">9 months (self-employed)</option>
            <option value="12">12 months (very cautious)</option>
          </select>
        </div>
        <CalcInput label="Already saved" value={saved} onChange={setSaved} prefix="$" min={0} />
        <CalcInput label="Monthly savings rate" value={monthly} onChange={setMonthly} prefix="$" min={0} />
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--brand)' }}>{results.pct}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${results.pct}%`, background: 'var(--brand)', borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
      </div>

      <ResultRow>
        <ResultCard label="Monthly essentials" value={fmt(results.total)} />
        <ResultCard label="Target fund size" value={fmt(results.target)} accent />
        <ResultCard label="Still needed" value={fmt(results.remaining)} sublabel={results.timeStr} />
      </ResultRow>
    </CalcLayout>
  )
}
