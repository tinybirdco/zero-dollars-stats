import { Auth0Client } from '@auth0/nextjs-auth0/server'
import { NextResponse } from 'next/server'


export const auth = new Auth0Client({
  authorizationParameters: {
    scope: 'openid profile email offline_access',
  },
  appBaseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
  allowInsecureRequests: true,
  async onCallback(error, context) {
    // redirect the user to a custom error page
    if (error) {
      return NextResponse.redirect(
        new URL(
          `/error?error=${error.message}`,
          process.env.NEXT_PUBLIC_APP_BASE_URL
        )
      )
    }

    // complete the redirect to the provided returnTo URL
    return NextResponse.redirect(
      new URL(context.returnTo || '/', process.env.NEXT_PUBLIC_APP_BASE_URL)
    )
  },
})
