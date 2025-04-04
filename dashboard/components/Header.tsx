/* eslint-disable @next/next/no-img-element */
import CurrentVisitors from './CurrentVisitors'
import useDomain from '../lib/hooks/use-domain'
import { Button, TextInput } from '@tremor/react'
import Modal from './Modal'
import { useState } from 'react'
import { useAuthContext } from '../lib/providers/auth-provider'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useAnalyticsWorkspaces from '../lib/hooks/use-analytics-workspaces'
import { useCurrentToken } from '../lib/hooks/use-current-token'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { GlobeIcon, PlusIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from './Dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Text } from './Text'
import { Stack } from './Stack'
import { Select } from './Select'
import { ChevronDownIcon } from './Icons'

export default function Header() {
  const { domain } = useDomain()
  const { data: workspaces } = useAnalyticsWorkspaces()
  const { token: trackerToken } = useCurrentToken()

  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()

  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(
    searchParams.get('is_new') === 'true'
  )

  const fallbackDomain = (params.id?.toString() ?? '')
    .split('_')
    .slice(1, -1)
    .join('.')

  // Don't show instructions if we don't have a tracker token
  if (!trackerToken) {
    // make a similar layout than below out of <skeleton>
    return (
      <div className="flex justify-between w-full flex-col gap-3 lg:flex-row">
        <Stack direction="column" spacing={0.5}>
          <div className="w-40 h-5 bg-gray-200 animate-pulse" />
          <div className="w-52 h-4 bg-gray-200 animate-pulse" />
        </Stack>
        <Stack gap={24}>
          <div className="w-40 h-10 bg-gray-200 animate-pulse" />
          <div className="w-40 h-10 bg-gray-200 animate-pulse" />
        </Stack>
      </div>
    )
  }

  return (
    <div>
      <Stack justify="space-between" width="100%">
        <Stack direction="column" spacing={0.5}>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none select-none rounded-lg hover:bg-black/5 active:bg-black/5 focus:bg-black/5 px-2 -mx-2 transition-all duration-200">
              <Text
                variant="displaysmall"
                className="!font-medium flex items-center"
              >
                {domain ?? fallbackDomain}
                <ChevronDownIcon className="w-4 h-4 ml-2" />
              </Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                {(workspaces ?? [])?.map((ws: any) => (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => router.push(`/${ws.name}`)}
                  >
                    <GlobeIcon className="w-4 h-4 mr-2" />
                    {ws.domain}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsAddPropertyModalOpen(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add new property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Text
            color="02"
            className="flex items-center gap-x-2.5 group transition-all duration-200"
          >
            <a
              href={`https://${fallbackDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-x-1.5 group-hover:text-[#636679] hover:!text-[#25283d] transition-all duration-200"
            >
              https://{fallbackDomain}
            </a>
            /{' '}
            <a
              href="https://cloud.tinybird.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-x-1.5 group-hover:text-[#636679] hover:!text-[#25283d] transition-all duration-200"
            >
              <img src="/zds-logo.png" alt="" width={16} height={16} />#
              {params.id}
            </a>
          </Text>
        </Stack>
        <Stack gap={32}>
          <Stack direction="column" gap={4}>
            <Text color="01" variant="caption">
              Users online
            </Text>
            <CurrentVisitors />
          </Stack>
          <Select
            width={192}
            value={searchParams.get('last_days') ?? '7'}
            onValueChange={value => {
              const params = new URLSearchParams(searchParams.toString())
              params.set('last_days', value)
              router.push(`?${params.toString()}`)
            }}
            options={[
              { label: 'Today', value: '0' },
              { label: 'Yesterday', value: '1' },
              { label: 'Last 7 days', value: '7' },
              { label: 'Last 30 days', value: '30' },
              { label: 'Last 90 days', value: '90' },
              { label: 'Last 365 days', value: '365' },
            ]}
          />
        </Stack>
      </Stack>

      <AddPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
      />

      <PropertyEmbedInstructions
        isOpen={isInstructionsModalOpen}
        onClose={() => {
          setIsInstructionsModalOpen(false)
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
    </div>
  )
}

export function AddPropertyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: (() => void) | null
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
    <Dialog open={isOpen} onOpenChange={onClose ?? (() => {})}>
      <DialogContent className="z-[300] relative">
        <DialogTitle className="text-xl font-semibold mb-4">
          Add website to track
        </DialogTitle>

        <DialogDescription className="text-neutral-64 mb-6">
          Add a website to start collecting analytics data. Enter the domain
          name of the website you want to track (e.g. example.com). Once added,
          we will provide you with a tracking script to add to your website.
        </DialogDescription>

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
            {onClose ? (
              <Button
                variant="secondary"
                color="slate"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              onClick={handleAddProperty}
              loading={isLoading}
              disabled={!domain.trim()}
            >
              Add Website
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
  const { token: trackerToken } = useCurrentToken()

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
