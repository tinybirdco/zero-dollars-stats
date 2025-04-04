'use client'

import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { ChevronRightIcon, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import styles from './ContextMenu.module.css'
import { CheckIcon } from './Icons'

export const ContextMenu = ContextMenuPrimitive.Root

export const ContextMenuTrigger = ContextMenuPrimitive.Trigger

export const ContextMenuGroup = ContextMenuPrimitive.Group

export const ContextMenuPortal = ContextMenuPrimitive.Portal

export const ContextMenuSub = ContextMenuPrimitive.Sub

export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

export const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(styles.subTrigger, inset && styles.itemInset, className)}
      {...props}
    >
      {children}
      <ChevronRightIcon style={{ width: 16, height: 16, marginLeft: 'auto' }} />
    </ContextMenuPrimitive.SubTrigger>
  )
})

ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

export const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.SubContent
      ref={ref}
      className={cn(styles.subContent, className)}
      {...props}
    />
  )
})

ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={cn(styles.content, className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
})

ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(styles.item, inset && styles.itemInset, className)}
      {...props}
    />
  )
})

ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

export const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(styles.checkboxItem, className)}
      checked={checked}
      {...props}
    >
      <span className={styles.itemIndicator}>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
})

ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

export const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(styles.radioItem, className)}
      {...props}
    >
      <span className={styles.itemIndicator}>
        <ContextMenuPrimitive.ItemIndicator>
          <Circle className="fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
})

ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

export const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn(styles.label, inset && styles.labelInset, className)}
      {...props}
    />
  )
})

ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

export const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={cn(styles.separator, className)}
      {...props}
    />
  )
})

ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

export const ContextMenuShortcut = React.forwardRef<
  React.ElementRef<'span'>,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => {
  return <span ref={ref} className={cn(styles.shortcut, className)} {...props} />
})

ContextMenuShortcut.displayName = 'ContextMenuShortcut'
