const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'short' })

const shortDateFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' })

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`))
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const target = new Date(iso).getTime()
  if (Number.isNaN(target)) return ''

  const diffSeconds = Math.round((target - now) / 1000)
  const abs = Math.abs(diffSeconds)

  if (abs < 60) return 'now'
  if (abs < 3_600) return relativeFormatter.format(Math.round(diffSeconds / 60), 'minute')
  if (abs < 86_400) return relativeFormatter.format(Math.round(diffSeconds / 3_600), 'hour')
  if (abs < 604_800) return relativeFormatter.format(Math.round(diffSeconds / 86_400), 'day')
  return formatDate(iso.slice(0, 10))
}

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(`${iso}T00:00:00`))
}

export function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? '')
    .join('')
    .toUpperCase()
  return initials === '' ? '?' : initials
}
