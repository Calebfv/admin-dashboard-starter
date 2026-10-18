import { useMemo } from 'react'
import type { Stat, Transaction, TransactionFilters, TransactionStatus } from '../types'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { STATUS_CONFIG, StatusBadge } from '../components/StatusBadge'
import { STATUS_ORDER } from '../lib/filters'
import { formatCurrency, formatDate, getInitials } from '../lib/format'
import { cn } from '../lib/utils'

interface DashboardViewProps {
  stats: readonly Stat[]
  transactions: readonly Transaction[]
  onViewTransactions: (filters: Partial<TransactionFilters>) => void
}

const RECENT_LIMIT = 5

export function DashboardView({ stats, transactions, onViewTransactions }: DashboardViewProps) {
  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
        .slice(0, RECENT_LIMIT),
    [transactions],
  )

  const counts = useMemo(() => {
    const result: Record<TransactionStatus, number> = { completed: 0, pending: 0, cancelled: 0 }
    for (const tx of transactions) result[tx.status] += 1
    return result
  }, [transactions])

  const total = transactions.length

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="How your business has done over the last 30 days." />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section
          aria-label="Recent activity"
          className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2"
        >
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold tracking-tight">Recent activity</h3>
            <button
              type="button"
              onClick={() => onViewTransactions({})}
              className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              View all transactions
            </button>
          </div>

          {recent.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-muted-foreground">
              Payments will appear here when you receive them.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((tx) => (
                <li key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {getInitials(tx.customer)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{tx.customer}</p>
                    <p className="truncate text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                  </div>
                  <span className="hidden sm:block">
                    <StatusBadge status={tx.status} />
                  </span>
                  <span className="text-sm font-medium tabular-nums">{formatCurrency(tx.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Transaction status" className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold tracking-tight">Transaction status</h3>

          <div
            role="img"
            aria-label={STATUS_ORDER.map((s) => `${STATUS_CONFIG[s].label}: ${counts[s]}`).join(', ')}
            className="mt-4 flex h-2 gap-0.5 overflow-hidden rounded-full bg-muted"
          >
            {STATUS_ORDER.map((status) => (
              <span
                key={status}
                className={cn('h-full transition-[width] duration-500', STATUS_CONFIG[status].dot)}
                style={{ width: `${total === 0 ? 0 : (counts[status] / total) * 100}%` }}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-1">
            {STATUS_ORDER.map((status) => (
              <li key={status}>
                <button
                  type="button"
                  onClick={() => onViewTransactions({ statuses: [status] })}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', STATUS_CONFIG[status].dot)} />
                  <span className="flex-1 text-left">{STATUS_CONFIG[status].label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {counts[status]}
                    <span className="ml-1.5 text-xs">
                      {total === 0 ? '0%' : `${Math.round((counts[status] / total) * 100)}%`}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
