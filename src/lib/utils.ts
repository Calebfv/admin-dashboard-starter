type ClassValue = string | false | null | undefined

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`)
}
