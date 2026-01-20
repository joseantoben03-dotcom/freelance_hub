'use client'

import { useToast } from '@/hooks/use-toast.js'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast.jsx'

export function Toaster() {
  const { toasts } = useToast()

  return (
    
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (

              {title && {title}}
              {description && (
                {description}
              )}
            
            {action}

        )
      })}

  )
}


