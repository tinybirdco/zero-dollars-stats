'use client'

/* eslint-disable @next/next/no-img-element */
import Script from 'next/script'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Credentials from '../../components/Credentials'
import useAuth from '../../lib/hooks/use-auth'
import ErrorModal from '../../components/ErrorModal'
import { useCurrentToken } from '../../lib/hooks/use-current-token'
import Metrics from '@/components/metrics'
import Link from 'next/link'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { LogOutIcon } from '@/components/Icons copy'

export default function DashboardPage() {
  const { isAuthenticated, isTokenValid } = useAuth()
  const { token: trackerToken } = useCurrentToken()

  return (
    <>
      <Script
        defer
        src="https://unpkg.com/@tinybirdco/flock.js"
        data-token={trackerToken}
      />

      <div className="min-h-screen text-sm leading-5 text-secondary">
        <div className="bg-body border-b px-5 py-5 sm:px-10 pb-[128px]">
          <div className="flex items-center justify-between gap-2 mb-16">
            <Link href="/" className="flex items-center gap-2">
              <img src="/zds-logo.png" alt="" width={24} height={24} />
              <Text variant="displayxsmall">
                zerodollarstats
              </Text>
            </Link>
            <Button variant="solid" color="secondary">
              Log out
              <LogOutIcon />
            </Button>
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="space-y-6 sm:space-y-10">
              {isAuthenticated && isTokenValid && <Header />}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl">
          <main className="-mt-[105px]">
            {isAuthenticated && !isTokenValid && <ErrorModal />}

            {isAuthenticated && isTokenValid && <Metrics />}
            {/* {isAuthenticated && isTokenValid && <Widgets />} */}
            {!isAuthenticated && <Credentials />}
          </main>
        </div>
      </div>
      {isAuthenticated && (
        <div className="mt-20">
          <Footer />
        </div>
      )}
    </>
  )
}
