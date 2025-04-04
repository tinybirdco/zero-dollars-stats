import { useQueryPipe } from '@/lib/api'
import useDateFilter from '@/lib/hooks/use-date-filter'
import { SqlChart } from '../SqlChart'
import { useCurrentToken } from '@/lib/hooks/use-current-token'
import Card from '../Card'
import { QueryPipe } from '@/lib/types/api'
import { KpisData } from '@/lib/types/kpis'
import useKpiTotals from '@/lib/hooks/use-kpi-totals'
import { Skeleton } from '../Skeleton'

export default function Visitors() {
  const { token: currentToken } = useCurrentToken()
  const { startDate, endDate } = useDateFilter()

  const { data: kpiTotals } = useKpiTotals()

  const { data, isLoading, error } = useQueryPipe<QueryPipe<KpisData>>('kpis', {
    date_from: startDate,
    date_to: endDate,
    token: currentToken,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card title="Visitors" addon={<span className="font-medium text-lg">{kpiTotals?.visits}</span>}>
      {!data ? (
        <Skeleton height={224} />
      ) : (
        <SqlChart
          data={data?.data}
          isLoading={isLoading}
          height={224}
          error={error?.message}
          xAxisKey="date"
          yAxisKey="visits"
        />
      )}
    </Card>
  )
}
