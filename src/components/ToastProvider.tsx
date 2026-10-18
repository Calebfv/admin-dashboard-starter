import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Ban, Check, Info, X, type LucideIcon } from 'lucide-react'
import { ToastContext, type ToastApi } from '../hooks/useToast'
import type { Toast, ToastInput, ToastTone } from '../types'
import { cn } from '../lib/utils'

const MAX_TOASTS = 3
const DURATION_MS = 4_000

const TONE_CONFIG: Record<ToastTone, { icon: LucideIcon; tone: string }> = {
  default: { icon: Info, tone: 'bg-muted text-muted-foreground' },
  success: { icon: Check, tone: 'bg-success/10 text-success' },
  destructive: { icon: Ban, tone: 'bg-destructive/10 text-destructive' },
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id)
    if (timer !== undefined) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++
      setToasts((current) => [...current, { ...input, id }].slice(-MAX_TOASTS))
      timers.current.set(id, window.setTimeout(() => dismiss(id), DURATION_MS))
    },
    [dismiss],
  )

  useEffect(() => {
    const active = timers.current
    return () => {
      active.forEach((timer) => window.clearTimeout(timer))
      active.clear()
    }
  }, [])

  const api = useMemo<ToastApi>(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        role="region"
        aria-label="Alerts"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4 sm:w-96"
      >
        {toasts.map((item) => {
          const { icon: Icon, tone } = TONE_CONFIG[item.tone ?? 'default']
          return (
            <div
              key={item.id}
              role={item.tone === 'destructive' ? 'alert' : 'status'}
              className="pointer-events-auto flex w-full animate-toast-in items-start gap-3 rounded-xl border border-border bg-card p-3 shadow-popover"
            >
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', tone)}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss alert"
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
