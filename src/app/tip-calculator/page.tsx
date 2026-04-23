'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

export default function TipCalculatorPage() {
  const [bill, setBill] = useState('85')
  const [tipPct, setTipPct] = useState('18')
  const [people, setPeople] = useState('4')

  const results = useMemo(() => {
    const b = parseFloat(bill) || 0
    const t = (parseFloat(tipPct) || 0) / 100
    const n = Math.max(1, parseInt(people) || 1)

    const tipAmount = b * t
    const total = b + tipAmount
    const perPerson = total / n
    const tipPerPerson = tipAmount / n

    return { tipAmount, total, perPerson, tipPerPerson }
  }, [bill, tipPct, people])

  const quickTips = [10, 15, 18, 20, 25]

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How much should you tip?
      </h2>
      <p>Tipping customs vary by country and service type. In the US, 15–20% is standard for restaurant service. 20%+ is for excellent service or complex orders. 10–15% is acceptable for average service. Some people tip 18% as a base to avoid the mental math of calculating 20% on a discounted check.</p>
      <p style={{ marginTop: '1rem' }}>For other services: hairdressers typically 15–20%, hotel housekeeping $2–5/night, taxi/rideshare 10–15%, bartenders $1–2/drink or 15–20% of tab, food delivery $3–5 minimum or 15–20%.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Splitting bills fairly</h3>
      <p>When splitting evenly, this calculator divides the total (including tip) by the number of people. For more complex splits where people ordered different amounts, the fairest approach is to add the tip percentage to each person&apos;s individual portion before splitting.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>A note on pre-tax vs post-tax tipping</h3>
      <p>Some calculate the tip on the pre-tax subtotal, others on the post-tax total. Either is acceptable — the difference is small. Tipping on the pre-tax amount is technically &quot;correct&quot; by etiquette standards, but tipping on the total is increasingly common and simpler.</p>
    </>
  )

  return (
    <CalcLayout
      title="Tip Calculator"
      description="Calculate the exact tip amount and split the bill evenly across your group. Fast, no sign-up, just the numbers."
      explainer={explainer}
      related={[
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/pay-raise', label: 'Pay raise impact' },
        { href: '/freelance-rate', label: 'Freelance hourly rate' },
        { href: '/cost-of-living', label: 'Cost of living' },
      ]}
    >
      <CalcInput label="Bill total (before tip)" value={bill} onChange={setBill} prefix="$" min={0} step={0.01} />

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 6 }}>Tip percentage</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {quickTips.map(t => (
            <button key={t} onClick={() => setTipPct(t.toString())} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontWeight: 500,
              background: tipPct === t.toString() ? 'var(--brand)' : 'var(--surface)',
              color: tipPct === t.toString() ? 'white' : 'var(--ink-muted)',
              border: tipPct === t.toString() ? '1px solid var(--brand)' : '1px solid var(--border)'
            }}>{t}%</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', height: 44, width: 140 }}>
          <input type="number" value={tipPct} onChange={e => setTipPct(e.target.value)} min={0} max={100}
            style={{ flex: 1, height: '100%', border: 'none', padding: '0 12px', fontSize: 15, color: 'var(--ink)', background: 'var(--surface)', outline: 'none' }} />
          <span style={{ padding: '0 12px', background: 'var(--surface-3)', color: 'var(--ink-muted)', fontSize: 14, height: '100%', display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--border)' }}>%</span>
        </div>
      </div>

      <CalcInput label="Number of people" value={people} onChange={setPeople} min={1} max={100} hint="For equal split" />

      <ResultRow>
        <ResultCard label="Tip amount" value={fmt(results.tipAmount)} />
        <ResultCard label="Total bill" value={fmt(results.total)} accent />
        <ResultCard label="Per person" value={fmt(results.perPerson)} sublabel={`Includes ${fmt(results.tipPerPerson)} tip each`} />
      </ResultRow>
    </CalcLayout>
  )
}
