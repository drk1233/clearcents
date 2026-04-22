'use client'
import { useState, useMemo } from 'react'
import CalcLayout from '@/components/CalcLayout'
import CalcInput from '@/components/CalcInput'
import { ResultCard, ResultRow } from '@/components/ResultCard'

interface Debt {
  id: string; name: string; balance: string; rate: string; minPayment: string
}

function calcPayoff(debts: Debt[], extra: number, method: 'snowball' | 'avalanche') {
  const d = debts.map(debt => ({
    name: debt.name,
    balance: parseFloat(debt.balance) || 0,
    rate: (parseFloat(debt.rate) || 0) / 100 / 12,
    min: parseFloat(debt.minPayment) || 0,
  })).filter(d => d.balance > 0)

  if (!d.length) return { months: 0, totalInterest: 0 }

  let balances = d.map(x => ({ ...x }))
  let months = 0
  let totalInterest = 0

  while (balances.some(b => b.balance > 0) && months < 600) {
    months++
    let extraLeft = extra

    // Apply interest
    balances.forEach(b => {
      if (b.balance > 0) {
        const interest = b.balance * b.rate
        totalInterest += interest
        b.balance += interest
      }
    })

    // Sort by method
    const active = balances.filter(b => b.balance > 0)
    if (method === 'snowball') active.sort((a, b) => a.balance - b.balance)
    else active.sort((a, b) => b.rate - a.rate)

    // Pay minimums
    balances.forEach(b => {
      if (b.balance > 0) {
        const payment = Math.min(b.min, b.balance)
        b.balance -= payment
      }
    })

    // Apply extra to target
    if (active.length > 0) {
      const target = balances.find(b => b.name === active[0].name)
      if (target && target.balance > 0) {
        const payment = Math.min(extraLeft, target.balance)
        target.balance -= payment
      }
    }

    balances.forEach(b => { if (b.balance < 0.01) b.balance = 0 })
  }

  return { months, totalInterest: Math.round(totalInterest) }
}

export default function DebtPayoffPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit card', balance: '5000', rate: '22', minPayment: '100' },
    { id: '2', name: 'Student loan', balance: '15000', rate: '6.5', minPayment: '200' },
  ])
  const [extra, setExtra] = useState('200')

  const addDebt = () => {
    setDebts(d => [...d, { id: Date.now().toString(), name: 'New debt', balance: '', rate: '', minPayment: '' }])
  }

  const update = (id: string, field: keyof Debt, val: string) => {
    setDebts(d => d.map(debt => debt.id === id ? { ...debt, [field]: val } : debt))
  }

  const remove = (id: string) => setDebts(d => d.filter(x => x.id !== id))

  const snowball = useMemo(() => calcPayoff(debts, parseFloat(extra) || 0, 'snowball'), [debts, extra])
  const avalanche = useMemo(() => calcPayoff(debts, parseFloat(extra) || 0, 'avalanche'), [debts, extra])

  const fmt = (m: number) => m === 0 ? '—' : m < 600 ? `${Math.floor(m / 12)}y ${m % 12}m` : '50+ years'
  const fmtMoney = (n: number) => `$${n.toLocaleString()}`
  const saving = avalanche.totalInterest < snowball.totalInterest
    ? snowball.totalInterest - avalanche.totalInterest : 0

  const explainer = (
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>
        Snowball vs avalanche: which is better?
      </h2>
      <p>Both methods involve paying minimums on all debts and putting any extra money toward one debt at a time. The difference is which debt gets the extra payment.</p>
      <p style={{ marginTop: '1rem' }}><strong>Debt snowball</strong> targets the smallest balance first. You pay it off faster, which provides a psychological win and motivates you to keep going. Research shows many people stick to this method better.</p>
      <p style={{ marginTop: '1rem' }}><strong>Debt avalanche</strong> targets the highest interest rate first. This minimises the total interest you pay and is mathematically optimal. If you're disciplined and motivated by numbers, this is the better strategy.</p>
      <p style={{ marginTop: '1rem' }}>In practice, the difference in total interest is often smaller than people expect — usually a few hundred dollars over several years. The best method is the one you'll actually stick to.</p>
    </>
  )

  return (
    <CalcLayout
      title="Debt Payoff Calculator"
      description="Compare the snowball and avalanche methods. See exactly how long it takes and how much interest you'll pay with your current extra payment."
      explainer={explainer}
      related={[
        { href: '/credit-card-payoff', label: 'Credit card payoff' },
        { href: '/budget-50-30-20', label: '50/30/20 budget' },
        { href: '/emergency-fund', label: 'Emergency fund' },
      ]}
    >
      {/* Debt list */}
      {debts.map(debt => (
        <div key={debt.id} style={{
          border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input
              value={debt.name}
              onChange={e => update(debt.id, 'name', e.target.value)}
              style={{ fontWeight: 500, fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: 'var(--ink)', width: '60%' }}
            />
            {debts.length > 1 && (
              <button onClick={() => remove(debt.id)} style={{ fontSize: 11, color: 'var(--ink-faint)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Remove
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <CalcInput label="Balance" value={debt.balance} onChange={v => update(debt.id, 'balance', v)} prefix="$" min={0} />
            <CalcInput label="Interest rate" value={debt.rate} onChange={v => update(debt.id, 'rate', v)} suffix="%" min={0} />
            <CalcInput label="Min payment" value={debt.minPayment} onChange={v => update(debt.id, 'minPayment', v)} prefix="$" min={0} />
          </div>
        </div>
      ))}

      <button onClick={addDebt} style={{
        fontSize: 13, color: 'var(--brand)', background: 'none', border: '1px dashed #86efac',
        borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: '1.25rem', width: '100%'
      }}>
        + Add another debt
      </button>

      <CalcInput label="Extra monthly payment" value={extra} onChange={setExtra} prefix="$" min={0} hint="Amount above minimums you can put toward debt each month" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: '1.5rem' }}>
        <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Snowball method</p>
          <p style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--ink)', margin: '0 0 4px' }}>{fmt(snowball.months)}</p>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', margin: 0 }}>{fmtMoney(snowball.totalInterest)} total interest</p>
        </div>
        <div style={{ background: 'var(--brand-light)', border: '1px solid #bbf7d0', borderRadius: 12, padding: '1.25rem' }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Avalanche method</p>
          <p style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--brand-dark)', margin: '0 0 4px' }}>{fmt(avalanche.months)}</p>
          <p style={{ fontSize: 13, color: 'var(--brand)', margin: 0 }}>{fmtMoney(avalanche.totalInterest)} total interest</p>
          {saving > 0 && <p style={{ fontSize: 12, color: 'var(--brand)', margin: '4px 0 0', fontWeight: 500 }}>Saves {fmtMoney(saving)} vs snowball</p>}
        </div>
      </div>
    </CalcLayout>
  )
}
