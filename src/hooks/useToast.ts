import { createContext, useContext } from 'react'
import type { ToastInput } from '../types'

export interface ToastApi {
  toast: (input: ToastInput) => void
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const api = useContext(ToastContext)
  if (api === null) throw new Error('useToast must be used inside <ToastProvider>.')
  return api
}
