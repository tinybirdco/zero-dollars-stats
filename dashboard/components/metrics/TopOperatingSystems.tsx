import { getConfig } from '@/lib/api'
import useDateFilter from '@/lib/hooks/use-date-filter'
import { useCurrentToken } from '@/lib/hooks/use-current-token'
import Card from '../Card'
import { BarList } from '@tinybirdco/charts'

export default function TopOperatingSystems() {
  const { host } = getConfig()
  const { token: currentToken } = useCurrentToken()
  const { startDate, endDate } = useDateFilter()

  return (
    <Card title="Top Operating Systems">
      <BarList
        endpoint={host + '/v0/pipes/top_operating_systems.json'}
        token={currentToken}
        index="os"
        categories={['visits']}
        params={{
          limit: 8,
          date_from: startDate,
          date_to: endDate,
        }}
        colorPalette={['#ECEBFE']}
        height={224}
      />
    </Card>
  )
} 