import { useEffect, useRef } from 'react'
import { Box } from 'lucide-react'

interface SignedOutScreenProps {
  onSignIn: () => void
}

export function SignedOutScreen({ onSignIn }: SignedOutScreenProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    buttonRef.current?.focus()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Box className="h-5 w-5" />
      </span>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">You signed out</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This is a demo: there is no real authentication, so you can sign back in without credentials.
        </p>
      </div>
      <button
        ref={buttonRef}
        type="button"
        onClick={onSignIn}
        className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Sign back in
      </button>
    </main>
  )
}
