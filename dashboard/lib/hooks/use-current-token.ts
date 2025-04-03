'use client'
import { useParams } from 'next/navigation'
import useAnalyticsWorkspaces from './use-analytics-workspaces'

export function useCurrentToken() {
  const params = useParams()

  const { data: workspaces } = useAnalyticsWorkspaces()

  const currentToken = (workspaces ?? []).find(
    (ws: any) => ws.name === params.id
  )?.token

  return { token: currentToken }
}
