import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  
  // Handle OPTIONS requests
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  const nextUrl = { ...request.nextUrl } as typeof request.nextUrl
  const isAuthRoute = nextUrl.pathname.startsWith("/auth")

  // Get the auth response from Auth0
  const authRes = await auth.middleware(request);

  // Handle auth-related paths
  if (isAuthRoute) {
    return authRes;
  }

  // Get the session
  const session = await auth.getSession(request);

  // Redirect to login if not authenticated and not on home page
  if (!session && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(
      new URL(
        "/auth/login?returnTo=" + request.nextUrl.pathname,
        request.nextUrl.origin
      )
    );
  }

  // Allow access to home page without authentication
  if (!session) {
    return NextResponse.next();
  }

  // Get the access token
  const { token: accessToken } = await auth.getAccessToken(request, authRes);

  // Fetch user tokens from the API
  const response = await fetch(`${process.env.NEXT_PUBLIC_TINYBIRD_HOST}/v0/user/tokens`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Handle unauthorized access
  if (!response.ok) {
    return NextResponse.redirect(
      new URL("/auth/logout", request.nextUrl.origin)
    );
  }

  const data = await response.json();

  // Check email verification
  if (data.email_verified === false) {
    return NextResponse.redirect(
      `https://www.tinybird.co/waiting?${new URLSearchParams({
        email: session.user.email || "",
      })}`
    );
  }

  // Set only the required cookies
  authRes.cookies.set("userEmail", session.user.email || "");
  authRes.cookies.set("token", data.user_token);
  authRes.cookies.set("workspace_token", data.workspace_token);

  return authRes;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|i).*)",
  ],
};