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
  authToken: string | null
  host: string | null
}

const AuthContext = createContext<AuthContextType>({
  dashboardURL: null,
  authToken: null,
  host: null,
})

interface AuthProviderProps {
  children: ReactNode
  authToken: string | null
}

export function AuthProvider({
  children,
  authToken,
}: AuthProviderProps) {
  return (
    <AuthContext.Provider
      value={{
        authToken,
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
