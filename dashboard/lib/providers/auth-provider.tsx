'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { LS_AUTH_TOKEN, LS_WORKSPACE_TOKEN } from '../config'
import { useCurrentToken } from '../hooks/use-current-token'

export interface AuthContextType {
  dashboardURL: string | null
  trackerToken: string | null
  authToken: string | null
  host: string | null
}

const AuthContext = createContext<AuthContextType>({
  dashboardURL: null,
  trackerToken: null,
  authToken: null,
  host: null,
})

interface AuthProviderProps {
  children: ReactNode
  authToken: string | null
  defaultWorkspaceToken: string | null
}

export function AuthProvider({
  children,
  authToken,
  defaultWorkspaceToken,
}: AuthProviderProps) {
  const [workspaceToken, setWorkspaceToken] = useState(defaultWorkspaceToken)

  const { token: currentToken } = useCurrentToken()

  useEffect(() => {
    // TODO: react from workspacetoken changing on query params and/or localstorage
    if (workspaceToken) {
      setWorkspaceToken(workspaceToken)
    }
  }, [workspaceToken])

  return (
    <AuthContext.Provider
      value={{
        authToken,
        trackerToken: workspaceToken,
        dashboardURL: null,
        host: process.env.NEXT_PUBLIC_TINYBIRD_HOST ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
