'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function CostOfLivingPage() {
  const [salary, setSalary] = useState('80000')
  const [cityAIndex, setCityAIndex] = useState('100')
  const [cityBIndex, setCityBIndex] = useState('130')

  const results = useMemo(() => {
    const s = parseFloat(salary) || 0
    const a = parseFloat(cityAIndex) || 100
    const b = parseFloat(cityBIndex) || 100
    const equivalent = s * (b / a)
    const difference = equivalent - s
    const pct = Math.round(((b - a) / a) * 100)
    return { equivalent, difference, pct }
  }, [salary, cityAIndex, cityBIndex])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How to compare salaries across cities
      </h2>
      <p>A $100,000 salary in Austin, TX goes much further than the same salary in San Francisco, CA. Cost of living indices capture this difference by comparing the relative cost of goods, services, housing, and transportation in different locations.</p>
      <p style={{ marginTop: '1rem' }}>This calculator lets you enter two cost of living indices to find the salary equivalent. If City A has an index of 100 (the baseline) and City B is 130, you need 30% more income to maintain the same standard of living in City B.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Where to find cost of living indices</h3>
      <p>Numbeo, Bestplaces.net, and the Council for Community and Economic Research (C2ER) all publish cost of living data. Common US reference cities: New York City ~187, San Francisco ~175, Los Angeles ~155, Chicago ~107, Austin ~100, Atlanta ~95, Kansas City ~88.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Beyond the index</h3>
      <p>Cost of living indices capture averages, but your personal situation matters. If you own your home in the current city, rents elsewhere may not apply. Tax rates, commute costs, and healthcare availability also affect the real comparison. Use this as a starting point, not the final answer.</p>
    </>
  )

  return (
    <CalcLayout
      title="Cost of Living Comparison"
      description="Find the salary you need in a new city to maintain your current standard of living. Enter the cost of living index for both cities."
      explainer={explainer}
      related={[
        { href: '/pay-raise', label: 'Pay raise impact' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/house-affordability', label: 'House affordability' },
        { href: '/freelance-rate', label: 'Freelance hourly rate' },
      ]}
    >
      <CalcInput label="Current salary" value={salary} onChange={setSalary} prefix="$" min={0} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
        <CalcInput label="Current city cost index" value={cityAIndex} onChange={setCityAIndex} min={1} hint="Your current city (baseline)" />
        <CalcInput label="New city cost index" value={cityBIndex} onChange={setCityBIndex} min={1} hint="The city you're moving to" />
      </div>

      <ResultRow>
        <ResultCard label="Equivalent salary needed" value={fmt(results.equivalent)} accent={results.difference <= 0} />
        <ResultCard
          label={results.difference >= 0 ? 'Extra income needed' : 'You could earn less'}
          value={fmt(Math.abs(results.difference))}
          sublabel={`New city is ${Math.abs(results.pct)}% ${results.pct >= 0 ? 'more' : 'less'} expensive`}
        />
        <ResultCard label="Cost of living difference" value={`${results.pct > 0 ? '+' : ''}${results.pct}%`} />
      </ResultRow>
    </CalcLayout>
  )
}
