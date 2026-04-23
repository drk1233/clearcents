'use client'
import { useState } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface LineItem { id: string; label: string; value: string }

function useItems(initial: LineItem[]) {
  const [items, setItems] = useState<LineItem[]>(initial)
  const add = (label: string) => setItems(d => [...d, { id: Date.now().toString(), label, value: '' }])
  const update = (id: string, field: 'label' | 'value', val: string) =>
    setItems(d => d.map(x => x.id === id ? { ...x, [field]: val } : x))
  const remove = (id: string) => setItems(d => d.filter(x => x.id !== id))
  const total = items.reduce((sum, x) => sum + (parseFloat(x.value) || 0), 0)
  return { items, add, update, remove, total }
}

export default function NetWorthPage() {
  const assets = useItems([
    { id: '1', label: 'Checking / savings', value: '5000' },
    { id: '2', label: 'Investments / brokerage', value: '30000' },
    { id: '3', label: 'Retirement accounts', value: '45000' },
    { id: '4', label: 'Home value', value: '0' },
  ])
  const liabilities = useItems([
    { id: '1', label: 'Mortgage', value: '0' },
    { id: '2', label: 'Student loans', value: '25000' },
    { id: '3', label: 'Credit card debt', value: '3000' },
  ])

  const netWorth = assets.total - liabilities.total

  const listStyle = (id: string, items: LineItem[], remove: (id: string) => void, update: (id: string, field: 'label' | 'value', val: string) => void) =>
    items.map(item => (
      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px auto', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <input value={item.label} onChange={e => update(item.id, 'label', e.target.value)}
          style={{ height: 38, border: '1px solid var(--border)', borderRadius: 8, padding: '0 10px', fontSize: 14, color: 'var(--ink)', background: 'var(--surface)', outline: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', height: 38 }}>
          <span style={{ padding: '0 10px', background: 'var(--surface-3)', color: 'var(--ink-muted)', fontSize: 14, height: '100%', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)' }}>$</span>
          <input type="number" value={item.value} onChange={e => update(item.id, 'value', e.target.value)} min={0}
            style={{ flex: 1, height: '100%', border: 'none', padding: '0 10px', fontSize: 14, color: 'var(--ink)', background: 'var(--surface)', outline: 'none', width: 80 }} />
        </div>
        {items.length > 1 && <button onClick={() => remove(item.id)} style={{ fontSize: 11, color: 'var(--ink-faint)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>}
      </div>
    ))

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        Why net worth is the best measure of financial health
      </h2>
      <p>Income tells you how much flows in. Net worth tells you how much you&apos;ve built. Two people can earn the same salary but have wildly different net worths depending on their saving, investing, and debt habits. Net worth is the single best indicator of financial progress over time.</p>
      <p style={{ marginTop: '1rem' }}>The formula is simple: net worth = assets − liabilities. Assets are things you own that have value (cash, investments, property). Liabilities are amounts you owe (loans, credit cards, mortgages).</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Tracking net worth over time</h3>
      <p>Calculate your net worth every 3–6 months and track the trend. Short-term fluctuations in investment values are noise — the direction over years is what matters. A consistently rising net worth, even slowly, means your financial life is moving in the right direction.</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Average net worth benchmarks</h3>
      <p>According to the Federal Reserve&apos;s Survey of Consumer Finances, median US household net worth is around $192,700. But this varies enormously by age. In your 30s, $100k+ is solid. By 40, many financial plans target 3× your annual salary. Don&apos;t compare to averages — compare to your own past.</p>
    </>
  )

  return (
    <CalcLayout
      title="Net Worth Calculator"
      description="Calculate your total net worth by listing your assets and liabilities. The clearest picture of your financial health."
      explainer={explainer}
      related={[
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/fire-calculator', label: 'FIRE calculator' },
        { href: '/debt-payoff', label: 'Debt payoff' },
        { href: '/retirement-savings', label: 'Retirement savings' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 2.5rem' }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Assets</p>
          {listStyle('assets', assets.items, assets.remove, assets.update)}
          <button onClick={() => assets.add('New asset')} style={{ fontSize: 13, color: 'var(--brand)', background: 'none', border: '1px dashed #86efac', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', width: '100%', marginTop: 4 }}>+ Add asset</button>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Liabilities</p>
          {listStyle('liabilities', liabilities.items, liabilities.remove, liabilities.update)}
          <button onClick={() => liabilities.add('New liability')} style={{ fontSize: 13, color: '#dc2626', background: 'none', border: '1px dashed #fca5a5', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', width: '100%', marginTop: 4 }}>+ Add liability</button>
        </div>
      </div>

      <ResultRow>
        <ResultCard label="Total assets" value={fmt(assets.total)} />
        <ResultCard label="Total liabilities" value={fmt(liabilities.total)} />
        <ResultCard label="Net worth" value={fmt(netWorth)} accent={netWorth >= 0} sublabel={netWorth >= 0 ? 'Positive net worth ✓' : 'Work on reducing debt'} />
      </ResultRow>
    </CalcLayout>
  )
}
