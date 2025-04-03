/* eslint-disable @next/next/no-img-element */
import CurrentVisitors from './CurrentVisitors'
import DateFilter from './DateFilter'
import useDomain from '../lib/hooks/use-domain'
import { Button, Dropdown, DropdownItem, TextInput } from '@tremor/react'
import Modal from './Modal'
import { useState } from 'react'
import { useAuthContext } from '../lib/providers/auth-provider'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useAnalyticsWorkspaces from '../lib/hooks/use-analytics-workspaces'

const Logo = () => {
  const { logo, handleLogoError } = useDomain()

  return (
    <img
      src={logo}
      alt=""
      width={16}
      height={16}
      onError={handleLogoError}
      loading="lazy"
    />
  )
}

export default function Header() {
  
  const { data: workspaces } = useAnalyticsWorkspaces()
  const { trackerToken } = useAuthContext()
  
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(
    searchParams.get('is_new') === 'true'
  )
  

  const fallbackDomain = (params.id?.toString() ?? '').split('_').slice(1, -1).join('.')
  
  // Don't show instructions if we don't have a tracker token
  if (!trackerToken) {
    return null
  }

  return (
    <header className="flex justify-between flex-col lg:flex-row gap-6">
      <div className="flex gap-2 justify-between md:justify-start">
        <div className="relative z-[100]">
          <Dropdown icon={Logo} value={fallbackDomain}>
            {(workspaces ?? [])?.map((ws: any) => (
              <DropdownItem
                key={ws.id}
                value={ws.domain}
                onClick={() => router.push(`/${ws.name}`)}
              >
                {ws.domain}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddPropertyModalOpen(true)}>
            Add property
          </Button>
          <Button
            variant="secondary"
            color="slate"
            onClick={() => setIsHelpModalOpen(true)}
          >
            Help
          </Button>
        </div>
        <CurrentVisitors />
      </div>
      <DateFilter />

      <AddPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
      />

      <PropertyEmbedInstructions
        isOpen={isInstructionsModalOpen}
        onClose={() => {
          setIsInstructionsModalOpen(false)
          // Remove is_new from URL
          const params = new URLSearchParams(searchParams.toString())
          params.delete('is_new')
          router.replace(`?${params.toString()}`)
        }}
        trackerToken={trackerToken}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </header>
  )
}

export function AddPropertyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: (() => void )| null
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { authToken, host } = useAuthContext()
  const [domain, setDomain] = useState('')
  const router = useRouter()

  const isValidDomain = (domain: string) => {
    // Basic domain validation - allows subdomains and common TLDs
    const domainRegex =
      /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
    return domainRegex.test(domain.replace(/^https?:\/\//, ''))
  }

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value)
    setError(null)
  }

  const handleAddProperty = async () => {
    setError(null)

    // Validate domain
    const cleanDomain = domain.replace(/^https?:\/\//, '').trim()
    if (!cleanDomain) {
      setError('Please enter a domain name')
      return
    }
    if (!isValidDomain(cleanDomain)) {
      setError('Please enter a valid domain name (e.g. example.com)')
      return
    }

    setIsLoading(true)

    try {
      const url = new URL(`${host}/v1/workspaces`)

      const normalizedDomain = cleanDomain.replace(/\./g, '_')
      const workspaceName = `wa_${normalizedDomain}_${Math.round(
        Math.random() * 100
      )}`
      const starterKit = 'web-analytics'

      url.searchParams.set('name', workspaceName)
      url.searchParams.set('starter_kit', starterKit)

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!res.ok) {
        throw new Error('Failed to create workspace')
      }

      const workspace = await res.json()
      const workspaceId = workspace.id

      router.push(`/${workspaceId}`)
    } catch (error) {
      console.error(error)
      setError('Failed to add property. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose ?? (() => {})}>
      <Modal.Content className="z-[300] relative">
        <Modal.Title className="text-xl font-semibold mb-4">
          Add website to track
        </Modal.Title>

        <Modal.Description className="text-neutral-64 mb-6">
          Add a website to start collecting analytics data. Enter the domain
          name of the website you want to track (e.g. example.com). Once added,
          we will provide you with a tracking script to add to your website.
        </Modal.Description>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="domain"
              className="block text-sm font-medium text-secondary mb-2"
            >
              Website Domain
            </label>
            <TextInput
              id="domain"
              value={domain}
              onChange={handleDomainChange}
              placeholder="example.com"
              error={!!error}
              className="w-full"
            />
            {error && <p className="mt-2 text-sm text-error">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            {onClose ? <Button
              variant="secondary"
              color="slate"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button> : null}
            <Button
              onClick={handleAddProperty}
              loading={isLoading}
              disabled={!domain.trim()}
            >
              Add Website
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

function PropertyEmbedInstructions({
  isOpen,
  onClose,
  trackerToken,
}: {
  isOpen: boolean
  onClose: () => void
  trackerToken: string
}) {
  const scriptCode = `<script defer
  src="https://unpkg.com/@tinybirdco/flock.js"
  data-host="https://api.tinybird.co"
  data-token="${trackerToken}"
/>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptCode)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content className="z-[300] relative">
        <Modal.Title className="text-xl font-semibold mb-4">
          Start collecting analytics data
        </Modal.Title>

        <Modal.Description className="text-neutral-64 mb-6">
          Add this script to your website&apos;s{' '}
          <code className="bg-neutral-08 px-1 py-0.5 rounded">
            &lt;head&gt;
          </code>{' '}
          tag to start collecting analytics data.
        </Modal.Description>

        <div className="space-y-6">
          <div className="bg-neutral-08 p-4 rounded-lg relative group">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-all">
              {scriptCode}
            </pre>
            <Button
              variant="secondary"
              size="xs"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={copyToClipboard}
            >
              Copy
            </Button>
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={onClose}>Got it</Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

function HelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { trackerToken } = useAuthContext()

  const scriptCode = `<script defer
  src="https://unpkg.com/@tinybirdco/flock.js"
  data-host="https://api.tinybird.co"
  data-token="${trackerToken}"
/>`

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content className="z-[300] relative">
        <Modal.Title className="text-xl font-semibold mb-4">
          Start tracking your website
        </Modal.Title>

        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-neutral-64 text-sm">
              Add the following tracking script to your website&apos;s{' '}
              <code className="bg-neutral-08 px-1 py-0.5 rounded">
                &lt;head&gt;
              </code>{' '}
              tag.
            </p>

            <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-all bg-neutral-08 p-4 rounded-lg">
              {scriptCode}
            </pre>

            <p className="text-neutral-64 text-sm">
              Once installed, you&apos;ll start seeing data in your dashboard
              within a few seconds. Track visitors, page views, and more in
              real-time.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}
