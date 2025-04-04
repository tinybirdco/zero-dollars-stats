import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../Dialog'
import CredentialsForm from './CredentialsForm'
import { useSearchParams } from 'next/navigation'

export default function Credentials() {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsOpen(true)
    return () => setIsOpen(false)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={() => undefined}>
      <DialogContent>
        <DialogTitle id="credentials-title">Enter credentials</DialogTitle>
        <DialogDescription>
          To visualize your analytics data in the pre-built dashboard, you need
          to specify a token with read access to the pipes, and your workspace
          Host.
        </DialogDescription>
        <CredentialsForm />
      </DialogContent>
    </Dialog>
  )
}
