import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { PayToAgreementIntroContent } from '../../payto/PayToAgreementIntroContent'
import { manualPrimaryButtonClassName } from '../ppg/manualFormShared'

interface PayToAgreementIntroDialogProps {
  open: boolean
  onClose: () => void
  /** When true, overlay is scoped to the nearest `relative` parent (e.g. form card). */
  anchor?: boolean
}

export function PayToAgreementIntroDialog({
  open,
  onClose,
  anchor = false,
}: PayToAgreementIntroDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  const overlayClassName = anchor
    ? 'absolute inset-0 z-20 flex items-center justify-center rounded-sm bg-black/40 p-3 sm:p-4'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'

  const panelClassName = anchor
    ? 'flex max-h-full min-h-0 w-full flex-col overflow-hidden rounded-sm border border-border-light bg-white shadow-xl'
    : 'flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-sm border border-border-light bg-white shadow-xl'

  return (
    <div className={overlayClassName} role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payto-intro-title"
        className={panelClassName}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-light px-4 py-3 sm:px-5 sm:py-4">
          <h2 id="payto-intro-title" className="text-lg font-bold text-black sm:text-xl">
            What is a PayTo agreement?
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <PayToAgreementIntroContent />
        </div>

        <div className="shrink-0 border-t border-border-light px-4 py-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className={`w-full ${manualPrimaryButtonClassName}`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
