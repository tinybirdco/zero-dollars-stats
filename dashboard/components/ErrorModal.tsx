import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@tremor/react'
import { useAnalytics } from './Provider'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './Dialog'
import { colors } from '../styles/theme'

export default function ErrorModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { error, setError } = useAnalytics()

  const handleClose = () => {
    setError(null)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('token')
    router.push(`/?${params.toString()}`)
  }

  return (
    <Dialog open={!!error} onOpenChange={handleClose}>
      <DialogContent>
        <span className="text-sm text-error font-semibold flex items-center gap-2 mb-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="16" height="16" rx="8" fill={colors.error} />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.4991 5.25721C6.15616 4.91426 5.60015 4.91426 5.25721 5.25721C4.91426 5.60015 4.91426 6.15616 5.25721 6.4991L6.78265 8.02455L5.25721 9.54999C4.91427 9.89294 4.91427 10.449 5.25721 10.7919C5.60015 11.1348 6.15617 11.1348 6.49911 10.7919L8.02455 9.26645L9.54999 10.7919C9.89293 11.1348 10.4489 11.1348 10.7919 10.7919C11.1348 10.4489 11.1348 9.89293 10.7919 9.54999L9.26645 8.02455L10.7919 6.49911C11.1348 6.15617 11.1348 5.60015 10.7919 5.25721C10.4489 4.91427 9.89293 4.91427 9.54999 5.25721L8.02455 6.78265L6.4991 5.25721Z"
              fill="white"
            />
          </svg>
          Error
        </span>
        <DialogTitle className="text-2xl">
          {error?.message
            ? `${error.message.charAt(0).toUpperCase()}${error.message.slice(
                1
              )}`
            : 'Something went wrong'}
        </DialogTitle>
        <div className="my-8">
          <DialogDescription>
            {`Go to `}
            <a
              href="https://docs.tinybird.co/api-reference/api-reference.html#authentication"
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              https://docs.tinybird.co/api-reference/api-reference.html#authentication
            </a>
            {` for tips about how to fix this problem.`}
          </DialogDescription>
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" color="slate" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
