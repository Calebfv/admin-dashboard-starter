import { useCallback, useMemo, useState } from 'react'
import { applyFilters, EMPTY_FILTERS, hasActiveFilters, STATUS_ORDER } from '../lib/filters'
import type { DateRangeField, Transaction, TransactionFilters, TransactionStatus } from '../types'

export function useTransactionFilters(data: readonly Transaction[]) {
  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS)

  const setQuery = useCallback((query: string) => {
    setFilters((current) => ({ ...current, query }))
  }, [])

  const setDate = useCallback((field: DateRangeField, value: string) => {
    setFilters((current) =>
      field === 'dateFrom' ? { ...current, dateFrom: value } : { ...current, dateTo: value },
    )
  }, [])

  const toggleStatus = useCallback((status: TransactionStatus) => {
    setFilters((current) => {
      const next = current.statuses.includes(status)
        ? current.statuses.filter((item) => item !== status)
        : [...current.statuses, status]
      return { ...current, statuses: next.length === STATUS_ORDER.length ? [] : next }
    })
  }, [])

  const clearStatuses = useCallback(() => {
    setFilters((current) => (current.statuses.length === 0 ? current : { ...current, statuses: [] }))
  }, [])

  const reset = useCallback(() => setFilters(EMPTY_FILTERS), [])

  const showFilters = useCallback((partial: Partial<TransactionFilters>) => {
    setFilters({ ...EMPTY_FILTERS, ...partial })
  }, [])

  const result = useMemo(() => applyFilters(data, filters), [data, filters])
  const active = hasActiveFilters(filters)

  return { filters, result, active, setQuery, setDate, toggleStatus, clearStatuses, reset, showFilters }
}

export type TransactionFiltersState = ReturnType<typeof useTransactionFilters>
