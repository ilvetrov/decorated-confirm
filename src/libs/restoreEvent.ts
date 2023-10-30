import { SyntheticEvent } from 'react'

const restoredEvents = new WeakSet()

export function restoreEvent(event: Event | SyntheticEvent<Element, Event>) {
  const validatedEvent = new Event(event.type, { bubbles: true })

  restoredEvents.add(validatedEvent)

  event.target?.dispatchEvent(validatedEvent)
}

export function isRestoredEvent(event: Event) {
  return restoredEvents.has(event)
}
