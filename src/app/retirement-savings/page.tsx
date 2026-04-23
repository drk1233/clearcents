'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function RetirementSavingsPage() {
  const [currentAge, setCurrentAge] = useState('30')
  const [retirementAge, setRetirementAge] = useState('65')
  const [currentSavings, setCurrentSavings] = useState('25000')
  const [monthly, setMonthly] = useState('500')
  const [rate, setRate] = useState('7')
  const [targetIncome, setTargetIncome] = useState('4000')

  const results = useMemo(() => {
    const ageNow = parseFloat(currentAge) || 30
    const ageRet = parseFloat(retirementAge) || 65
    const years = Math.max(0, ageRet - ageNow)
    const p = parseFloat(currentSavings) || 0
    const m = parseFloat(monthly) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const periods = years * 12

    const futureInitial = p * Math.pow(1 + r, periods)
    const futureContribs = r > 0 ? m * ((Math.pow(1 + r, periods) - 1) / r) : m * periods
    const projected = Math.round(futureInitial + futureContribs)

    const annualIncome = (parseFloat(targetIncome) || 0) * 12
    const target = annualIncome * 25
    const onTrack = projected >= target
    const gap = Math.abs(target - projected)

    return { projected, target, onTrack, gap, years }
  }, [currentAge, retirementAge, currentSavings, monthly, rate, targetIncome])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How much do you need to retire?
      </h2>
      <p>The most common retirement target is built on the 4% withdrawal rule: multiply your desired annual retirement income by 25. If you want $48,000/year in retirement, you need ~$1.2 million invested. This calculator shows whether you&apos;re on track.</p>
      <p style={{ marginTop: '1rem' }}>The projection uses compound growth on both your existing savings and your ongoing contributions. It assumes consistent returns — in reality, markets fluctuate, but long-term averages tend to hold. The S&amp;P 500 has averaged roughly 7% annually after inflation over the past century.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Tax-advantaged accounts first</h3>
      <p>If your employer offers a 401(k) match, contribute at least enough to capture it — that&apos;s an instant 50–100% return on that portion. After the match, max out a Roth IRA ($7,000/year for 2024 if under 50) before going back to the 401(k). The order matters for tax efficiency.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Starting later doesn&apos;t mean starting wrong</h3>
      <p>Beginning retirement savings at 40 instead of 25 is harder, but not impossible. Higher contributions, working slightly longer, or targeting a leaner retirement lifestyle can all close the gap. The worst thing you can do is delay further because the math seems daunting.</p>
    </>
  )

  return (
    <CalcLayout
      title="Retirement Savings Calculator"
      description="Will you have enough at retirement? Project your balance at any age and compare it against your income target using the 25x rule."
      explainer={explainer}
      related={[
        { href: '/fire-calculator', label: 'FIRE calculator' },
        { href: '/compound-interest', label: 'Compound interest' },
        { href: '/dollar-cost-averaging', label: 'Dollar cost averaging' },
        { href: '/savings-goal', label: 'Savings goal' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <div>
          <CalcInput label="Current age" value={currentAge} onChange={setCurrentAge} suffix="yrs" min={18} max={80} />
          <CalcInput label="Retirement age" value={retirementAge} onChange={setRetirementAge} suffix="yrs" min={45} max={80} />
          <CalcInput label="Current savings" value={currentSavings} onChange={setCurrentSavings} prefix="$" min={0} />
        </div>
        <div>
          <CalcInput label="Monthly contribution" value={monthly} onChange={setMonthly} prefix="$" min={0} />
          <CalcInput label="Annual return rate" value={rate} onChange={setRate} suffix="%" min={0} max={15} step={0.5} />
          <CalcInput label="Desired monthly income" value={targetIncome} onChange={setTargetIncome} prefix="$" min={0} hint="In today's dollars" />
        </div>
      </div>

      <ResultRow>
        <ResultCard label="Projected balance" value={fmt(results.projected)} accent={results.onTrack} />
        <ResultCard label="Target needed" value={fmt(results.target)} />
        <ResultCard
          label={results.onTrack ? 'Surplus' : 'Shortfall'}
          value={fmt(results.gap)}
          sublabel={results.onTrack ? `On track in ${results.years} years ✓` : `Increase contributions or retire later`}
        />
      </ResultRow>
    </CalcLayout>
  )
}
