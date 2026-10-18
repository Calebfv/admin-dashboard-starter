import { TrendingDown, TrendingUp } from 'lucide-react'
import type { Stat } from '../types'
import { formatPercent } from '../lib/format'
import { cn } from '../lib/utils'

interface StatCardProps {
  stat: Stat
}

export function StatCard({ stat }: StatCardProps) {
  const { label, value, change, icon: Icon, hint } = stat
  const positive = change >= 0
  const TrendIcon = positive ? TrendingUp : TrendingDown

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium tabular-nums',
            positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {formatPercent(change)}
        </span>
        <span className="text-muted-foreground">{hint}</span>
      </div>
    </div>
  )
}
