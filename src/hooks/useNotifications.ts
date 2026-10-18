import { useCallback, useMemo, useState } from 'react'
import type { AppNotification } from '../types'

export function useNotifications(initial: readonly AppNotification[]) {
  const [items, setItems] = useState<AppNotification[]>(() => [...initial])

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items])

  const markAsRead = useCallback((id: string) => {
    setItems((current) =>
      current.some((item) => item.id === id && !item.read)
        ? current.map((item) => (item.id === id ? { ...item, read: true } : item))
        : current,
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setItems((current) =>
      current.some((item) => !item.read)
        ? current.map((item) => (item.read ? item : { ...item, read: true }))
        : current,
    )
  }, [])

  return { items, unreadCount, markAsRead, markAllAsRead }
}
