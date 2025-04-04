'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { ChevronRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import styles from './DropdownMenu.module.css'
import { CheckIcon } from './Icons'

export const DropdownMenu = DropdownMenuPrimitive.Root

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuGroup = DropdownMenuPrimitive.Group

export const DropdownMenuPortal = DropdownMenuPrimitive.Portal

export const DropdownMenuSub = DropdownMenuPrimitive.Sub

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(styles.subTrigger, inset && styles.itemInset, className)}
      {...props}
    >
      {children}
      <ChevronRight style={{ width: 16, height: 16, marginLeft: 'auto' }} />
    </DropdownMenuPrimitive.SubTrigger>
  )
})

DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(styles.subContent, className)}
      {...props}
    />
  )
})

DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(styles.content, className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
})

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
    isLoading?: boolean
  }
>(({ className, inset, isLoading, disabled, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(styles.item, inset && styles.itemInset, className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
})

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(styles.checkboxItem, className)}
      checked={checked}
      {...props}
    >
      <span className={styles.itemIndicator}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
})

DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(styles.radioItem, className)}
      {...props}
    >
      <span className={styles.itemIndicator}>
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
})

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(styles.label, inset && styles.labelInset, className)}
      {...props}
    />
  )
})

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn(styles.separator, className)}
      {...props}
    />
  )
})

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export const DropdownMenuShortcut = React.forwardRef<
  React.ElementRef<'span'>,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => {
  return <span ref={ref} className={cn(styles.shortcut, className)} {...props} />
})

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'
