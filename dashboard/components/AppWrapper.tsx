import { GetServerSidePropsContext } from 'next'
import { AppProps } from 'next/app'
import AnalyticsProvider from './Provider'
import { AuthProvider } from '../lib/providers/auth-provider'

interface AppWrapperProps extends AppProps {
  authToken: string | null
  workspaceToken: string | null
}

export function AppWrapper({ Component, pageProps, authToken, workspaceToken }: AppWrapperProps) {
  return (
    <AuthProvider authToken={authToken}>
      <AnalyticsProvider>
        <Component {...pageProps} />
      </AnalyticsProvider>
    </AuthProvider>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context

  // Get tokens from cookies
  const authToken = req.cookies.token ?? null
  const workspaceToken = req.cookies.workspace_token ?? null

  return {
    props: {
      authToken,
      workspaceToken,
    },
  }
} 