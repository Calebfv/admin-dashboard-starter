import type { AppNotification } from '../types'

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString()

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    transactionId: 'TX-1048',
    kind: 'payment',
    title: 'Payment received',
    description: 'Olivia Martín paid $1,999.00 by card (TX-1048).',
    createdAt: minutesAgo(4),
    read: false,
  },
  {
    id: 'n-2',
    transactionId: 'TX-1047',
    kind: 'pending',
    title: 'Payment pending review',
    description: 'Jackson Lee has not confirmed their PayPal payment yet (TX-1047).',
    createdAt: minutesAgo(52),
    read: false,
  },
  {
    id: 'n-3',
    transactionId: 'TX-1045',
    kind: 'cancelled',
    title: 'Transaction cancelled',
    description: 'William Kim cancelled their $99.00 transfer (TX-1045).',
    createdAt: minutesAgo(60 * 20),
    read: false,
  },
  {
    id: 'n-4',
    kind: 'system',
    title: 'Scheduled maintenance',
    description: 'The dashboard will be read-only on Sunday from 02:00 to 02:30.',
    createdAt: minutesAgo(60 * 24 * 3),
    read: true,
  },
  {
    id: 'n-5',
    transactionId: 'TX-1046',
    kind: 'payment',
    title: 'Payment received',
    description: 'Isabella Nguyen paid $299.00 by card (TX-1046).',
    createdAt: minutesAgo(60 * 24 * 12),
    read: true,
  },
]
