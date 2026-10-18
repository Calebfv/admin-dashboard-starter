import type { PaymentMethod, Transaction } from '../types'
import { isIsoDate } from './filters'

export interface DailyPoint {
  date: string
  revenue: number
  transactions: number
}

export interface MethodShare {
  method: PaymentMethod
  count: number
  revenue: number
  share: number
}

export interface Summary {
  revenue: number
  averageTicket: number
  successRate: number
  pendingAmount: number
}

const METHODS: readonly PaymentMethod[] = ['Card', 'PayPal', 'Bank transfer']
const MAX_DAYS = 366

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function buildDailySeries(transactions: readonly Transaction[]): DailyPoint[] {
  const valid = transactions.filter((tx) => isIsoDate(tx.date))
  if (valid.length === 0) return []

  const byDate = new Map<string, DailyPoint>()
  let min = valid[0].date
  let max = valid[0].date

  for (const tx of valid) {
    if (tx.date < min) min = tx.date
    if (tx.date > max) max = tx.date
    const point = byDate.get(tx.date) ?? { date: tx.date, revenue: 0, transactions: 0 }
    point.transactions += 1
    if (tx.status === 'completed') point.revenue += tx.amount
    byDate.set(tx.date, point)
  }

  const earliest = addDays(max, -(MAX_DAYS - 1))
  const series: DailyPoint[] = []
  for (let cursor = min < earliest ? earliest : min; cursor <= max; cursor = addDays(cursor, 1)) {
    series.push(byDate.get(cursor) ?? { date: cursor, revenue: 0, transactions: 0 })
  }
  return series
}

export function methodBreakdown(transactions: readonly Transaction[]): MethodShare[] {
  const completed = transactions.filter((tx) => tx.status === 'completed')
  const total = completed.reduce((sum, tx) => sum + tx.amount, 0)

  return METHODS.map((method) => {
    const own = completed.filter((tx) => tx.method === method)
    const revenue = own.reduce((sum, tx) => sum + tx.amount, 0)
    return { method, count: own.length, revenue, share: total === 0 ? 0 : revenue / total }
  }).sort((a, b) => b.revenue - a.revenue)
}

export function summarize(transactions: readonly Transaction[]): Summary {
  let revenue = 0
  let completed = 0
  let pendingAmount = 0

  for (const tx of transactions) {
    if (tx.status === 'completed') {
      revenue += tx.amount
      completed += 1
    } else if (tx.status === 'pending') {
      pendingAmount += tx.amount
    }
  }

  return {
    revenue,
    averageTicket: completed === 0 ? 0 : revenue / completed,
    successRate: transactions.length === 0 ? 0 : completed / transactions.length,
    pendingAmount,
  }
}
