import { useQueryPipe } from '../api'
import { KpisData, KpiTotals, KpiType } from '../types/kpis'
import useDateFilter from './use-date-filter'
import { QueryError, QueryPipe } from '../types/api'
import { useCurrentToken } from './use-current-token'

function getNotFoundColumnsWarning(warning: QueryError | null): string | null {
  if (!warning) return null
  try {
    // parsing the error message to get the columns that are not found
    const rawColumns = warning.message
      .split('required columns:')[1]
      .trim()
      .split("'")
      .map(part => part.trim())
      .filter(Boolean)
      .join()
      .split(',')
      .slice(0, -1)
    const columns = Array.from(new Set(rawColumns))
    const formatter = new Intl.ListFormat('en', {
      style: 'long',
      type: 'conjunction',
    })
    return `${formatter.format(columns)} column${
      columns.length ? 's' : ''
    } at the analytics_events data source cannot be found`
  } catch (error) {
    return null
  }
}

export default function useKpiTotals() {
  const { startDate: date_from, endDate: date_to } = useDateFilter()
  const { token } = useCurrentToken()

  // If we sent the same value for date_from and date_to, the result is one row per hour.
  // We need one row per date, so we're sending one extra day in the filter and removing it afterwards.
  let date_to_aux = date_to ? new Date(date_to) : new Date()
  date_to_aux.setDate(date_to_aux.getDate() + 1)
  const date_to_aux_str = date_to_aux.toISOString().substring(0, 10)

  const { data: queryResponse, error: queryError, isLoading } = useQueryPipe<QueryPipe<KpisData>>('kpis', {
    date_from,
    date_to: date_to_aux_str,
    token,
  })

  const queryData = (queryResponse?.data ?? []).filter(
    (record: KpisData) => record.date !== date_to_aux_str
  )

  // Sum total KPI value from the trend
  const _KPITotal = (kpi: KpiType): number => 
    queryData.reduce((prev: number, curr: KpisData) => (curr[kpi] ?? 0) + prev, 0)

  // Get total number of sessions
  const totalVisits = _KPITotal('visits')

  // Sum total KPI value from the trend, ponderating using sessions
  const _ponderatedKPIsTotal = (kpi: KpiType): number => 
    queryData.reduce((prev: number, curr: KpisData) => 
      prev + ((curr[kpi] ?? 0) * curr.visits / totalVisits), 0
    )

  const totals: KpiTotals = {
    avg_session_sec: _ponderatedKPIsTotal('avg_session_sec'),
    pageviews: _KPITotal('pageviews'),
    visits: totalVisits,
    bounce_rate: _ponderatedKPIsTotal('bounce_rate')
  }

  return {
    data: totals,
    isLoading,
    error: queryError ? getNotFoundColumnsWarning(queryError as QueryError) : null
  }
}
