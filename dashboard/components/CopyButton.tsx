'use client'

import { useEffect, useState } from 'react'
import { CheckIcon, CopyIcon } from './Icons'
import { Slot } from '@radix-ui/react-slot'
import { Tooltip } from './Tooltip'
import { colors } from '@/lib/colors'
import { Button } from './Button'

export function CopyButton({
  value,
  color = 'primary',
  children,
  onCopy,
  disabled,
  copyTooltip = 'Copy'
}: {
  value: string
  color?: 'default' | 'primary' | 'inverse' | '01' | '02'
  children?: React.ReactNode
  onCopy?: (value: string) => void
  disabled?: boolean
  copyTooltip?: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }
    const timer = setTimeout(() => {
      setCopied(false)
      onCopy?.(value)
    }, 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copied])

  const copyValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event?.stopPropagation()
      event?.preventDefault()
      navigator.clipboard.writeText(value)
    } finally {
      setCopied(true)
    }
  }

  return (
    <Tooltip content={disabled ? null : copied ? 'Copied!' : copyTooltip} side="top">
      {children ? (
        <Slot onClick={copyValue}>{children}</Slot>
      ) : (
        <Button
          size="icon"
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            color:
              color === 'primary'
                ? 'var(--icon-brand-color)'
                : color === 'inverse'
                ? 'var(--icon-inverse-color)'
                : color === '01'
                ? 'var(--icon-01-color)'
                : color === '02'
                ? 'var(--icon-02-color)'
                : 'var(--icon-color)',
            outline: 'none',
            border: 'none',
            background: 'none',
            opacity: disabled ? 0.5 : 1
          }}
          disabled={disabled}
          type="button"
          onClick={copyValue}
        >
          {copied ? (
            <CheckIcon
              size={20}
              color={color === 'default' ? colors.icon.brandDark : colors.icon.brand}
            />
          ) : (
            <CopyIcon size={16} />
          )}
        </Button>
      )}
    </Tooltip>
  )
}
