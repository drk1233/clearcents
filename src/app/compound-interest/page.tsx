'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState('10000')
  const [monthly, setMonthly] = useState('200')
  const [rate, setRate] = useState('8')
  const [years, setYears] = useState('20')
  const [compound, setCompound] = useState('12')

  const results = useMemo(() => {
    const p = parseFloat(principal) || 0
    const m = parseFloat(monthly) || 0
    const r = (parseFloat(rate) || 0) / 100
    const t = parseFloat(years) || 0
    const n = parseFloat(compound) || 12

    const chartData = []
    let balance = p
    const ratePerPeriod = r / n

    for (let year = 0; year <= t; year++) {
      const periods = year * n
      const futureValuePrincipal = p * Math.pow(1 + ratePerPeriod, periods)
      const futureValueContributions = m > 0
        ? m * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod)
        : 0
      const totalContributed = p + (m * 12 * year)
      const total = futureValuePrincipal + futureValueContributions

      chartData.push({
        year,
        total: Math.round(total),
        contributed: Math.round(totalContributed),
        interest: Math.round(total - totalContributed)
      })
    }

    const final = chartData[chartData.length - 1] || { total: 0, contributed: 0, interest: 0 }
    return { chartData, final }
  }, [principal, monthly, rate, years, compound])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        How compound interest works
      </h2>
      <p>Compound interest is the process of earning interest on both your original deposit and the interest you've already earned. Albert Einstein reportedly called it the "eighth wonder of the world" — and with good reason.</p>
      <p style={{ marginTop: '1rem' }}>The formula is: <strong>A = P(1 + r/n)^(nt)</strong> where P is your initial investment, r is the annual interest rate, n is the number of times interest compounds per year, and t is time in years. Monthly contributions are calculated separately and added to the total.</p>
      <p style={{ marginTop: '1rem' }}>The key insight: starting early matters far more than the amount you invest. $10,000 invested at 25 grows to nearly twice what the same amount invested at 35 becomes, even with no additional contributions. Time is the multiplier.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Compounding frequency</h3>
      <p>More frequent compounding means slightly higher returns. Monthly compounding (12x/year) is the most common for savings accounts and investment accounts. Daily compounding offers marginally more but the difference is smaller than most people expect.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>What rate should I use?</h3>
      <p>The S&P 500 has historically returned around 7–10% annually after inflation. For conservative estimates, use 6–7%. For high-yield savings accounts, use the current APY from your bank. For CDs, use the rate offered at the time of purchase.</p>
    </>
  )

  return (
    <CalcLayout
      title="Compound Interest Calculator"
      description="See exactly how your money grows over time with the power of compounding. Enter your initial deposit, monthly contributions, and expected return rate."
      explainer={explainer}
      related={[
        { href: '/savings-goal', label: 'Savings goal' },
        { href: '/retirement-savings', label: 'Retirement savings' },
        { href: '/dollar-cost-averaging', label: 'Dollar cost averaging' },
        { href: '/investment-return', label: 'Investment return (ROI)' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 2rem' }}>
        <div>
          <CalcInput label="Initial deposit" value={principal} onChange={setPrincipal} prefix="$" min={0} />
          <CalcInput label="Monthly contribution" value={monthly} onChange={setMonthly} prefix="$" min={0} hint="How much you'll add each month" />
        </div>
        <div>
          <CalcInput label="Annual interest rate" value={rate} onChange={setRate} suffix="%" min={0} max={50} step={0.1} />
          <CalcInput label="Time period" value={years} onChange={setYears} suffix="years" min={1} max={50} />
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-muted)', marginBottom: 6 }}>
              Compounding frequency
            </label>
            <select
              value={compound}
              onChange={e => setCompound(e.target.value)}
              style={{
                width: '100%', height: 44, border: '1px solid var(--border)',
                borderRadius: 8, padding: '0 12px', fontSize: 15,
                color: 'var(--ink)', background: 'var(--surface)', outline: 'none'
              }}
            >
              <option value="1">Annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
          </div>
        </div>
      </div>

      <ResultRow>
        <ResultCard label="Final balance" value={fmt(results.final.total)} accent />
        <ResultCard label="Total contributed" value={fmt(results.final.contributed)} />
        <ResultCard label="Interest earned" value={fmt(results.final.interest)} sublabel={`${Math.round((results.final.interest / (results.final.contributed || 1)) * 100)}% return on contributions`} />
      </ResultRow>

      {results.chartData.length > 1 && (
        <div style={{ marginTop: '2rem', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#8fa08f' }} tickFormatter={v => `yr ${v}`} />
              <YAxis tick={{ fontSize: 11, fill: '#8fa08f' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={48} />
              <Tooltip
                formatter={(value: number, name: string) => [fmt(value), name === 'total' ? 'Balance' : 'Contributed']}
                labelFormatter={l => `Year ${l}`}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8e2' }}
              />
              <Area type="monotone" dataKey="contributed" stroke="#94a3b8" strokeWidth={1.5} fill="url(#colorContrib)" />
              <Area type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 11, color: 'var(--ink-faint)', textAlign: 'center', margin: '4px 0 0' }}>
            Green = total balance · Gray = amount contributed
          </p>
        </div>
      )}
    </CalcLayout>
  )
}
