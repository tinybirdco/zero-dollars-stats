import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Text } from './Text'

export default function Footer() {
  const params = useParams()

  return (
    <div className="bg-body border-t px-5 py-5 sm:px-10 pb-20">
      <div className="mx-auto max-w-7xl flex md:flex-row flex-col justify-between gap-y-2">
        <Text color="01">zerodollarstats is a tinybird product</Text>
        <Text color="01">
          <Link
            href={`https://cloud.tinybird.co/gcp/europe-west3/${params.id}`}
            className="flex items-center gap-x-1.5"
          >
            view your associated workspace <ArrowRightIcon size={16} />
          </Link>
        </Text>
      </div>
    </div>
  )
}
