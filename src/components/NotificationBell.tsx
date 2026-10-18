import { useCallback, useId, useRef, useState } from 'react'
import { Ban, Bell, Check, Clock, Info, type LucideIcon } from 'lucide-react'
import type { AppNotification, NotificationKind, NotificationsBinding } from '../types'
import { useDismiss, type DismissReason } from '../hooks/useDismiss'
import { formatRelativeTime } from '../lib/format'
import { cn } from '../lib/utils'

type NotificationBellProps = NotificationsBinding

type Tab = 'all' | 'unread'

const KIND_CONFIG: Record<NotificationKind, { icon: LucideIcon; tone: string }> = {
  payment: { icon: Check, tone: 'bg-success/10 text-success' },
  pending: { icon: Clock, tone: 'bg-warning/10 text-warning' },
  cancelled: { icon: Ban, tone: 'bg-destructive/10 text-destructive' },
  system: { icon: Info, tone: 'bg-muted text-muted-foreground' },
}

const TABS: Array<{ value: Tab; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
]

export function NotificationBell({
  items,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpen,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('all')

  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const handleDismiss = useCallback((reason: DismissReason) => {
    setOpen(false)
    if (reason === 'escape') triggerRef.current?.focus()
  }, [])
  useDismiss(open, containerRef, handleDismiss)

  const handleItemClick = (item: AppNotification) => {
    onMarkAsRead(item.id)
    if (item.transactionId !== undefined) {
      setOpen(false)
      onOpen(item)
    }
  }

  const visible = tab === 'unread' ? items.filter((item) => !item.read) : items
  const now = Date.now()

  const triggerLabel =
    unreadCount > 0
      ? `Notifications, ${unreadCount} unread`
      : 'Notifications, all caught up'

  return (
    <div ref={containerRef} className="sm:relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={cn(
          'relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
          open && 'bg-accent text-foreground',
        )}
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background"
          />
        )}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Notifications"
          className="absolute inset-x-3 top-full mt-2 origin-top-right animate-pop-in overflow-hidden rounded-xl border border-border bg-card shadow-popover sm:inset-x-auto sm:right-0 sm:w-96"
        >
          <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Notifications</h2>
              <p className="text-xs text-muted-foreground" aria-live="polite">
                {unreadCount === 0
                  ? 'You are all caught up'
                  : unreadCount === 1
                    ? '1 unread'
                    : `${unreadCount} unread`}
              </p>
            </div>
            <button
              type="button"
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            >
              Mark all as read
            </button>
          </div>

          <div role="group" aria-label="Filter notifications" className="flex gap-1.5 px-4 pb-3">
            {TABS.map(({ value, label }) => {
              const active = tab === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="max-h-[min(24rem,calc(100dvh-12rem))] overflow-y-auto overscroll-contain border-t border-border">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Bell className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium">
                  {tab === 'unread' ? 'You have no unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tab === 'unread'
                    ? 'New alerts will appear here.'
                    : 'We will let you know about payments or important changes.'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {visible.map((item) => {
                  const { icon: Icon, tone } = KIND_CONFIG[item.kind]
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                      >
                        <span
                          className={cn(
                            'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                            tone,
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              'flex items-center justify-between gap-2 text-sm',
                              item.read ? 'font-normal text-muted-foreground' : 'font-medium',
                            )}
                          >
                            <span className="truncate">{item.title}</span>
                            <span className="shrink-0 text-xs font-normal text-muted-foreground tabular-nums">
                              {formatRelativeTime(item.createdAt, now)}
                            </span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                        {!item.read && (
                          <>
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            />
                            <span className="sr-only">Unread</span>
                          </>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
