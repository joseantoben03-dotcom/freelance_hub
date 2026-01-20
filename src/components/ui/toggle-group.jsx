'use client'

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'

import { cn } from '@/lib/utils.js'
import { toggleVariants } from '@/components/ui/toggle'

const ToggleGroupContext = React.createContext
>({
  size: 'default',
  variant: 'default',
})

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}) {
  return (

        {children}

  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}) {
  const context = React.useContext(ToggleGroupContext)

  return (
    
      {children}
    
  )
}

export { ToggleGroup, ToggleGroupItem }


