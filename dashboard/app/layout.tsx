import { cookies } from 'next/headers'
import { AuthProvider } from '../lib/providers/auth-provider'

import '../styles/globals.css'
import AnalyticsProvider from '../components/Provider'
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

const sans = Inter({
  variable: '--font-family-sans',
  subsets: ['latin'],
  fallback: ['system-ui']
})

const mono = localFont({
  variable: '--font-family-iawriter',
  src: '../static/fonts/iawritermonos-regular.woff2',
  display: 'swap'
})

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  const authToken = cookieStore.get('token')?.value || null

  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <body>
        <AuthProvider authToken={authToken}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
