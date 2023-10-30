import {
  DependencyList,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { NonCaptureOriginalEvents } from './libs/events'
import { isRestoredEvent, restoreEvent } from './libs/restoreEvent'

export function useDecoratedEvent(
  ref: MutableRefObject<HTMLElement | null>,
  events: (keyof NonCaptureOriginalEvents)[],
  deps?: DependencyList,
): {
  confirm(): void
  cancel(): void
  isPending: boolean
} {
  const lastEvent = useRef<Event>()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (!ref.current) {
      // eslint-disable-next-line no-console
      console.error('ref.current is empty')

      return undefined
    }

    const element = ref.current

    const abortController = new AbortController()

    events.forEach((eventName) =>
      element.addEventListener(
        eventName,
        (event) => {
          if (isRestoredEvent(event)) return

          event.stopPropagation()
          event.preventDefault()

          setIsPending(true)

          lastEvent.current = event
        },
        {
          signal: abortController.signal,
          capture: true,
        },
      ),
    )

    return () => abortController.abort()
  }, deps ?? [])

  return {
    isPending,
    confirm: useCallback(() => {
      if (lastEvent.current) {
        restoreEvent(lastEvent.current)
        lastEvent.current = undefined
      }

      setIsPending(false)
    }, []),
    cancel: useCallback(() => {
      lastEvent.current = undefined
      setIsPending(false)
    }, []),
  }
}
