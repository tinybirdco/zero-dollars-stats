import { GetServerSidePropsContext } from 'next'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context

  // Get tokens from cookies
  const authToken = req.cookies.token ?? null
  const workspaceToken = req.cookies.workspace_token ?? null

  return {
    props: {
      authToken,
      workspaceToken,
    },
  }
} 