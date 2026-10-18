import { useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Search, X } from 'lucide-react'
import type {
  DateRangeField,
  StatusCounts,
  TransactionFilters,
  TransactionStatus,
} from '../types'
import { STATUS_ORDER, type DateRangeError } from '../lib/filters'
import { cn } from '../lib/utils'
import { STATUS_CONFIG } from './StatusBadge'

interface FilterBarProps {
  filters: TransactionFilters
  counts: StatusCounts
  total: number
  dateRangeError: DateRangeError
  hasActiveFilters: boolean
  onQueryChange: (value: string) => void
  onDateChange: (field: DateRangeField, value: string) => void
  onToggleStatus: (status: TransactionStatus) => void
  onClearStatuses: () => void
  onReset: () => void
}

const DATE_FIELD_CLASS =
  'flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background data-[invalid=true]:border-destructive'

const DATE_INPUT_CLASS =
  'min-w-0 flex-1 bg-transparent text-sm tabular-nums focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

export function FilterBar({
  filters,
  counts,
  total,
  dateRangeError,
  hasActiveFilters,
  onQueryChange,
  onDateChange,
  onToggleStatus,
  onClearStatuses,
  onReset,
}: FilterBarProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const errorId = useId()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return
      event.preventDefault()
      searchRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && filters.query !== '') {
      event.preventDefault()
      onQueryChange('')
    }
  }

  const rangeInvalid = dateRangeError !== null

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            type="search"
            value={filters.query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Customer, email, ID or method"
            aria-label="Search transactions by customer, email, ID or method"
            autoComplete="off"
            spellCheck={false}
            className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-9 text-sm placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.query !== '' ? (
            <button
              type="button"
              onClick={() => {
                onQueryChange('')
                searchRef.current?.focus()
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-1/2 hidden h-5 -translate-y-1/2 items-center rounded border border-border px-1.5 font-sans text-[11px] text-muted-foreground lg:inline-flex"
            >
              /
            </kbd>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <label className={DATE_FIELD_CLASS} data-invalid={rangeInvalid}>
            <span className="text-muted-foreground">From</span>
            <input
              type="date"
              value={filters.dateFrom}
              max={filters.dateTo || undefined}
              onChange={(event) => onDateChange('dateFrom', event.target.value)}
              aria-invalid={rangeInvalid}
              aria-describedby={rangeInvalid ? errorId : undefined}
              className={DATE_INPUT_CLASS}
            />
          </label>
          <label className={DATE_FIELD_CLASS} data-invalid={rangeInvalid}>
            <span className="text-muted-foreground">To</span>
            <input
              type="date"
              value={filters.dateTo}
              min={filters.dateFrom || undefined}
              onChange={(event) => onDateChange('dateTo', event.target.value)}
              aria-invalid={rangeInvalid}
              aria-describedby={rangeInvalid ? errorId : undefined}
              className={DATE_INPUT_CLASS}
            />
          </label>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex w-fit items-center gap-1 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:ml-auto"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {rangeInvalid && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          The start date is after the end date. Date filtering is off until this is fixed.
        </p>
      )}

      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
        <StatusChip
          label="All"
          count={total}
          active={filters.statuses.length === 0}
          onClick={onClearStatuses}
        />
        {STATUS_ORDER.map((status) => (
          <StatusChip
            key={status}
            label={STATUS_CONFIG[status].label}
            dotClass={STATUS_CONFIG[status].dot}
            count={counts[status]}
            active={filters.statuses.includes(status)}
            onClick={() => onToggleStatus(status)}
          />
        ))}
      </div>
    </div>
  )
}

interface StatusChipProps {
  label: string
  count: number
  active: boolean
  dotClass?: string
  onClick: () => void
}

function StatusChip({ label, count, active, dotClass, onClick }: StatusChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
      )}
    >
      {dotClass && <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />}
      {label}
      <span
        className={cn(
          'text-xs tabular-nums',
          active ? 'text-primary-foreground/70' : 'text-muted-foreground',
        )}
      >
        {count}
      </span>
    </button>
  )
}
