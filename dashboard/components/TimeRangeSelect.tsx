'use client'

import { timeRanges } from '@/lib/types'
import { Fragment } from 'react'
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from './Select'

export function TimeRangeSelect({
  value,
  onChange,
  className,
  style
}: {
  value: number | undefined
  onChange: (value: number) => void
  className?: string
  style?: React.CSSProperties
}) {
  const defaultValue = (timeRanges.find(tr => tr.value === value) || timeRanges[4]).value
  return (
    <SelectRoot
      defaultValue={String(defaultValue)}
      onValueChange={value => onChange(Number(value))}
    >
      <SelectTrigger className={className} style={{ minWidth: 160, ...style }}>
        <span>
          Last <SelectValue placeholder="Select time range" />
        </span>
      </SelectTrigger>
      <SelectContent sideOffset={8}>
        {timeRanges.map(option => (
          <Fragment key={option.label}>
            <SelectItem value={String(option.value)}>{option.label}</SelectItem>
            {option.separator && <SelectSeparator />}
          </Fragment>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}
