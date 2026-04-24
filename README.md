# AceCents — Personal Finance Calculator Site

Simple, honest financial calculators. No sign-up. No fluff. Just the numbers.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Click Deploy — done. Vercel auto-detects Next.js.
4. Your site is live on a .vercel.app domain
5. Add your custom domain in Vercel settings (e.g. acecents.com)

## Project structure

```
src/
  app/
    page.tsx                    ← Homepage (all calculators listed)
    layout.tsx                  ← Root layout (Nav + Footer)
    globals.css                 ← Design tokens and fonts
    compound-interest/page.tsx  ← Calculator 1
    savings-goal/page.tsx       ← Calculator 2
    debt-payoff/page.tsx        ← Calculator 3
    budget-50-30-20/page.tsx    ← Calculator 4
    emergency-fund/page.tsx     ← Calculator 5
  components/
    Nav.tsx                     ← Top navigation
    Footer.tsx                  ← Footer
    CalcLayout.tsx              ← Reusable page wrapper (use for every new calc)
    CalcInput.tsx               ← Reusable input field
    ResultCard.tsx              ← Reusable result display
```

## Adding a new calculator

1. Create `src/app/YOUR-CALC-NAME/page.tsx`
2. Copy the structure from any existing calculator
3. Import CalcLayout, CalcInput, ResultCard
4. Write your calculation logic in useMemo
5. Add it to the homepage list in `src/app/page.tsx`
6. Link to it from related calculators

## Remaining calculators to build (15 left)

- /investment-return
- /dollar-cost-averaging
- /fire-calculator
- /retirement-savings
- /inflation-impact
- /credit-card-payoff
- /student-loan
- /car-loan
- /net-worth
- /cost-of-living
- /pay-raise
- /tip-calculator
- /car-affordability
- /house-affordability
- /freelance-rate

## Monetisation setup

**AdSense**: Apply at google.com/adsense once the site is live. Add your AdSense script to layout.tsx. Best ad placements: below the calculator result, between the result and the explainer text.

**Affiliate links**: Add contextually in the explainer text of relevant calculators:
- Compound interest / retirement → Betterment, Wealthfront, Robinhood
- Debt payoff / credit card → Credit Karma, NerdWallet balance transfer cards
- Savings goal → Marcus by Goldman Sachs, Ally Bank (HYSA affiliate programs)
- Student loan → Credible.com (pays $100–200 per funded loan)

## SEO checklist per calculator

- [ ] Unique <title> and <description> metadata
- [ ] H1 includes the main keyword ("Compound Interest Calculator")
- [ ] 400–600 words of explainer content below the fold
- [ ] Internal links to 3–4 related calculators
- [ ] FAQ section (add to explainer) for schema markup later

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (utility classes)
- Recharts (charts — only used on compound interest page)
- Vercel (hosting — free tier)
- No database needed (all calculations are client-side)
