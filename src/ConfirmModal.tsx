import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { DecoratedConfirm } from './Confirm'
import { CaptureEvents, ConfirmFunction } from './libs/events'
import externalPromise, { ExternalPromise } from './libs/externalPromise'

export function ConfirmModal({
  children,
  events,
  modal,
  className,
}: {
  children: ReactNode
  events: (keyof CaptureEvents)[]
  modal: (props: {
    confirm: () => void
    cancel: () => void
    isOpen: boolean
  }) => JSX.Element
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const lastPromise = useRef<ExternalPromise<boolean>>()

  const confirm = useCallback(() => {
    lastPromise.current?.resolve(true)
    setIsOpen(false)
  }, [])

  const cancel = useCallback(() => {
    lastPromise.current?.resolve(false)
    setIsOpen(false)
  }, [])

  const eventProps = useMemo(() => {
    const props = {}

    events.forEach((eventName) => {
      props[eventName] = () => {
        const promise = externalPromise<boolean>()

        setIsOpen(true)

        if (lastPromise.current) {
          lastPromise.current.resolve(false)
        }

        lastPromise.current = promise

        return promise.promise
      }
    })

    return props as Record<
      keyof typeof events,
      ConfirmFunction<keyof CaptureEvents>
    >
  }, events)

  return (
    <>
      {modal({ isOpen, confirm, cancel })}
      <DecoratedConfirm className={className} {...eventProps}>
        {children}
      </DecoratedConfirm>
    </>
  )
}
