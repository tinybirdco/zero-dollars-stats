"use client"
import useSWR from 'swr'
import useAuth from './use-auth'
import { useParams } from 'next/navigation'

export default function useAnalyticsWorkspaces() {
  const params = useParams()
  const { host, token } = useAuth()

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    const workspaces = data.workspaces ?? []
    
    return workspaces
      .filter((ws: any) => ws.name.startsWith('wa_'))
      .map((ws: any) => ({
        ...ws,
        domain: ws.name.split('_').slice(1, -1).join('.'),
      }))
  }

  const shouldFetch = Boolean(token && params.id)
  const { data, error, isValidating } = useSWR(
    shouldFetch ? `${host}/v1/user/workspaces` : null,
    fetcher
  )

  return {
    data: data ?? [],
    isValidating,
    error,
  }
}
