const config = {
  dashboardURL: process.env.NEXT_PUBLIC_TINYBIRD_DASHBOARD_URL as string,
  trackerToken: process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN as string,
  authToken: process.env.NEXT_PUBLIC_TINYBIRD_AUTH_TOKEN as string,
  host: process.env.NEXT_PUBLIC_TINYBIRD_HOST as string,
} as const

export const LS_AUTH_TOKEN = 'ls_auth_token'
export const LS_WORKSPACE_TOKEN = 'ls_workspace_token'

export default config
