import fetch from 'cross-fetch'
import {
  ClientResponse,
  PipeParams,
  QueryPipe,
  QuerySQL,
  QueryError,
} from './types/api'
import { useCurrentToken } from './hooks/use-current-token'
import useSWR from 'swr'

type UseQueryPipe<T> = {
  data: T | undefined
  isLoading: boolean
  error: Error | null
}

export function getConfig() {
  return {
    host: process.env.NEXT_PUBLIC_TINYBIRD_HOST,
  }
}

export async function fetcher<T>(
  path: string,
  token: string,
  params?: RequestInit
): Promise<ClientResponse<T>> {
  const { host } = getConfig()

  if (!host) {
    throw new Error('Configuration not found')
  }

  const response = await fetch(`${host}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...params,
  })

  const data = (await response.json()) as ClientResponse<T>

  if (!response.ok) {
    throw new QueryError(data?.error ?? 'Something went wrong', response.status)
  }

  return data
}

export function useQueryPipe<T>(
  name: string,
  params: Partial<PipeParams<T>>
): UseQueryPipe<T> {
  const { token } = useCurrentToken()

  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return
    searchParams.set(key, value)
  })

  const { data, isValidating, error } = useSWR<T>(
    token ? `/v0/pipes/${name}.json?${searchParams}` : null,
    url => fetcher<T>(url, token)
  )

  return { data, isLoading: isValidating, error }
}

export function querySQL<T>(sql: string, token: string): Promise<QuerySQL<T>> {
  return fetcher(`/v0/sql?q=${sql}`, token)
}

