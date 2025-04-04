import { getConfig } from '@/lib/api'
import useDateFilter from '@/lib/hooks/use-date-filter'
import { useCurrentToken } from '@/lib/hooks/use-current-token'
import Card from '../Card'
import { BarList } from '@tinybirdco/charts'

export default function TopSources() {
  const { host } = getConfig()
  const { token: currentToken } = useCurrentToken()
  const { startDate, endDate } = useDateFilter()

  return (
    <Card title="Top Sources">
      <BarList
        endpoint={host + '/v0/pipes/top_sources.json'}
        token={currentToken}
        index="referrer"
        categories={['visits']}
        params={{
          limit: 8,
          date_from: startDate,
          date_to: endDate,
        }}
        colorPalette={['#ECEBFE']}
        height={224}
        indexConfig={{
          renderBarContent: item =>
            item.label ? (
              <a
                href={`https://${item.label}`}
                className="truncate hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            ) : (
              'Direct'
            ),
        }}
      />
    </Card>
  )
} 