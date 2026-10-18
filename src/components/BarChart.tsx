import { useState } from 'react'
import { cn } from '../lib/utils'

export interface BarDatum {
  key: string
  label: string
  value: number
  valueLabel: string
}

interface BarChartProps {
  data: readonly BarDatum[]
  ariaLabel: string
}

export function BarChart({ data, ariaLabel }: BarChartProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const max = Math.max(0, ...data.map((datum) => datum.value))
  const active = data.find((datum) => datum.key === activeKey)
  const first = data[0]
  const last = data[data.length - 1]

  return (
    <div>
      <p className="h-5 text-sm tabular-nums" aria-live="polite">
        {active ? (
          <>
            <span className="text-muted-foreground">{active.label}</span>
            <span className="ml-2 font-medium">{active.valueLabel}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select a bar to see details</span>
        )}
      </p>

      <div
        role="group"
        aria-label={ariaLabel}
        onMouseLeave={() => setActiveKey(null)}
        className="mt-4 flex h-48 items-end gap-1 sm:gap-2"
      >
        {data.map((datum) => {
          const isActive = datum.key === activeKey
          const percent = max === 0 ? 0 : (datum.value / max) * 100
          return (
            <button
              key={datum.key}
              type="button"
              aria-label={`${datum.label}: ${datum.valueLabel}`}
              onMouseEnter={() => setActiveKey(datum.key)}
              onFocus={() => setActiveKey(datum.key)}
              onBlur={() => setActiveKey(null)}
              onClick={() => setActiveKey(datum.key)}
              className="flex h-full min-w-0 flex-1 items-end rounded-sm"
            >
              <span
                className={cn(
                  'w-full rounded-sm transition-[height,background-color] duration-500',
                  isActive ? 'bg-primary' : 'bg-foreground/15 hover:bg-foreground/30',
                )}
                style={{ height: `${Math.max(percent, datum.value > 0 ? 3 : 1)}%` }}
              />
            </button>
          )
        })}
      </div>

      {first && last && (
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{first.label}</span>
          <span>{last.label}</span>
        </div>
      )}
    </div>
  )
}
