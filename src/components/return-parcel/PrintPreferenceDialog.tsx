import { X } from 'lucide-react'
import { useEffect } from 'react'
import { manualPrimaryButtonClassName, manualSecondaryButtonClassName } from '../ppg/manualFormShared'

interface PrintPreferenceDialogProps {
  open: boolean
  onClose: () => void
  onPrefer: () => void
  onNotPrefer: () => void
}

export function PrintPreferenceDialog({
  open,
  onClose,
  onPrefer,
  onNotPrefer,
}: PrintPreferenceDialogProps) {
  useEffect(() => {
    if (!open) {
      return
    }
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-preference-title"
        aria-describedby="print-preference-helper"
        className="relative flex w-full max-w-md flex-col items-center rounded-sm border border-border-light bg-white p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close print preference"
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-md text-black hover:bg-gray-100 sm:right-3 sm:top-3"
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </button>

        <h2
          id="print-preference-title"
          className="w-full px-8 text-center text-base font-bold text-black sm:text-lg"
        >
          Would you prefer to print a label?
          <span className="text-red-600" aria-hidden>
            *
          </span>
        </h2>
        <p
          id="print-preference-helper"
          className="mt-2 w-full px-2 text-center text-sm leading-snug text-text-muted"
        >
          Location has access to a printer and I want to print a label.
        </p>

        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          <button type="button" onClick={onPrefer} className={manualPrimaryButtonClassName}>
            Prefer
          </button>
          <button type="button" onClick={onNotPrefer} className={manualSecondaryButtonClassName}>
            Not prefer
          </button>
        </div>
      </div>
    </div>
  )
}
