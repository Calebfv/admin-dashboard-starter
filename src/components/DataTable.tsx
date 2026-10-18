import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import type { Density, SortKey, SortState, Transaction } from '../types'
import { formatCurrency, formatDate, getInitials } from '../lib/format'
import { cn } from '../lib/utils'
import { StatusBadge } from './StatusBadge'

interface DataTableProps {
  rows: Transaction[]
  pageSize?: number
  density?: Density
  hasActiveFilters?: boolean
  onResetFilters?: () => void
}

interface Column {
  label: string
  sortKey?: SortKey
  className?: string
  align?: 'right'
}

const COLUMNS: Column[] = [
  { label: 'Customer', sortKey: 'customer' },
  { label: 'Status', sortKey: 'status' },
  { label: 'Method', className: 'hidden md:table-cell' },
  { label: 'Date', sortKey: 'date', className: 'hidden sm:table-cell' },
  { label: 'Amount', sortKey: 'amount', align: 'right' },
]

function compare(a: Transaction, b: Transaction, key: SortKey): number {
  switch (key) {
    case 'customer':
      return a.customer.localeCompare(b.customer, 'en')
    case 'status':
      return a.status.localeCompare(b.status)
    case 'date':
      return a.date.localeCompare(b.date)
    case 'amount':
      return a.amount - b.amount
  }
}

export function DataTable({
  rows,
  pageSize = 8,
  density = 'comfortable',
  hasActiveFilters = false,
  onResetFilters,
}: DataTableProps) {
  const [sort, setSort] = useState<SortState>({ key: 'date', direction: 'desc' })
  const [page, setPage] = useState(1)
  const cellY = density === 'compact' ? 'py-1.5' : 'py-3'

  useEffect(() => {
    setPage(1)
  }, [rows])

  const sorted = useMemo(() => {
    const factor = sort.direction === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => compare(a, b, sort.key) * factor)
  }, [rows, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const visible = sorted.slice(start, start + pageSize)

  const toggleSort = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {COLUMNS.map((column) => {
                const { sortKey } = column
                const active = sortKey === sort.key
                const SortIcon = !active ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown
                const ariaSort = !sortKey
                  ? undefined
                  : active
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'

                return (
                  <th
                    key={column.label}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      'px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground',
                      column.align === 'right' ? 'text-right' : 'text-left',
                      column.className,
                    )}
                  >
                    {sortKey ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(sortKey)}
                        className={cn(
                          'inline-flex items-center gap-1 uppercase transition-colors hover:text-foreground',
                          active && 'text-foreground',
                        )}
                      >
                        {column.label}
                        <SortIcon className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {visible.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-muted/40">
                <td className={cn('px-4', cellY)}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {getInitials(row.customer)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{row.customer}</p>
                      <p className="truncate text-xs text-muted-foreground">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className={cn('px-4', cellY)}>
                  <StatusBadge status={row.status} />
                </td>
                <td className={cn('hidden px-4 text-muted-foreground md:table-cell', cellY)}>{row.method}</td>
                <td className={cn('hidden whitespace-nowrap px-4 text-muted-foreground sm:table-cell', cellY)}>
                  {formatDate(row.date)}
                </td>
                <td className={cn('px-4 text-right font-medium tabular-nums', cellY)}>
                  {formatCurrency(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium">
              {hasActiveFilters ? 'No results' : 'No transactions yet'}
            </p>
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? 'No transactions match the current filters.'
                : 'Payments will appear here when you receive them.'}
            </p>
            {hasActiveFilters && onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-2 inline-flex h-8 items-center rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
        <p role="status" className="text-sm text-muted-foreground tabular-nums">
          {sorted.length === 0
            ? '0 results'
            : `Showing ${start + 1}–${start + visible.length} of ${sorted.length}`}
        </p>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground tabular-nums sm:inline">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
