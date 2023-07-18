import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { DecoratedConfirm } from './Confirm'

describe('Sync callback', () => {
  it('cancels event', () => {
    let isClicked = false

    const Component = () => {
      return (
        <main>
          <DecoratedConfirm onClickCapture={() => false}>
            <button type="button" onClick={() => (isClicked = true)}>
              Test
            </button>
          </DecoratedConfirm>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(isClicked).toBeFalsy()
  })

  it('confirms event', () => {
    let isClicked = false

    const Component = () => {
      return (
        <main>
          <DecoratedConfirm onClickCapture={() => true}>
            <button type="button" onClick={() => (isClicked = true)}>
              Test
            </button>
          </DecoratedConfirm>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(isClicked).toBeTruthy()
  })
})

describe('Async callback', () => {
  it('cancels event', async () => {
    let isClicked = false
    let isPromiseResolved = false

    const Component = () => {
      return (
        <main>
          <DecoratedConfirm
            onClickCapture={() =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve(false)
                  isPromiseResolved = true
                }, 100)
              })
            }
          >
            <button type="button" onClick={() => (isClicked = true)}>
              Test
            </button>
          </DecoratedConfirm>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(isClicked).toBeFalsy()
    expect(isPromiseResolved).toBeFalsy()

    await new Promise((resolve) => {
      setTimeout(resolve, 300)
    })

    expect(isClicked).toBeFalsy()
    expect(isPromiseResolved).toBeTruthy()
  })

  it('confirms event', async () => {
    let isClicked = false
    let isPromiseResolved = false

    const Component = () => {
      return (
        <main>
          <DecoratedConfirm
            onClickCapture={() =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve(true)
                  isPromiseResolved = true
                }, 100)
              })
            }
          >
            <button type="button" onClick={() => (isClicked = true)}>
              Test
            </button>
          </DecoratedConfirm>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(isClicked).toBeFalsy()
    expect(isPromiseResolved).toBeFalsy()

    await new Promise((resolve) => {
      setTimeout(resolve, 300)
    })

    expect(isClicked).toBeTruthy()
    expect(isPromiseResolved).toBeTruthy()
  })
})

describe('Broken async callback', () => {
  it('not resolved promise does not confirm event', async () => {
    let isClicked = false

    const Component = () => {
      return (
        <main>
          <DecoratedConfirm onClickCapture={() => new Promise(() => {})}>
            <button type="button" onClick={() => (isClicked = true)}>
              Test
            </button>
          </DecoratedConfirm>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByRole('button')

    fireEvent.click(button)

    await new Promise((resolve) => {
      setTimeout(resolve, 300)
    })

    expect(isClicked).toBeFalsy()
  })
})
