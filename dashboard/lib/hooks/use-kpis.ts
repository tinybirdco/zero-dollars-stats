import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

import { useQueryPipe } from '../api'
import { KpisData, KpiType, isKpi, KPI_OPTIONS } from '../types/kpis'
import useDateFilter from './use-date-filter'
import { ChartValue } from '../types/charts'
import { useCurrentToken } from './use-current-token'
import { QueryPipe } from '../types/api'

const arrayHasCurrentDate = (dates: string[], isHourlyGranularity: boolean) => {
  const now = format(new Date(), isHourlyGranularity ? 'HH:mm' : 'MMM dd, yyyy')
  return dates[dates.length - 1] === now
}

export default function useKpis() {
  const { token } = useCurrentToken()
  const { startDate, endDate } = useDateFilter()
  const router = useRouter()
  const isBrowser = typeof window !== 'undefined'
  const searchParams = new URLSearchParams(
    isBrowser ? window.location.search : ''
  )

  const kpiParam = searchParams.get('kpi') || undefined
  const kpi = isKpi(kpiParam) ? kpiParam : 'visits'
  const kpiOption = KPI_OPTIONS.find(({ value }) => value === kpi)!

  const { data: queryResponse, isLoading, error } = useQueryPipe<QueryPipe<KpisData>>('kpis', {
    date_from: startDate,
    date_to: endDate,
    token,
  })

  const queryData = queryResponse?.data ?? []
  const isHourlyGranularity = !!startDate && !!endDate && startDate === endDate
  const dates = queryData.map(({ date }) =>
    format(new Date(date), isHourlyGranularity ? 'HH:mm' : 'MMM dd, yyyy')
  )

  const isCurrentData = arrayHasCurrentDate(dates, isHourlyGranularity)

  const data = queryData.length > 0
    ? isCurrentData
      ? queryData.reduce(
          (acc: ChartValue[][], record: KpisData, index: number) => {
            const value = record[kpi] ?? 0

            const pastValue = index < queryData.length - 1 ? value : ''
            const currentValue = index > queryData.length - 3 ? value : ''

            const [pastPart, currentPart] = acc

            return [
              [...pastPart, pastValue],
              [...currentPart, currentValue],
            ]
          },
          [[], []]
        )
      : [queryData.map((record: KpisData) => record[kpi] ?? 0), ['']]
    : [[], []]

  const setKpi = (kpi: KpiType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('kpi', kpi)
    router.push(`?${params.toString()}`)
  }

  return {
    setKpi,
    kpi,
    kpiOption,
    data: {
      dates,
      data,
    },
    isLoading,
    error,
  }
}
