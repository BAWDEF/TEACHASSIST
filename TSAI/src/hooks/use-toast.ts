// src/hooks/use-toast.ts

import * as React from "react"

// Import necessary types from your existing toast.tsx
import { ToastActionElement, ToastProps } from "@/components/ui/toast"

// Constants for toast management
const TOAST_LIMIT = 1 // Max number of toasts visible at once
const TOAST_REMOVE_DELAY = 10000 // How long a toast stays before being removed from memory

// Define the type for a toast managed by this system
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Action types for the reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

// Simple ID generator for toasts
let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Reducer actions
type Action =
  | {
      type: typeof actionTypes.ADD_TOAST
      toast: ToasterToast
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST
      toast: Partial<ToasterToast>
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST
      toastId?: ToasterToast["id"]
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST
      toastId?: ToasterToast["id"]
    }

// State shape for the toast system
interface State {
  toasts: ToasterToast[]
}

// The reducer function that manages the toast state
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      // Add new toast, limit to TOAST_LIMIT
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      // Update an existing toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST:
      const { toastId } = action
      // Mark a toast as "open: false" to trigger its exit animation
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        }
      } else {
        // Dismiss all toasts
        return {
          ...state,
          toasts: state.toasts.map((t) => ({ ...t, open: false })),
        }
      }

    case actionTypes.REMOVE_TOAST:
      // Remove a toast from memory after its animation
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

// Global state management outside of React components
const listeners: ((state: State) => void)[] = []
let memoryState: State = { toasts: [] }

// Dispatch function to update the global state
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

// Simplified Toast type for the public `toast` function
type Toast = Omit<ToasterToast, "id">

// Public function to show a toast
function toast({ ...props }: Toast) {
  const id = genId() // Generate a unique ID for the toast

  // Functions to update or dismiss this specific toast
  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  // Add the toast to the state
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true, // Mark as open
      onOpenChange: (open) => {
        // When Radix UI signals the toast is closing, dismiss it
        if (!open) dismiss()
      },
    },
  })

  // Return controls for the created toast
  return {
    id: id,
    dismiss,
    update,
  }
}

// The useToast hook to access toast state and the `toast` function
export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    // Subscribe to state changes
    listeners.push(setState)
    // Clean up subscription on unmount
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state]) // Depend on state to re-run effect when state changes (though often [] is sufficient here)

  return {
    ...state,
    toast, // Expose the toast function
  }
}
