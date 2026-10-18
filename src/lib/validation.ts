import type { ProfileDraft } from '../types'

export type ProfileErrors = Partial<Record<keyof ProfileDraft, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateProfile(draft: ProfileDraft): ProfileErrors {
  const errors: ProfileErrors = {}
  const name = draft.name.trim()
  const email = draft.email.trim()

  if (name.length < 2) errors.name = 'Enter at least 2 characters.'
  else if (name.length > 60) errors.name = 'Use at most 60 characters.'

  if (email === '') errors.email = 'Enter your email.'
  else if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email, for example name@company.com.'
  }

  return errors
}
