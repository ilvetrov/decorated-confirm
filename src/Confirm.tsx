import React, { SyntheticEvent, useRef, ReactNode, useMemo } from 'react'
import { CaptureEvents } from './libs/events'
import mapObject from './libs/mapObject'
import { isRestoredEvent, restoreEvent } from './libs/restoreEvent'

export function DecoratedConfirm({
  children,
  className,
  ...events
}: {
  children: ReactNode
  className?: string
} & CaptureEvents) {
  const wrapElement = useRef<HTMLDivElement>(null)

  const preparedEvents = useMemo(
    () =>
      mapObject(events, (handler) => async (event: SyntheticEvent) => {
        if (
          !handler ||
          isRestoredEvent(event.nativeEvent) ||
          event.target === wrapElement.current
        )
          return

        const canDoAction = handler(event as any)

        if (canDoAction === true) {
          return
        }

        event.stopPropagation()

        try {
          // For React 16
          event.persist()
        } catch (_error) {
          //
        }

        if (canDoAction instanceof Promise) {
          const result = await canDoAction

          if (result) {
            restoreEvent(event)
          }
        }
      }),
    Object.values(events),
  )

  return (
    <div className={className} ref={wrapElement} {...preparedEvents}>
      {children}
    </div>
  )
}
