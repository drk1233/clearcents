'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function DollarCostAveragingPage() {
  const [monthly, setMonthly] = useState('500')
  const [rate, setRate] = useState('8')
  const [years, setYears] = useState('20')
  const [initial, setInitial] = useState('1000')

  const results = useMemo(() => {
    const m = parseFloat(monthly) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const t = parseFloat(years) || 0
    const p = parseFloat(initial) || 0
    const chartData = []

    for (let year = 0; year <= t; year++) {
      const periods = year * 12
      const futureInitial = p * Math.pow(1 + r, periods)
      const futureContribs = r > 0
        ? m * ((Math.pow(1 + r, periods) - 1) / r)
        : m * periods
      const total = futureInitial + futureContribs
      const contributed = p + m * periods
      chartData.push({ year, total: Math.round(total), contributed: Math.round(contributed) })
    }

    const final = chartData[chartData.length - 1] || { total: 0, contributed: 0 }
    return { chartData, final, interest: final.total - final.contributed }
  }, [monthly, rate, years, initial])

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        What is dollar cost averaging?
      </h2>
      <p>Dollar cost averaging (DCA) is an investment strategy where you invest a fixed amount of money at regular intervals — typically monthly — regardless of whether the market is up or down. Instead of trying to time the market, you buy more shares when prices are low and fewer when prices are high, lowering your average cost per share over time.</p>
      <p style={{ marginTop: '1rem' }}>The strategy removes emotion from investing. When markets fall, most investors panic and sell. A DCA investor sees cheaper prices and keeps buying. This discipline is one of the biggest edges an individual investor can have over those who try to time their entries.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Why DCA works so well in practice</h3>
      <p>Research consistently shows that most active investors — including professionals — underperform simple index fund investing over long periods. DCA into a low-cost index fund (like an S&amp;P 500 ETF) has historically produced strong results for patient investors. The S&amp;P 500 has never delivered a negative return over any 20-year rolling period in its history.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>How to automate your DCA</h3>
      <p>Most brokerages (Fidelity, Schwab, Vanguard) offer automatic investment plans that let you schedule recurring purchases. Set it up once and your contributions happen without you having to think about it. Consistency over years is what creates wealth, not perfect timing.</p>
    </>
  )

  return (
    <CalcLayout
      title="Dollar Cost Averaging Calculator"
      description="See how investing a fixed amount every month grows over time. DCA is one of the most powerful wealth-building strategies available to ordinary investors."
      explainer={explainer}
      related={[
        { href: '/compound-interest', label: 'Compound interest' },
        { href: '/investment-return', label: 'Investment return (ROI)' },
        { href: '/fire-calculator', label: 'FIRE calculator' },
        { href: '/retirement-savings', label: 'Retirement savings' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 2rem' }}>
        <div>
          <CalcInput label="Initial lump sum" value={initial} onChange={setInitial} prefix="$" min={0} hint="Optional starting amount" />
          <CalcInput label="Monthly contribution" value={monthly} onChange={setMonthly} prefix="$" min={0} />
        </div>
        <div>
          <CalcInput label="Annual return rate" value={rate} onChange={setRate} suffix="%" min={0} max={30} step={0.5} />
          <CalcInput label="Investment period" value={years} onChange={setYears} suffix="years" min={1} max={50} />
        </div>
      </div>

      <ResultRow>
        <ResultCard label="Final value" value={fmt(results.final.total)} accent />
        <ResultCard label="Total invested" value={fmt(results.final.contributed)} />
        <ResultCard label="Investment gains" value={fmt(results.interest)} sublabel={`${Math.round((results.interest / (results.final.contributed || 1)) * 100)}% return on contributions`} />
      </ResultRow>

      {results.chartData.length > 1 && (
        <div style={{ marginTop: '2rem', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dcaTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dcaContrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#8fa08f' }} tickFormatter={v => `yr ${v}`} />
              <YAxis tick={{ fontSize: 11, fill: '#8fa08f' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={48} />
              <Tooltip formatter={(value: number, name: string) => [fmt(value), name === 'total' ? 'Balance' : 'Contributed']} labelFormatter={l => `Year ${l}`} contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8e2' }} />
              <Area type="monotone" dataKey="contributed" stroke="#94a3b8" strokeWidth={1.5} fill="url(#dcaContrib)" />
              <Area type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} fill="url(#dcaTotal)" />
            </AreaChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 11, color: 'var(--ink-faint)', textAlign: 'center', margin: '4px 0 0' }}>Green = portfolio value · Gray = amount contributed</p>
        </div>
      )}
    </CalcLayout>
  )
}
