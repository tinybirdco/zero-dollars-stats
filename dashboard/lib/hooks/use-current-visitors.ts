import useSWR from 'swr'
import { querySQL } from '../api'
import { useCurrentToken } from './use-current-token'

export default function useCurrentVisitors() {
  const { token } = useCurrentToken()

  async function getCurrentVisitors(): Promise<number> {
    const { data } = await querySQL<{ visits: number }>(
      `SELECT uniq(session_id) AS visits FROM analytics_hits
        WHERE timestamp >= (now() - interval 5 minute) FORMAT JSON`,
      token
    )
    const [{ visits }] = data
    return visits
  }

  const { data } = useSWR(token ? 'currentVisitors' : null, getCurrentVisitors)
  return data ?? 0
}
