import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { ConfirmModal } from './ConfirmModal'

const Modal = (props: {
  isOpen: boolean
  confirm: () => void
  cancel: () => void
}) => {
  return (
    <>
      {props.isOpen && (
        <div>
          <button type="button" onClick={props.confirm}>
            Confirm button
          </button>
          <button type="button" onClick={props.cancel}>
            Cancel button
          </button>
        </div>
      )}
    </>
  )
}

describe('Outer component', () => {
  it('cancels event', async () => {
    let isClicked = false

    const Component = () => {
      return (
        <main>
          <ConfirmModal modal={Modal} events={['onClickCapture']}>
            <button type="button" onClick={() => (isClicked = true)}>
              Origin event button
            </button>
          </ConfirmModal>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByText('Origin event button')

    fireEvent.click(button)

    const cancelButton = screen.getByText('Cancel button')

    fireEvent.click(cancelButton)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(isClicked).toBeFalsy()
  })

  it('confirms event', async () => {
    let isClicked = false

    const Component = () => {
      return (
        <main>
          <ConfirmModal modal={Modal} events={['onClickCapture']}>
            <button type="button" onClick={() => (isClicked = true)}>
              Origin event button
            </button>
          </ConfirmModal>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByText('Origin event button')

    fireEvent.click(button)

    const confirmButton = screen.getByText('Confirm button')

    fireEvent.click(confirmButton)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(isClicked).toBeTruthy()
  })

  it('cancels event if not clicked', async () => {
    let isClicked = false

    const Component = () => {
      return (
        <main>
          <ConfirmModal modal={Modal} events={['onClickCapture']}>
            <button type="button" onClick={() => (isClicked = true)}>
              Origin event button
            </button>
          </ConfirmModal>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByText('Origin event button')

    fireEvent.click(button)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(isClicked).toBeFalsy()
  })
})

describe('Inner component', () => {
  const InnerModal = (props: { children: ReactNode }) => {
    return <div>{props.children}</div>
  }

  it('cancels event', async () => {
    let isClicked = false
    let isButtonClicked = false

    const Component = () => {
      return (
        <main>
          <ConfirmModal
            modal={({ isOpen, cancel, confirm }) => (
              <>
                {isOpen && (
                  <InnerModal>
                    <button type="button" onClick={confirm}>
                      Confirm button
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        isButtonClicked = true
                        cancel()
                      }}
                    >
                      Cancel button
                    </button>
                  </InnerModal>
                )}
              </>
            )}
            events={['onClickCapture']}
          >
            <button type="button" onClick={() => (isClicked = true)}>
              Origin event button
            </button>
          </ConfirmModal>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByText('Origin event button')

    fireEvent.click(button)

    expect(isButtonClicked).toBeFalsy()

    const cancelButton = screen.getByText('Cancel button')

    fireEvent.click(cancelButton)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(isButtonClicked).toBeTruthy()
    expect(isClicked).toBeFalsy()
  })

  it('confirms event', async () => {
    let isClicked = false

    const Component = () => {
      return (
        <main>
          <ConfirmModal
            modal={({ isOpen, cancel, confirm }) => (
              <>
                {isOpen && (
                  <InnerModal>
                    <button type="button" onClick={confirm}>
                      Confirm button
                    </button>
                    <button type="button" onClick={cancel}>
                      Cancel button
                    </button>
                  </InnerModal>
                )}
              </>
            )}
            events={['onClickCapture']}
          >
            <button type="button" onClick={() => (isClicked = true)}>
              Origin event button
            </button>
          </ConfirmModal>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByText('Origin event button')

    fireEvent.click(button)

    const confirmButton = screen.getByText('Confirm button')

    fireEvent.click(confirmButton)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(isClicked).toBeTruthy()
  })

  it('cancels event if not clicked', async () => {
    let isClicked = false

    const Component = () => {
      return (
        <main>
          <ConfirmModal
            modal={({ isOpen, cancel, confirm }) => (
              <>
                {isOpen && (
                  <InnerModal>
                    <button type="button" onClick={confirm}>
                      Confirm button
                    </button>
                    <button type="button" onClick={cancel}>
                      Cancel button
                    </button>
                  </InnerModal>
                )}
              </>
            )}
            events={['onClickCapture']}
          >
            <button type="button" onClick={() => (isClicked = true)}>
              Origin event button
            </button>
          </ConfirmModal>
        </main>
      )
    }

    render(<Component></Component>)

    const button = screen.getByText('Origin event button')

    fireEvent.click(button)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(isClicked).toBeFalsy()
  })
})
