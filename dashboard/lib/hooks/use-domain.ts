import { useState } from 'react'
import useSWR from 'swr'
import { querySQL } from '../api'
import { DomainData, DomainQueryData } from '../types/domain'
import { useCurrentToken } from './use-current-token'
import { useSearchParams } from 'next/navigation'

const FALLBACK_LOGO = '/fallback-logo.png'

export default function useDomain() {
  const { token } = useCurrentToken()
  const searchParams = useSearchParams()

  const [logo, setLogo] = useState(FALLBACK_LOGO)

  async function getDomain(): Promise<DomainData> {
    // Guess the instrumented domain, and exclude other domains like development or staging.
    //  - Try to get the domain with most hits from the last hour.
    //  - Fallback to 'some' domain.
    // Best balance between data accuracy and performance I can get.

    const { data } = await querySQL<DomainQueryData>(
      `
    with (
      SELECT nullif(domainWithoutWWW(href),'') as domain
      FROM analytics_hits
      where timestamp >= now() - interval 1 hour
      group by domain
      order by count(1) desc
      limit 1
    ) as top_domain,
    (
      SELECT domainWithoutWWW(href)
      FROM analytics_hits
      where href not like '%localhost%'
      limit 1
    ) as some_domain
    select coalesce(top_domain, some_domain) as domain format JSON
  `,
      token
    )
    const domain = data[0]['domain']
    const logo = domain ? `https://${domain}/favicon.ico` : FALLBACK_LOGO

    return {
      domain,
      logo,
    }
  }

  const { data } = useSWR(token ? 'domain' : null, getDomain, {
    onSuccess: ({ logo }) => setLogo(logo),
  })

  const handleLogoError = () => {
    setLogo(FALLBACK_LOGO)
  }

  return {
    domain: data?.domain ?? searchParams?.get('id') ?? null,
    logo,
    handleLogoError,
  }
}
