'use client'
import InView from './InView'
import {
  AreaChart,
  BarChart,
  BarList,
  ChartProvider,
  DonutChart,
  PieChart,
  tinybirdBorderColor,
} from '@tinybirdco/charts'
import { getConfig } from '../lib/api'
import useDateFilter from '../lib/hooks/use-date-filter'
import KpisTabs from './KpisTabs'
import useKpis from '../lib/hooks/use-kpis'
import useKpiTotals from '../lib/hooks/use-kpi-totals'
import { typography } from '../styles/theme'
import useDomain from '../lib/hooks/use-domain'
import { useCurrentToken } from '../lib/hooks/use-current-token'

const enum WidgetHeight {
  XLarge = 588,
  Large = 472,
  Medium = 344,
  Small = 216,
}

export default function Widgets() {
  const { token } = useCurrentToken()
  const { host } = getConfig()

  console.log('token', token)

  function buildEndointUrl(host: string, endpoint: string) {
    const apiUrl =
      {
        'https://ui.tinybird.co': 'https://api.tinybird.co',
        'https://ui.us-east.tinybird.co': 'https://api.us-east.tinybird.co',
      }[host] ?? host

    return `${process.env.NEXT_PUBLIC_TINYBIRD_HOST}/v0/pipes/${endpoint}.json?token=${token}`
  }

  const { startDate, endDate } = useDateFilter()
  const { kpi, setKpi } = useKpis()
  const { data: kpiTotals } = useKpiTotals()

  const { domain } = useDomain()

  if (!host) {
    return <div>No host</div>
  }

  if (!token) {
    return <div>loading</div>
  }

  const topSourcesEndpoint = buildEndointUrl(host, 'top_sources')
  const topPagesEndpoint = buildEndointUrl(host, 'top_pages')
  const topDevicesEndpoint = buildEndointUrl(host, 'top_devices')
  const topBrowsersEndpoint = buildEndointUrl(host, 'top_browsers')
  const topLocationsEndpoint = buildEndointUrl(host, 'top_locations')
  const trendEndpoint = buildEndointUrl(host, 'trend')
  const kpisEndpoint = buildEndointUrl(host, 'kpis')

  return (
    <ChartProvider
      queryConfig={{
        token,
        fetcher: (url, options) =>
          fetch(url, {
            ...options,
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.json()),
      }}
      styles={{
        borderRadius: 8,
        borderColor: tinybirdBorderColor,
        colorPalette: ['#27F795', '#F72768', '#F7D427', '#2768F7'],
        padding: 24,
        fontFamily: typography.fontFamily,
        fontSize: 12,
      }}
    >
      <div className="grid grid-cols-2 gap-5 sm:gap-10 grid-rows-3-auto">
        <div
          className="col-span-2 relative border bg-white rounded-lg overflow-hidden"
        >
          <div className="top-0 left-0 right-0 -mb-2">
            <KpisTabs value={kpi} onChange={setKpi} totals={kpiTotals} />
          </div>
          <hr/>
          <AreaChart
            endpoint={kpisEndpoint}
            index="date"
            categories={[kpi]}
            boxShadow="none"
            borderRadius={0}
            borderColor="transparent"
            params={{
              date_from: startDate,
              date_to: endDate,
            }}
            height={WidgetHeight.XLarge}
            options={{
              grid: {
                left: '2%',
                right: '2%',
                top: 0,
                bottom: 0,
                containLabel: true,
              },
              yAxis: {
                splitNumber: 4,
                type: 'value',
                splitLine: {},
                axisLabel: {
                  fontSize: 12,
                },
              },
            }}
          />
        </div>
        <div className="col-start-1 col-span-2 lg:col-span-1 grid grid-cols-1 gap-5 sm:gap-10 grid-rows-3-auto">
          <InView height={WidgetHeight.Small}>
            <BarChart
              endpoint={trendEndpoint}
              index="t"
              categories={['visits']}
              title="Users in last 30 minutes"
              height={WidgetHeight.Small}
              options={{
                yAxis: { show: false },
                xAxis: { show: false },
              }}
              params={{
                date_from: startDate,
                date_to: endDate,
              }}
            />
          </InView>
          <InView height={WidgetHeight.Large}>
            <BarList
              endpoint={topPagesEndpoint}
              index="pathname"
              categories={['visits', 'hits']}
              title="Top Pages"
              params={{
                limit: 8,
                date_from: startDate,
                date_to: endDate,
              }}
              height={WidgetHeight.Large}
              indexConfig={{
                renderBarContent: item => (
                  <a
                    className="truncate hover:underline"
                    href={`https://${domain}${item.label}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                ),
              }}
            />
          </InView>
          <InView height={WidgetHeight.Large}>
            <BarList
              endpoint={topLocationsEndpoint}
              index="location"
              categories={['visits', 'hits']}
              title="Top Locations"
              params={{
                limit: 8,
                date_from: startDate,
                date_to: endDate,
              }}
              height={WidgetHeight.Large}
              indexConfig={{
                renderBarContent: item => item.label || 'Unknown',
              }}
            />
          </InView>
        </div>
        <div className="col-start-1 col-span-2 lg:col-start-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-10 grid-rows-2-auto lg:grid-rows-3-auto">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <InView height={WidgetHeight.Large}>
              <BarList
                endpoint={topSourcesEndpoint}
                index="referrer"
                categories={['visits', 'hits']}
                title="Top Sources"
                params={{
                  limit: 8,
                  date_from: startDate,
                  date_to: endDate,
                }}
                height={WidgetHeight.Large}
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
            </InView>
          </div>
          <InView height={WidgetHeight.Medium}>
            <DonutChart
              endpoint={topDevicesEndpoint}
              index="device"
              categories={['visits', 'hits']}
              title="Top Devices"
              params={{
                limit: 8,
                date_from: startDate,
                date_to: endDate,
              }}
              height={WidgetHeight.Medium}
              showLegend
              options={{
                yAxis: { show: false },
              }}
            />
          </InView>
          <InView height={WidgetHeight.Medium}>
            <PieChart
              endpoint={topBrowsersEndpoint}
              index="browser"
              categories={['visits', 'hits']}
              title="Top Browsers"
              params={{
                limit: 8,
                date_from: startDate,
                date_to: endDate,
              }}
              height={WidgetHeight.Medium}
              showLegend
              options={{
                yAxis: { show: false },
              }}
            />
          </InView>
        </div>
      </div>
    </ChartProvider>
  )
}
