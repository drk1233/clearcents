'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function HouseAffordabilityPage() {
  const [income, setIncome] = useState('90000')
  const [down, setDown] = useState('50000')
  const [rate, setRate] = useState('7')
  const [term, setTerm] = useState('30')
  const [debts, setDebts] = useState('500')

  const results = useMemo(() => {
    const annual = parseFloat(income) || 0
    const monthly = annual / 12
    const downPayment = parseFloat(down) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const n = (parseFloat(term) || 30) * 12
    const monthlyDebts = parseFloat(debts) || 0

    // 28% front-end ratio: max PITI (principal + interest + taxes + insurance) = 28% gross monthly
    const maxPITI = monthly * 0.28
    // 36% back-end ratio (total debt): max total debt payments = 36% gross monthly
    const maxTotalDebt = monthly * 0.36
    const maxFromDTI = maxTotalDebt - monthlyDebts

    const maxMonthly = Math.min(maxPITI, maxFromDTI)

    // Max loan based on payment (approximate, ignoring taxes/insurance which are ~20-25% of PITI)
    const piPayment = maxMonthly * 0.75
    const maxLoan = r > 0
      ? piPayment * ((1 - Math.pow(1 + r, -n)) / r)
      : piPayment * n

    const maxPrice28 = maxLoan + downPayment
    const maxPrice3x = annual * 3

    return { maxPrice28: Math.max(0, maxPrice28), maxPrice3x, maxMonthly: Math.max(0, maxMonthly), maxLoan: Math.max(0, maxLoan) }
  }, [income, down, rate, term, debts])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How lenders determine what you can afford
      </h2>
      <p>Mortgage lenders use two key ratios. The <strong>front-end ratio</strong> (28% rule): your total housing payment (principal, interest, taxes, insurance — PITI) should not exceed 28% of your gross monthly income. The <strong>back-end ratio</strong> (36% rule): all debt payments combined should stay under 36% of gross monthly income.</p>
      <p style={{ marginTop: '1rem' }}>The 3x rule is a simpler alternative: home price should be no more than 3× your annual income. In high cost-of-living cities this is often impossible, but it&apos;s a useful sanity check to avoid overextending.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Down payment and PMI</h3>
      <p>Putting less than 20% down means paying Private Mortgage Insurance (PMI), typically 0.5–1.5% of the loan annually. This adds $150–450/month on a $300k loan. Saving for a 20% down payment avoids PMI entirely and gives you instant equity and a lower monthly payment.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Beyond the payment</h3>
      <p>Owning a home costs 1–3% of the home&apos;s value annually in maintenance and repairs. A $400k home may need $4,000–12,000/year for upkeep — often not budgeted by first-time buyers. Property taxes (0.5–2.5% of value) and homeowners insurance ($1,000–3,000/yr) also add to the true monthly cost.</p>
    </>
  )

  return (
    <CalcLayout
      title="House Affordability Calculator"
      description="How much home can you actually afford? Calculated using the 28% front-end rule and lender debt-to-income standards."
      explainer={explainer}
      related={[
        { href: '/car-affordability', label: 'Car affordability' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/net-worth', label: 'Net worth' },
        { href: '/debt-payoff', label: 'Debt payoff' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <div>
          <CalcInput label="Annual gross income" value={income} onChange={setIncome} prefix="$" min={0} hint="Before taxes" />
          <CalcInput label="Down payment saved" value={down} onChange={setDown} prefix="$" min={0} />
          <CalcInput label="Monthly debt payments" value={debts} onChange={setDebts} prefix="$" min={0} hint="Car loans, student loans, credit cards" />
        </div>
        <div>
          <CalcInput label="Mortgage interest rate" value={rate} onChange={setRate} suffix="%" min={0} max={20} step={0.25} />
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 6 }}>Loan term</label>
            <select value={term} onChange={e => setTerm(e.target.value)} style={{ width: '100%', height: 44, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', fontSize: 15, color: 'var(--ink)', background: 'var(--surface)', outline: 'none' }}>
              <option value="15">15 years</option>
              <option value="20">20 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
        </div>
      </div>

      <ResultRow>
        <ResultCard label="Max home price (28% rule)" value={fmt(results.maxPrice28)} accent />
        <ResultCard label="Max home price (3x rule)" value={fmt(results.maxPrice3x)} />
        <ResultCard label="Max monthly housing payment" value={fmt(results.maxMonthly)} sublabel="Including est. taxes & insurance" />
      </ResultRow>
    </CalcLayout>
  )
}
