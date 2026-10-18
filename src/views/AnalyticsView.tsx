import { useMemo, useState } from 'react'
import type { Transaction } from '../types'
import { BarChart, type BarDatum } from '../components/BarChart'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { SegmentedControl } from '../components/SegmentedControl'
import { buildDailySeries, methodBreakdown, summarize } from '../lib/analytics'
import { formatCurrency, formatShortDate } from '../lib/format'

interface AnalyticsViewProps {
  transactions: readonly Transaction[]
}

type Metric = 'revenue' | 'transactions'
type Range = '7d' | 'all'

const METRIC_OPTIONS: ReadonlyArray<{ value: Metric; label: string }> = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'transactions', label: 'Transactions' },
]

const RANGE_OPTIONS: ReadonlyArray<{ value: Range; label: string }> = [
  { value: '7d', label: '7 days' },
  { value: 'all', label: 'All' },
]

const percent = (fraction: number): string => `${Math.round(fraction * 100)}%`

export function AnalyticsView({ transactions }: AnalyticsViewProps) {
  const [metric, setMetric] = useState<Metric>('revenue')
  const [range, setRange] = useState<Range>('7d')

  const summary = useMemo(() => summarize(transactions), [transactions])
  const series = useMemo(() => buildDailySeries(transactions), [transactions])
  const methods = useMemo(() => methodBreakdown(transactions), [transactions])

  const periodTotal = useMemo(() => {
    const points = range === '7d' ? series.slice(-7) : series
    return points.reduce((sum, p) => sum + (metric === 'revenue' ? p.revenue : p.transactions), 0)
  }, [series, range, metric])

  const data = useMemo<BarDatum[]>(() => {
    const points = range === '7d' ? series.slice(-7) : series
    return points.map((point) => ({
      key: point.date,
      label: formatShortDate(point.date),
      value: metric === 'revenue' ? point.revenue : point.transactions,
      valueLabel:
        metric === 'revenue'
          ? formatCurrency(point.revenue)
          : point.transactions === 1
            ? '1 transaction'
            : `${point.transactions} transactions`,
    }))
  }, [series, range, metric])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Calculated from your transactions. Revenue only counts completed ones."
      />

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Revenue" value={formatCurrency(summary.revenue)} hint="Completed transactions" />
        <MetricCard label="Average ticket" value={formatCurrency(summary.averageTicket)} hint="Per completed transaction" />
        <MetricCard label="Success rate" value={percent(summary.successRate)} hint="Completed out of total" />
        <MetricCard label="Pending amount" value={formatCurrency(summary.pendingAmount)} hint="Pending transactions" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-label="Daily activity" className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Daily activity</h3>
              <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
                {metric === 'revenue' ? formatCurrency(periodTotal) : periodTotal}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SegmentedControl label="Metric" value={metric} options={METRIC_OPTIONS} onChange={setMetric} />
              <SegmentedControl label="Period" value={range} options={RANGE_OPTIONS} onChange={setRange} />
            </div>
          </div>

          <div className="mt-6">
            {data.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No activity to chart yet.
              </p>
            ) : (
              <BarChart
                data={data}
                ariaLabel={metric === 'revenue' ? 'Revenue per day' : 'Transactions per day'}
              />
            )}
          </div>
        </section>

        <section aria-label="Revenue by payment method" className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold tracking-tight">Payment method</h3>
          <ul className="mt-4 space-y-5">
            {methods.map((item) => (
              <li key={item.method}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{item.method}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatCurrency(item.revenue)}
                    <span className="ml-2 text-xs">{percent(item.share)}</span>
                  </span>
                </div>
                <div
                  role="img"
                  aria-label={`${item.method}: ${percent(item.share)} of revenue`}
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500"
                    style={{ width: `${item.share * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
