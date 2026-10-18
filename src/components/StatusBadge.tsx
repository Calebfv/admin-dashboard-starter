import type { TransactionStatus } from '../types'
import { cn } from '../lib/utils'

export const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; badge: string; dot: string }
> = {
  completed: {
    label: 'Completed',
    badge: 'bg-success/10 text-success ring-success/20',
    dot: 'bg-success',
  },
  pending: {
    label: 'Pending',
    badge: 'bg-warning/10 text-warning ring-warning/20',
    dot: 'bg-warning',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-destructive/10 text-destructive ring-destructive/20',
    dot: 'bg-destructive',
  },
}

interface StatusBadgeProps {
  status: TransactionStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, badge, dot } = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        badge,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}
