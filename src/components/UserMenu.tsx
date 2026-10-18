import { useCallback, useRef, useState } from 'react'
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Settings,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react'
import type { User, UserMenuAction } from '../types'
import { useDismiss, type DismissReason } from '../hooks/useDismiss'
import { cn } from '../lib/utils'

interface UserMenuProps {
  user: User
  onAction: (action: UserMenuAction) => void
}

const MENU_ITEMS: ReadonlyArray<{
  action: Exclude<UserMenuAction, 'logout'>
  label: string
  icon: LucideIcon
}> = [
  { action: 'profile', label: 'Profile', icon: UserIcon },
  { action: 'billing', label: 'Billing', icon: CreditCard },
  { action: 'settings', label: 'Settings', icon: Settings },
]

export function UserMenu({ user, onAction }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleDismiss = useCallback((reason: DismissReason) => {
    setOpen(false)
    if (reason === 'escape') triggerRef.current?.focus()
  }, [])
  useDismiss(open, containerRef, handleDismiss)

  const choose = (action: UserMenuAction) => {
    setOpen(false)
    onAction(action)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-accent md:rounded-md md:pr-3"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {user.initials}
        </span>
        <span className="hidden text-sm font-medium md:block">{user.name}</span>
        <ChevronDown
          className={cn(
            'hidden h-4 w-4 text-muted-foreground transition-transform md:block',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 origin-top-right animate-pop-in overflow-hidden rounded-xl border border-border bg-card shadow-popover"
        >
          <div className="border-b border-border px-3 py-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="p-1">
            {MENU_ITEMS.map(({ action, label, icon: Icon }) => (
              <button
                key={action}
                type="button"
                role="menuitem"
                onClick={() => choose(action)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </button>
            ))}
          </div>

          <div className="border-t border-border p-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => choose('logout')}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
