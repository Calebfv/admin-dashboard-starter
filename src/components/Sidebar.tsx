import { useEffect } from 'react'
import { Box, LifeBuoy, X } from 'lucide-react'
import type { NavItem, ViewId } from '../types'
import { cn } from '../lib/utils'

interface SidebarProps {
  items: NavItem[]
  activeId: ViewId
  onNavigate: (id: ViewId) => void
  open: boolean
  onClose: () => void
}

export function Sidebar({ items, activeId, onNavigate, open, onClose }: SidebarProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        aria-label="Main navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card',
          'transition-transform duration-200 ease-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Box className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Acme Inc.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            General
          </p>
          <ul className="space-y-1">
            {items.map(({ id, label, icon: Icon, badge }) => {
              const active = id === activeId
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(id)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    {badge && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                        {badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-border p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <LifeBuoy className="h-4 w-4" />
            Support
          </button>
        </div>
      </aside>
    </>
  )
}
