import { useEffect, type RefObject } from 'react'

export type DismissReason = 'outside' | 'escape'

export function useDismiss(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onDismiss: (reason: DismissReason) => void,
): void {
  useEffect(() => {
    if (!active) return

    const onPointerDown = (event: PointerEvent) => {
      const container = containerRef.current
      if (container && event.target instanceof Node && !container.contains(event.target)) {
        onDismiss('outside')
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss('escape')
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [active, containerRef, onDismiss])
}
