'use client'

/* eslint-disable @next/next/no-img-element */
import Script from 'next/script'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Widgets from '../../components/Widgets'
import Credentials from '../../components/Credentials'
import useAuth from '../../lib/hooks/use-auth'
import ErrorModal from '../../components/ErrorModal'
import { useCurrentToken } from '../../lib/hooks/use-current-token'
import { Button } from '@tremor/react'
import Metrics from '@/components/metrics'

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
          <div className="mx-auto max-w-7xl">
            <div className="space-y-6 sm:space-y-10">
              {isAuthenticated && isTokenValid && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <img src="/icon.svg" alt="" width={24} height={24} />
                    <Button variant="light" color="slate">
                      Log out
                    </Button>
                  </div>
                  <Header />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl">
          <main className="relative z-10 -mt-[105px]">
            {isAuthenticated && !isTokenValid && <ErrorModal />}

            {isAuthenticated && isTokenValid && <Metrics />}
            {/* {isAuthenticated && isTokenValid && <Widgets />} */}
            {!isAuthenticated && <Credentials />}
          </main>
          {isAuthenticated && (
            <div className="mt-20">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
