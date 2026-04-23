'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function PayRaisePage() {
  const [salary, setSalary] = useState('60000')
  const [raise, setRaise] = useState('10')
  const [taxRate, setTaxRate] = useState('25')

  const results = useMemo(() => {
    const s = parseFloat(salary) || 0
    const r = (parseFloat(raise) || 0) / 100
    const t = (parseFloat(taxRate) || 0) / 100

    const newSalary = s * (1 + r)
    const increase = newSalary - s
    const netIncrease = increase * (1 - t)
    const newMonthly = (newSalary * (1 - t)) / 12
    const oldMonthly = (s * (1 - t)) / 12

    return { newSalary, increase, netIncrease, newMonthly, oldMonthly, monthlyGain: newMonthly - oldMonthly }
  }, [salary, raise, taxRate])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How a pay raise actually affects your take-home pay
      </h2>
      <p>A 10% raise sounds significant, but taxes mean you won&apos;t see 10% more in your bank account. This calculator estimates your real monthly take-home increase after accounting for your effective tax rate, giving you a realistic picture of what the raise means day-to-day.</p>
      <p style={{ marginTop: '1rem' }}>Note: the US tax system is marginal, meaning only income above each tax bracket threshold is taxed at the higher rate. A raise that bumps you into a higher bracket only taxes the <em>additional</em> income at the higher rate — your existing income stays at its current rate.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>What tax rate to use</h3>
      <p>Your <strong>effective tax rate</strong> (total taxes ÷ gross income) is the most accurate number to use here. For a rough estimate: if your combined federal + state income tax is about 22–28%, use that. Your W-2 or last year&apos;s tax return will show this. If you have pre-tax 401(k) contributions, your effective rate on the raise may be lower.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Negotiating a raise</h3>
      <p>Research shows that employees who negotiate earn, on average, $5,000–$10,000 more at job offer time. Know your market rate (Glassdoor, Levels.fyi, LinkedIn Salary) before any negotiation conversation. Raises are also compounding — a higher base salary today means all future raises and bonuses are calculated on a larger number.</p>
    </>
  )

  return (
    <CalcLayout
      title="Pay Raise Calculator"
      description="See exactly how much more you'll take home after a pay raise, accounting for taxes. Know your real monthly gain before you negotiate."
      explainer={explainer}
      related={[
        { href: '/cost-of-living', label: 'Cost of living comparison' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/freelance-rate', label: 'Freelance hourly rate' },
        { href: '/savings-goal', label: 'Savings goal' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <CalcInput label="Current annual salary" value={salary} onChange={setSalary} prefix="$" min={0} />
        <CalcInput label="Raise percentage" value={raise} onChange={setRaise} suffix="%" min={0} max={100} step={0.5} />
        <CalcInput label="Effective tax rate" value={taxRate} onChange={setTaxRate} suffix="%" min={0} max={60} step={1} hint="Combined federal + state income tax" />
      </div>

      <ResultRow>
        <ResultCard label="New annual salary" value={fmt(results.newSalary)} />
        <ResultCard label="Monthly take-home gain" value={fmt(results.monthlyGain)} accent />
        <ResultCard label="Net annual increase" value={fmt(results.netIncrease)} sublabel={`Pre-tax raise: ${fmt(results.increase)}/yr`} />
      </ResultRow>
    </CalcLayout>
  )
}
