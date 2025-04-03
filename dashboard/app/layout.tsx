import { cookies } from 'next/headers'
import { AuthProvider } from '../lib/providers/auth-provider'

import '../styles/globals.css'
import AnalyticsProvider from '../components/Provider'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  const authToken = cookieStore.get('token')?.value || null
  const workspaceToken = cookieStore.get('workspace_token')?.value || null

  return (
    <html lang="en">
      <body>
        <AuthProvider authToken={authToken} defaultWorkspaceToken={workspaceToken}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
