import BounceRate from './BounceRate'
import Pageviews from './Pageviews'
import TopPages from './TopPages'
import TopSources from './TopSources'
import TopLocations from './TopLocations'
import TopDevices from './TopDevices'
import TopBrowsers from './TopBrowsers'
import Visitors from './Visitors'

export default function Metrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Visitors />
      <Pageviews />
      <BounceRate />

      <TopPages />
      <TopSources />
      <TopLocations />
      <TopDevices />
      <TopBrowsers />
      {/* <TopOperatingSystems /> */}
    </div>
  )
}
