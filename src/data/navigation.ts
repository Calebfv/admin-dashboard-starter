import { Activity, CreditCard, LayoutDashboard, Settings, Users } from 'lucide-react'
import type { NavItem } from '../types'

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: CreditCard, badge: '6' },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
]
