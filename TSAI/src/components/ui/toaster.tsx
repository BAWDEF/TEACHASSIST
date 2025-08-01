// src/components/ui/toaster.tsx

// Correctly import all components from your toast.tsx file
// They are exported together in a single export statement at the end of toast.tsx
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider, // This is the Radix ToastProvider
  ToastTitle,
  ToastViewport,
  ToastAction // Also include ToastAction if you plan to use it
} from "@/components/ui/toast" 

import { useToast } from "@/hooks/use-toast" // This import path is correct

export function Toaster() {
  const { toasts } = useToast() // Get the current list of toasts from the hook

  return (
    <ToastProvider> {/* Radix Toast Provider */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action} {/* Render action button if provided */}
            <ToastClose /> {/* Close button for the toast */}
          </Toast>
        )
      })}
      <ToastViewport /> {/* Radix Toast Viewport where toasts are rendered */}
    </ToastProvider>
  )
}
