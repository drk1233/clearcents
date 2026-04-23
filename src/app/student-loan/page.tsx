'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function StudentLoanPage() {
  const [balance, setBalance] = useState('35000')
  const [rate, setRate] = useState('6.5')
  const [payment, setPayment] = useState('400')

  const results = useMemo(() => {
    const b = parseFloat(balance) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const p = parseFloat(payment) || 0

    if (b <= 0 || p <= 0) return { months: 0, totalInterest: 0, totalPaid: 0 }
    if (r > 0 && p <= b * r) return { months: Infinity, totalInterest: 0, totalPaid: 0 }

    let remaining = b
    let months = 0
    let totalInterest = 0
    while (remaining > 0.01 && months < 1200) {
      const interest = remaining * r
      totalInterest += interest
      remaining = remaining + interest - p
      if (remaining < 0) remaining = 0
      months++
    }
    return { months, totalInterest: Math.round(totalInterest), totalPaid: Math.round(b + totalInterest) }
  }, [balance, rate, payment])

  const timeStr = results.months === Infinity
    ? 'Payment too low to pay off'
    : results.months >= 1200
    ? '100+ years'
    : results.months === 0 ? '—' : `${Math.floor(results.months / 12)}y ${results.months % 12}m`

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        Understanding your student loan payoff
      </h2>
      <p>Student loans can feel like a permanent fixture of adult life, but understanding the math helps you make smarter decisions. Your monthly payment is split between interest (which accrues daily on the outstanding balance) and principal reduction. Early in repayment, most of each payment goes to interest.</p>
      <p style={{ marginTop: '1rem' }}>This calculator shows your payoff timeline and total interest under your current payment, helping you see how refinancing, income-driven repayment, or extra payments change the outcome.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Federal vs private loans</h3>
      <p>Federal loans offer income-driven repayment (IDR) plans, Public Service Loan Forgiveness (PSLF), and hardship deferment. These protections are valuable. Private loans often have lower rates but no safety net programs. Refinancing federal loans to private forfeits those protections permanently — weigh that carefully.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>The power of extra payments</h3>
      <p>Even $50–100 extra per month applied directly to principal can shave years off a student loan and save thousands in interest. Check with your servicer to ensure extra payments are applied to principal, not future scheduled payments.</p>
    </>
  )

  return (
    <CalcLayout
      title="Student Loan Payoff Calculator"
      description="See your payoff date and total interest paid on your student loans. Find out how extra payments could save you thousands."
      explainer={explainer}
      related={[
        { href: '/debt-payoff', label: 'Debt payoff calculator' },
        { href: '/credit-card-payoff', label: 'Credit card payoff' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/emergency-fund', label: 'Emergency fund' },
      ]}
    >
      <CalcInput label="Loan balance" value={balance} onChange={setBalance} prefix="$" min={0} />
      <CalcInput label="Annual interest rate" value={rate} onChange={setRate} suffix="%" min={0} max={25} step={0.25} />
      <CalcInput label="Monthly payment" value={payment} onChange={setPayment} prefix="$" min={0} />

      <ResultRow>
        <ResultCard label="Payoff timeline" value={timeStr} accent />
        <ResultCard label="Total interest paid" value={fmt(results.totalInterest)} />
        <ResultCard label="Total amount paid" value={fmt(results.totalPaid)} />
      </ResultRow>
    </CalcLayout>
  )
}
