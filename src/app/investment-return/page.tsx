'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'
import type { Metadata } from 'next'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function InvestmentReturnPage() {
  const [initial, setInitial] = useState('10000')
  const [current, setCurrent] = useState('14500')
  const [years, setYears] = useState('3')

  const results = useMemo(() => {
    const p = parseFloat(initial) || 0
    const c = parseFloat(current) || 0
    const y = parseFloat(years) || 0

    if (p <= 0) return { roi: 0, annualised: 0, profit: 0 }

    const profit = c - p
    const roi = (profit / p) * 100
    const annualised = y > 0 ? (Math.pow(c / p, 1 / y) - 1) * 100 : roi

    return { roi, annualised, profit }
  }, [initial, current, years])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How to calculate investment return
      </h2>
      <p>Return on Investment (ROI) measures the gain or loss from an investment relative to its cost. The simple formula is: <strong>(Current Value − Initial Cost) ÷ Initial Cost × 100</strong>.</p>
      <p style={{ marginTop: '1rem' }}>Simple ROI doesn&apos;t account for time. A 45% return sounds great, but not if it took 20 years. The <strong>annualised return</strong> (CAGR) tells you the equivalent yearly rate, making it easy to compare investments held for different periods.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>What&apos;s a good ROI?</h3>
      <p>The S&amp;P 500 has historically returned ~10% annually (before inflation). A consistent 7–10% annualised return on a diversified portfolio is considered solid. Be skeptical of any investment promising more than 15% with low risk.</p>
    </>
  )

  return (
    <CalcLayout
      title="Investment Return Calculator (ROI)"
      description="Calculate your simple and annualised return on any investment. Enter the amount you invested and its current value."
      explainer={explainer}
      related={[
        { href: '/compound-interest', label: 'Compound interest' },
        { href: '/dollar-cost-averaging', label: 'Dollar cost averaging' },
        { href: '/fire-calculator', label: 'FIRE calculator' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <CalcInput label="Amount invested" value={initial} onChange={setInitial} prefix="$" min={0} />
        <CalcInput label="Current value" value={current} onChange={setCurrent} prefix="$" min={0} />
        <CalcInput label="Years held" value={years} onChange={setYears} suffix="years" min={0} step={0.5} hint="Used for annualised return" />
      </div>

      <ResultRow>
        <ResultCard label="Profit / Loss" value={fmt(results.profit)} accent={results.profit >= 0} />
        <ResultCard label="Simple ROI" value={`${results.roi.toFixed(1)}%`} />
        <ResultCard label="Annualised return" value={`${results.annualised.toFixed(2)}%`} sublabel="Equivalent annual rate (CAGR)" />
      </ResultRow>
    </CalcLayout>
  )
}
