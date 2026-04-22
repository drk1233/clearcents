import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'ClearCents — Simple Financial Calculators',
    template: '%s | ClearCents'
  },
  description: 'Free, fast financial calculators. No sign-up. No fluff. Just the numbers.',
  openGraph: {
    siteName: 'ClearCents',
    type: 'website',
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
