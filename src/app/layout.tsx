import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'AceCents — Simple Financial Calculators',
    template: '%s | AceCents'
  },
  description: 'AceCents provides free, fast financial calculators. No sign-up. No fluff. Just the numbers.',
  openGraph: {
    siteName: 'AceCents',
    type: 'website',
  },
  verification: {
    google: '5CSJnzdrt71wju8MmgoE1sEareSCGxZ0G5mpBMDLLwM',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
