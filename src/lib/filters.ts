import type { StatusCounts, Transaction, TransactionFilters, TransactionStatus } from '../types'

export const EMPTY_FILTERS: TransactionFilters = {
  query: '',
  statuses: [],
  dateFrom: '',
  dateTo: '',
}

export const STATUS_ORDER: readonly TransactionStatus[] = ['completed', 'pending', 'cancelled']

export type DateRangeError = 'inverted' | null

export interface FilterResult {
  rows: Transaction[]
  counts: StatusCounts
  total: number
  dateRangeError: DateRangeError
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function isIsoDate(value: string): boolean {
  return ISO_DATE.test(value)
}

export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}

export function tokenize(query: string): string[] {
  const normalized = normalizeText(query)
  return normalized === '' ? [] : normalized.split(/\s+/)
}

const haystackCache = new WeakMap<Transaction, string>()

function haystackOf(tx: Transaction): string {
  const cached = haystackCache.get(tx)
  if (cached !== undefined) return cached
  const built = normalizeText(`${tx.id} ${tx.customer} ${tx.email} ${tx.method} ${tx.date}`)
  haystackCache.set(tx, built)
  return built
}

export function matchesQuery(tx: Transaction, tokens: readonly string[]): boolean {
  if (tokens.length === 0) return true
  const haystack = haystackOf(tx)
  return tokens.every((token) => haystack.includes(token))
}

export function matchesDateRange(tx: Transaction, from: string, to: string): boolean {
  if (isIsoDate(from) && tx.date < from) return false
  if (isIsoDate(to) && tx.date > to) return false
  return true
}

export function getDateRangeError(from: string, to: string): DateRangeError {
  return isIsoDate(from) && isIsoDate(to) && from > to ? 'inverted' : null
}

export function hasActiveFilters(filters: TransactionFilters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.statuses.length > 0 ||
    filters.dateFrom !== '' ||
    filters.dateTo !== ''
  )
}

export function applyFilters(
  data: readonly Transaction[],
  filters: TransactionFilters,
): FilterResult {
  const dateRangeError = getDateRangeError(filters.dateFrom, filters.dateTo)
  const tokens = tokenize(filters.query)

  const base = data.filter(
    (tx) =>
      matchesQuery(tx, tokens) &&
      (dateRangeError !== null || matchesDateRange(tx, filters.dateFrom, filters.dateTo)),
  )

  const counts: StatusCounts = { completed: 0, pending: 0, cancelled: 0 }
  for (const tx of base) counts[tx.status] += 1

  const rows =
    filters.statuses.length === 0
      ? base
      : base.filter((tx) => filters.statuses.includes(tx.status))

  return { rows, counts, total: base.length, dateRangeError }
}
