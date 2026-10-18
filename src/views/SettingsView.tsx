import { useId, useState, type FormEvent, type ReactNode } from 'react'
import type { AppSettings, Density, ProfileDraft, Theme, User } from '../types'
import { PageHeader } from '../components/PageHeader'
import { SegmentedControl } from '../components/SegmentedControl'
import { Switch } from '../components/Switch'
import { validateProfile } from '../lib/validation'
import { cn } from '../lib/utils'

interface SettingsViewProps {
  user: User
  theme: Theme
  settings: AppSettings
  onSaveProfile: (profile: ProfileDraft) => void
  onThemeChange: (theme: Theme) => void
  onSettingChange: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
}

const THEME_OPTIONS: ReadonlyArray<{ value: Theme; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const DENSITY_OPTIONS: ReadonlyArray<{ value: Density; label: string }> = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
]

interface SectionProps {
  title: string
  description: string
  children: ReactNode
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="grid gap-6 border-t border-border py-8 first:border-t-0 first:pt-0 lg:grid-cols-3">
      <div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="max-w-md lg:col-span-2">{children}</div>
    </section>
  )
}

interface TextFieldProps {
  label: string
  type: 'text' | 'email'
  value: string
  error: string | undefined
  autoComplete: string
  onChange: (value: string) => void
  onBlur: () => void
}

function TextField({ label, type, value, error, autoComplete, onChange, onBlur }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? errorId : undefined}
        className={cn(
          'h-10 w-full rounded-md border bg-card px-3 text-sm',
          error !== undefined ? 'border-destructive' : 'border-border',
        )}
      />
      {error !== undefined && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export function SettingsView({
  user,
  theme,
  settings,
  onSaveProfile,
  onThemeChange,
  onSettingChange,
}: SettingsViewProps) {
  const [draft, setDraft] = useState<ProfileDraft>({ name: user.name, email: user.email })
  const [touched, setTouched] = useState<Record<keyof ProfileDraft, boolean>>({
    name: false,
    email: false,
  })

  const errors = validateProfile(draft)
  const hasErrors = errors.name !== undefined || errors.email !== undefined
  const dirty = draft.name.trim() !== user.name || draft.email.trim() !== user.email

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ name: true, email: true })
    if (hasErrors || !dirty) return

    const next: ProfileDraft = { name: draft.name.trim(), email: draft.email.trim() }
    onSaveProfile(next)
    setDraft(next)
    setTouched({ name: false, email: false })
  }

  const handleCancel = () => {
    setDraft({ name: user.name, email: user.email })
    setTouched({ name: false, email: false })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Your profile, the dashboard appearance and the alerts you receive."
      />

      <div>
        <Section title="Profile" description="How you appear in the dashboard and in the emails we send.">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <TextField
              label="Name"
              type="text"
              value={draft.name}
              error={touched.name ? errors.name : undefined}
              autoComplete="name"
              onChange={(name) => setDraft((current) => ({ ...current, name }))}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
            />
            <TextField
              label="Email"
              type="email"
              value={draft.email}
              error={touched.email ? errors.email : undefined}
              autoComplete="email"
              onChange={(email) => setDraft((current) => ({ ...current, email }))}
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={!dirty}
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={!dirty}
                className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
              >
                Discard
              </button>
            </div>
          </form>
        </Section>

        <Section title="Appearance" description="Theme and density apply instantly.">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">Theme</p>
              <SegmentedControl label="Theme" value={theme} options={THEME_OPTIONS} onChange={onThemeChange} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Table density</p>
                <p className="text-sm text-muted-foreground">Compact shows more rows per screen.</p>
              </div>
              <SegmentedControl
                label="Table density"
                value={settings.density}
                options={DENSITY_OPTIONS}
                onChange={(density) => onSettingChange('density', density)}
              />
            </div>
          </div>
        </Section>

        <Section title="Notifications" description="Choose which alerts reach your email.">
          <div className="divide-y divide-border">
            <Switch
              checked={settings.emailAlerts}
              onChange={(checked) => onSettingChange('emailAlerts', checked)}
              label="Payment alerts"
              description="An email when you receive, cancel or have a pending payment."
            />
            <Switch
              checked={settings.weeklySummary}
              onChange={(checked) => onSettingChange('weeklySummary', checked)}
              label="Weekly summary"
              description="Every Monday, last week's results."
            />
          </div>
        </Section>
      </div>
    </div>
  )
}
