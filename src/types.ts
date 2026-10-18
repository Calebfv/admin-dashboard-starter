import type { LucideIcon } from 'lucide-react'

export type Theme = 'light' | 'dark'

export interface User {
  name: string
  email: string
  initials: string
}

export type ViewId = 'dashboard' | 'transactions' | 'customers' | 'analytics' | 'settings'

export interface NavItem {
  id: ViewId
  label: string
  icon: LucideIcon
  badge?: string
}

export interface Stat {
  id: string
  label: string
  value: string
  change: number
  icon: LucideIcon
  hint: string
}

export type TransactionStatus = 'completed' | 'pending' | 'cancelled'
export type PaymentMethod = 'Card' | 'PayPal' | 'Bank transfer'

export interface Transaction {
  id: string
  customer: string
  email: string
  amount: number
  status: TransactionStatus
  date: string
  method: PaymentMethod
}

export interface TransactionFilters {
  query: string
  statuses: TransactionStatus[]
  dateFrom: string
  dateTo: string
}

export type DateRangeField = 'dateFrom' | 'dateTo'

export type StatusCounts = Record<TransactionStatus, number>

export type SortKey = 'customer' | 'status' | 'date' | 'amount'
export type SortDirection = 'asc' | 'desc'

export interface SortState {
  key: SortKey
  direction: SortDirection
}

export type NotificationKind = 'payment' | 'pending' | 'cancelled' | 'system'

export interface AppNotification {
  id: string
  kind: NotificationKind
  title: string
  description: string
  createdAt: string
  read: boolean
  transactionId?: string
}

export interface NotificationsBinding {
  items: readonly AppNotification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onOpen: (notification: AppNotification) => void
}

export type UserMenuAction = 'profile' | 'billing' | 'settings' | 'logout'

export type ToastTone = 'default' | 'success' | 'destructive'

export interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
}

export interface Toast extends ToastInput {
  id: number
}

export type Density = 'comfortable' | 'compact'

export interface AppSettings {
  density: Density
  emailAlerts: boolean
  weeklySummary: boolean
}

export interface ProfileDraft {
  name: string
  email: string
}

export interface Customer {
  email: string
  name: string
  orders: number
  pendingOrders: number
  totalSpent: number
  lastOrderDate: string
}
