'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function InflationImpactPage() {
  const [amount, setAmount] = useState('10000')
  const [inflation, setInflation] = useState('3')
  const [years, setYears] = useState('20')

  const results = useMemo(() => {
    const a = parseFloat(amount) || 0
    const r = (parseFloat(inflation) || 0) / 100
    const t = parseFloat(years) || 0

    const futureValue = a * Math.pow(1 + r, t)
    const realValue = a / Math.pow(1 + r, t)
    const purchasingPowerLost = a - realValue
    const lostPct = Math.round((purchasingPowerLost / a) * 100)

    return { futureValue, realValue, purchasingPowerLost, lostPct }
  }, [amount, inflation, years])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How inflation erodes your money&apos;s value
      </h2>
      <p>Inflation is the rate at which prices rise over time, which equivalently means the rate at which money loses purchasing power. If inflation is 3% per year, something that costs $100 today will cost $134 in ten years. Your $100 bill still says $100, but it can buy less.</p>
      <p style={{ marginTop: '1rem' }}>This calculator answers two questions: how much will you need in the future to match today&apos;s purchasing power? And if you hold cash, what is it really worth in real terms after inflation?</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Why cash savings lose value over time</h3>
      <p>If your savings account pays 1% interest and inflation runs at 3%, your real return is -2% per year. After 10 years, you&apos;ll have more dollars but they&apos;ll buy less than you started with. This is why financial advisors stress investing rather than holding large cash positions long-term.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Historical inflation rates</h3>
      <p>US inflation has averaged around 3% per year over the long run, but it varies significantly by era. The 1970s saw double-digit inflation; the 2010s averaged around 1.5–2%. The 2021–2023 period saw inflation spike to 7–9% before cooling. For long-term planning, 2.5–3.5% is a reasonable assumption.</p>
    </>
  )

  return (
    <CalcLayout
      title="Inflation Impact Calculator"
      description="See what your money will actually be worth in the future. Inflation silently erodes purchasing power — find out exactly how much."
      explainer={explainer}
      related={[
        { href: '/compound-interest', label: 'Compound interest' },
        { href: '/savings-goal', label: 'Savings goal' },
        { href: '/retirement-savings', label: 'Retirement savings' },
        { href: '/fire-calculator', label: 'FIRE calculator' },
      ]}
    >
      <CalcInput label="Amount today" value={amount} onChange={setAmount} prefix="$" min={0} />
      <CalcInput label="Annual inflation rate" value={inflation} onChange={setInflation} suffix="%" min={0} max={25} step={0.1} hint="US long-run average is ~3%" />
      <CalcInput label="Years into the future" value={years} onChange={setYears} suffix="years" min={1} max={100} />

      <ResultRow>
        <ResultCard label="Equivalent future cost" value={fmt(results.futureValue)} accent />
        <ResultCard label="Today's money will be worth" value={fmt(results.realValue)} sublabel={`In ${years} years at ${inflation}% inflation`} />
        <ResultCard label="Purchasing power lost" value={fmt(results.purchasingPowerLost)} sublabel={`${results.lostPct}% of real value gone`} />
      </ResultRow>
    </CalcLayout>
  )
}
