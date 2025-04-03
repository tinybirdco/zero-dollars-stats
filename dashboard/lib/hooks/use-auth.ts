import { useParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useAnalytics } from '../../components/Provider'
import { useAuthContext } from '../providers/auth-provider'

export default function useAuth() {
  const searchParams = useSearchParams()
  
  const { authToken, host: configHost } = useAuthContext()

  let token, host
  if (configHost && authToken) {
    token = authToken
    host = configHost
  } else {
    token = searchParams.get('token') || undefined
    host = searchParams.get('host') || undefined
  }

  const { error } = useAnalytics()
  const isTokenValid = !error || ![401, 403].includes(error.status ?? 0)
  const isAuthenticated = !!token && !!host

  return { isAuthenticated, token, host, isTokenValid }
}
