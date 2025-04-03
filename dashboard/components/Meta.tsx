import Head from 'next/head'
import { useAuthContext } from '../lib/providers/auth-provider'

const meta = {
  title: 'Web Analytics Dashboard  · Tinybird',
  description: 'Web Analytics Starter Kit built with Tinybird and Next.js',
  url: 'https://analytics.tinybird.co',
} as const

export default function Meta() {
  const { dashboardURL } = useAuthContext()
  const { description, title, url } = meta
  const image = dashboardURL ? `${dashboardURL}/banner.png` : undefined

  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
      <meta name="theme-color" content="#0066FF" />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  )
}
