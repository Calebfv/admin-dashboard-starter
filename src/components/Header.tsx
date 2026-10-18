import { Menu } from 'lucide-react'
import type { NotificationsBinding, Theme, User, UserMenuAction } from '../types'
import { NotificationBell } from './NotificationBell'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

interface HeaderProps {
  title: string
  user: User
  theme: Theme
  notifications: NotificationsBinding
  onUserAction: (action: UserMenuAction) => void
  onToggleTheme: () => void
  onMenuClick: () => void
}

export function Header({
  title,
  user,
  theme,
  notifications,
  onUserAction,
  onToggleTheme,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <NotificationBell {...notifications} />

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <UserMenu user={user} onAction={onUserAction} />
      </div>
    </header>
  )
}
