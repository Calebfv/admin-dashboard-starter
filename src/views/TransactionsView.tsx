import { DataTable } from '../components/DataTable'
import { FilterBar } from '../components/FilterBar'
import { PageHeader } from '../components/PageHeader'
import type { TransactionFiltersState } from '../hooks/useTransactionFilters'
import type { Density } from '../types'

interface TransactionsViewProps {
  state: TransactionFiltersState
  density: Density
}

export function TransactionsView({ state, density }: TransactionsViewProps) {
  const { filters, result, active, setQuery, setDate, toggleStatus, clearStatuses, reset } = state

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Search by text, filter by date and status, and sort your account activity."
      />

      <FilterBar
        filters={filters}
        counts={result.counts}
        total={result.total}
        dateRangeError={result.dateRangeError}
        hasActiveFilters={active}
        onQueryChange={setQuery}
        onDateChange={setDate}
        onToggleStatus={toggleStatus}
        onClearStatuses={clearStatuses}
        onReset={reset}
      />

      <DataTable rows={result.rows} density={density} hasActiveFilters={active} onResetFilters={reset} />
    </div>
  )
}
