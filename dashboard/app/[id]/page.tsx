"use client";

/* eslint-disable @next/next/no-img-element */
import Script from 'next/script';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Widgets from '../../components/Widgets';
import Credentials from '../../components/Credentials';
import useAuth from '../../lib/hooks/use-auth';
import { useAuthContext } from '../../lib/providers/auth-provider';
import ErrorModal from '../../components/ErrorModal';

export default function DashboardPage() {
  const { isAuthenticated, isTokenValid } = useAuth()
  const { trackerToken } = useAuthContext()

  return (
    <>
      {process.env.NODE_ENV === 'production' && (
        <Script
          defer
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-token={trackerToken}
        />
      )}
      <div className="min-h-screen px-5 py-5 text-sm leading-5 bg-body sm:px-10 text-secondary">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-6 sm:space-y-10">
            {isAuthenticated && isTokenValid && (
              <>
                <img src="/icon.svg" alt="" width={24} height={24} />
                <Header />
              </>
            )}
            <main>  
              {isAuthenticated && !isTokenValid && <ErrorModal />}
              {isAuthenticated && isTokenValid && <Widgets />}
              {!isAuthenticated && <Credentials />}
            </main>
          </div>
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
