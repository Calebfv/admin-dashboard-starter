import { useMemo, useState } from 'react'
import { ChevronRight, Search, SearchX, X } from 'lucide-react'
import type { Transaction } from '../types'
import { PageHeader } from '../components/PageHeader'
import { SegmentedControl } from '../components/SegmentedControl'
import {
  buildCustomers,
  filterCustomers,
  sortCustomers,
  type CustomerSort,
} from '../lib/customers'
import { formatCurrency, formatDate, getInitials } from '../lib/format'

interface CustomersViewProps {
  transactions: readonly Transaction[]
  onViewTransactions: (email: string) => void
}

const SORT_OPTIONS: ReadonlyArray<{ value: CustomerSort; label: string }> = [
  { value: 'spent', label: 'Highest spend' },
  { value: 'recent', label: 'Recent' },
  { value: 'name', label: 'Name' },
]

export function CustomersView({ transactions, onViewTransactions }: CustomersViewProps) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<CustomerSort>('spent')

  const customers = useMemo(() => buildCustomers(transactions), [transactions])
  const visible = useMemo(
    () => sortCustomers(filterCustomers(customers, query), sort),
    [customers, query, sort],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Who buys from you, how much they have spent and when their last order was."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name or email"
            aria-label="Search customers by name or email"
            autoComplete="off"
            spellCheck={false}
            className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-9 text-sm placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          />
          {query !== '' && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <SegmentedControl label="Sort customers" value={sort} options={SORT_OPTIONS} onChange={setSort} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium">
              {customers.length === 0 ? 'No customers yet' : 'No results'}
            </p>
            <p className="text-sm text-muted-foreground">
              {customers.length === 0
                ? 'Your customers will appear here after their first purchase.'
                : 'No customers match your search.'}
            </p>
            {customers.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-2 inline-flex h-8 items-center rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((customer) => (
              <li key={customer.email} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {getInitials(customer.name)}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{customer.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                </div>

                <div className="hidden text-right md:block">
                  <p className="text-xs text-muted-foreground">Last order</p>
                  <p className="text-sm tabular-nums">{formatDate(customer.lastOrderDate)}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums">{formatCurrency(customer.totalSpent)}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {customer.orders === 1 ? '1 order' : `${customer.orders} orders`}
                    {customer.pendingOrders > 0 && `, ${customer.pendingOrders} pending`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onViewTransactions(customer.email)}
                  aria-label={`View transactions for ${customer.name}`}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-border px-4 py-3">
          <p role="status" className="text-sm text-muted-foreground tabular-nums">
            {visible.length === customers.length
              ? `${customers.length} customers`
              : `${visible.length} of ${customers.length} customers`}
          </p>
        </div>
      </div>
    </div>
  )
}
