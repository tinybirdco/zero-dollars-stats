'use client'

import { cn } from '@/lib/utils'
import { forwardRef, useRef } from 'react'
import ContentEditable from 'react-contenteditable'
import styles from './Text.module.css'

export type TextVariant =
  | 'displaysmall'
  | 'displayxsmall'
  | 'displaysmall'
  | 'heading'
  | 'body'
  | 'bodysemibold'
  | 'link'
  | 'linksemibold'
  | 'code'
  | 'button'
  | 'caption'
  | 'captionbold'
  | 'captioncode'
  | 'captionlink'
  | 'captionsemibold'
  | 'smallcaptionbold'

export type TextColor =
  | 'default'
  | 'alternative'
  | '01'
  | '02'
  | 'inverse'
  | 'brand'
  | 'error'
  | 'inherit'
  | 'preview'

export type TextAlign = 'left' | 'center' | 'right'

export type TextProps = React.ComponentProps<'span'> & {
  as?: React.ElementType
  variant?: TextVariant
  color?: TextColor
  style?: React.CSSProperties
  align?: TextAlign
  decoration?: React.CSSProperties['textDecoration']
  truncate?: boolean
  role?: React.AriaRole
  htmlFor?: string
}

export const Text = forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      children,
      className,
      as: Component = 'span',
      variant = 'body',
      color = 'inherit',
      align = 'left',
      truncate = false,
      decoration,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          styles.text,
          styles[variant],
          styles[`color-${color}`],
          styles[`align-${align}`],
          decoration && styles[`decoration-${decoration}`],
          truncate && styles.truncate,
          Component === 'label' && styles.label,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Text.displayName = 'Text'

export function TextInput({
  value: defaultValue,
  as = 'span',
  variant = 'displayxsmall',
  color = 'inherit',
  align = 'left',
  decoration,
  truncate = false,
  className,
  onChange,
  disabled,
  ...props
}: {
  onChange: (value: string) => void
  value: string
  as?: string
  variant?: TextVariant
  color?: TextColor
  align?: TextAlign
  decoration?: React.CSSProperties['textDecoration']
  truncate?: boolean
  className?: string
  disabled?: boolean
}) {
  const currentValue = useRef(defaultValue)
  return (
    <ContentEditable
      {...props}
      tagName={as}
      spellCheck={false}
      className={cn(
        styles.text,
        styles.editable,
        styles[variant],
        styles[`color-${color}`],
        styles[`align-${align}`],
        decoration && styles[`decoration-${decoration}`],
        truncate && styles.truncate,
        className
      )}
      disabled={disabled}
      suppressContentEditableWarning
      style={{ outline: 'none' }}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.currentTarget.blur()
          e.preventDefault()
        }
      }}
      onBlur={() => {
        onChange?.(currentValue.current)
      }}
      onChange={e => {
        currentValue.current = e.target.value
      }}
      html={currentValue.current}
    />
  )
}
