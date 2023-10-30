import { act, fireEvent, render, screen } from '@testing-library/react'
import React, { useRef } from 'react'
import useDecoratedEvent from './useDecoratedEvent'

describe('Outer component', () => {
  it('cancels event', async () => {
    let isClicked = false

    const Component = () => {
      const ref = useRef<HTMLButtonElement>(null)

      useDecoratedEvent(ref, ['click'])

      return (
        <main>
          <button ref={ref} type="button" onClick={() => (isClicked = true)}>
            Origin event button
          </button>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByText('Origin event button')

    fireEvent.click(button)

    await new Promise((resolve) => {
      setTimeout(resolve, 200)
    })

    expect(isClicked).toBeFalsy()
  })

  it('confirms event', async () => {
    let isClicked = false

    let outerConfirm: (() => void) | undefined

    const Component = () => {
      const ref = useRef<HTMLButtonElement>(null)

      const { confirm } = useDecoratedEvent(ref, ['click'])

      outerConfirm = confirm

      return (
        <main>
          <button ref={ref} type="button" onClick={() => (isClicked = true)}>
            Origin event button
          </button>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByText('Origin event button')

    fireEvent.click(button)

    act(() => {
      outerConfirm?.()
    })

    await new Promise((resolve) => {
      setTimeout(resolve, 200)
    })

    expect(isClicked).toBeTruthy()
  })
})
