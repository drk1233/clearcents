export default function sitemap() {
  const base = 'https://acecents.vercel.app'
  const routes = [
    '', '/compound-interest', '/savings-goal',
    '/debt-payoff', '/budget-50-30-20', '/emergency-fund',
    '/investment-return', '/dollar-cost-averaging', '/fire-calculator',
    '/retirement-savings', '/inflation-impact', '/credit-card-payoff',
    '/student-loan', '/car-loan', '/net-worth', '/cost-of-living',
    '/pay-raise', '/tip-calculator', '/car-affordability',
    '/house-affordability', '/freelance-rate'
  ]
  return routes.map(route => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}