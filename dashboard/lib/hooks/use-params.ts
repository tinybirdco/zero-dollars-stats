import { useRouter, useSearchParams } from 'next/navigation'

export default function useParams<T extends string>({
  key,
  defaultValue,
  values,
}: {
  key: string
  defaultValue?: T
  values: T[]
}): [T, (param: T) => void] {
  const router = useRouter()
  const searchParams = useSearchParams()
  const param = searchParams.get(key) as T
  const value =
    typeof param === 'string' && values.includes(param)
      ? param
      : defaultValue ?? values[0]

  const setParam = (param: T) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, param)
    router.push(`?${params.toString()}`)
  }

  return [value, setParam]
}
