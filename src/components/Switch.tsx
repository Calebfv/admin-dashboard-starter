import { useId } from 'react'
import { cn } from '../lib/utils'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description: string
}

export function Switch({ checked, onChange, label, description }: SwitchProps) {
  const id = useId()

  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p id={`${id}-label`} className="text-sm font-medium">
          {label}
        </p>
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-description`}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors',
          checked ? 'border-primary bg-primary' : 'border-border bg-muted',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-block h-3.5 w-3.5 rounded-full transition-transform',
            checked ? 'translate-x-[1.125rem] bg-primary-foreground' : 'translate-x-0.5 bg-muted-foreground',
          )}
        />
      </button>
    </div>
  )
}
