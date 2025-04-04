import * as React from 'react'
import { Text } from './Text'
import { cn } from '@/lib/utils'
import styles from './Badge.module.css'
import { cva } from 'class-variance-authority'

type BadgeColor = 'primary' | 'secondary' | 'warning' | 'error' | 'brand'

const badgeVariants = cva(styles.badge, {
  variants: {
    color: {
      primary: styles.primary,
      secondary: styles.secondary,
      warning: styles.warning,
      error: styles.error,
      brand: styles.brand
    }
  },
  defaultVariants: {
    color: 'primary'
  }
})

export const Badge = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { color?: BadgeColor }
>(({ children, color = 'primary', className, ...props }, ref) => {
  const colorForText = ['primary', 'secondary', 'warning'].includes(color)
    ? 'default'
    : undefined

  return (
    <span className={cn(badgeVariants({ color, className }))} ref={ref} {...props}>
      {typeof children === 'string' ? (
        <Text as="span" variant="caption" color={colorForText}>
          {children}
        </Text>
      ) : (
        children
      )}
    </span>
  )
})

Badge.displayName = 'Badge'
