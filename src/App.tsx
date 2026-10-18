import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Header } from './components/Header'
import { SignedOutScreen } from './components/SignedOutScreen'
import { Sidebar } from './components/Sidebar'
import { CURRENT_USER, STATS, TRANSACTIONS } from './data/mock'
import { NAV_ITEMS } from './data/navigation'
import { NOTIFICATIONS } from './data/notifications'
import { useNotifications } from './hooks/useNotifications'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'
import { useTransactionFilters } from './hooks/useTransactionFilters'
import { getInitials } from './lib/format'
import { assertNever } from './lib/utils'
import type {
  AppNotification,
  AppSettings,
  NotificationsBinding,
  ProfileDraft,
  TransactionFilters,
  User,
  UserMenuAction,
  ViewId,
} from './types'
import { AnalyticsView } from './views/AnalyticsView'
import { CustomersView } from './views/CustomersView'
import { DashboardView } from './views/DashboardView'
import { SettingsView } from './views/SettingsView'
import { TransactionsView } from './views/TransactionsView'

const DEFAULT_SETTINGS: AppSettings = {
  density: 'comfortable',
  emailAlerts: true,
  weeklySummary: false,
}

export default function App() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const { toast } = useToast()

  const [signedIn, setSignedIn] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<ViewId>('dashboard')
  const [user, setUser] = useState<User>(CURRENT_USER)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  const txFilters = useTransactionFilters(TRANSACTIONS)
  const { showFilters } = txFilters
  const { items, unreadCount, markAsRead, markAllAsRead } = useNotifications(NOTIFICATIONS)

  const mainRef = useRef<HTMLElement>(null)
  const previousView = useRef<ViewId>(activeView)

  useEffect(() => {
    if (previousView.current === activeView) return
    previousView.current = activeView
    window.scrollTo({ top: 0 })
    mainRef.current?.focus({ preventScroll: true })
  }, [activeView])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const navigate = useCallback((view: ViewId) => {
    setActiveView(view)
    setSidebarOpen(false)
  }, [])

  const openTransactions = useCallback(
    (filters: Partial<TransactionFilters>) => {
      showFilters(filters)
      navigate('transactions')
    },
    [showFilters, navigate],
  )

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead()
    toast({ title: 'All caught up', description: 'You marked everything as read.', tone: 'success' })
  }, [markAllAsRead, toast])

  const handleOpenNotification = useCallback(
    (notification: AppNotification) => {
      if (notification.transactionId !== undefined) {
        openTransactions({ query: notification.transactionId })
      }
    },
    [openTransactions],
  )

  const notifications: NotificationsBinding = {
    items,
    unreadCount,
    onMarkAsRead: markAsRead,
    onMarkAllAsRead: handleMarkAllAsRead,
    onOpen: handleOpenNotification,
  }

  const handleUserAction = useCallback(
    (action: UserMenuAction) => {
      switch (action) {
        case 'profile':
          navigate('settings')
          toast({ title: 'Your profile', description: 'Edit your name and email in Settings.' })
          return
        case 'billing':
          openTransactions({})
          toast({ title: 'Billing', description: 'Here are all your transactions.' })
          return
        case 'settings':
          navigate('settings')
          return
        case 'logout':
          setSignedIn(false)
          setSidebarOpen(false)
          toast({ title: 'Signed out', description: 'See you soon.', tone: 'success' })
          return
        default:
          return assertNever(action)
      }
    },
    [navigate, openTransactions, toast],
  )

  const handleSaveProfile = useCallback(
    (profile: ProfileDraft) => {
      setUser((current) => ({
        ...current,
        name: profile.name,
        email: profile.email,
        initials: getInitials(profile.name),
      }))
      toast({ title: 'Profile updated', description: 'Your changes now show in the menu.', tone: 'success' })
    },
    [toast],
  )

  const handleSettingChange = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((current) => ({ ...current, [key]: value }))
      toast({ title: 'Preference saved' })
    },
    [toast],
  )

  if (!signedIn) {
    return (
      <SignedOutScreen
        onSignIn={() => {
          setSignedIn(true)
          toast({ title: `Welcome back, ${user.name.split(' ')[0]}`, tone: 'success' })
        }}
      />
    )
  }

  const renderView = (view: ViewId): ReactNode => {
    switch (view) {
      case 'dashboard':
        return (
          <DashboardView stats={STATS} transactions={TRANSACTIONS} onViewTransactions={openTransactions} />
        )
      case 'transactions':
        return <TransactionsView state={txFilters} density={settings.density} />
      case 'customers':
        return (
          <CustomersView
            transactions={TRANSACTIONS}
            onViewTransactions={(email) => openTransactions({ query: email })}
          />
        )
      case 'analytics':
        return <AnalyticsView transactions={TRANSACTIONS} />
      case 'settings':
        return (
          <SettingsView
            user={user}
            theme={theme}
            settings={settings}
            onSaveProfile={handleSaveProfile}
            onThemeChange={setTheme}
            onSettingChange={handleSettingChange}
          />
        )
      default:
        return assertNever(view)
    }
  }

  const pageTitle = NAV_ITEMS.find((item) => item.id === activeView)?.label ?? 'Dashboard'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        items={NAV_ITEMS}
        activeId={activeView}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="lg:pl-64">
        <Header
          title={pageTitle}
          user={user}
          theme={theme}
          notifications={notifications}
          onUserAction={handleUserAction}
          onToggleTheme={toggleTheme}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main
          ref={mainRef}
          tabIndex={-1}
          className="mx-auto max-w-7xl px-4 py-6 focus-visible:ring-0 focus-visible:ring-offset-0 sm:px-6 lg:px-8 lg:py-8"
        >
          <div key={activeView} className="animate-view-in">
            {renderView(activeView)}
          </div>
        </main>
      </div>
    </div>
  )
}
