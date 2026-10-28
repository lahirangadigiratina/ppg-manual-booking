import { Package, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

type PrintPreferenceChoice = 'prefer' | 'not-prefer'

interface PrintPreferenceDialogProps {
  open: boolean
  onClose: () => void
  onPrefer: () => void
  onNotPrefer: () => void
}

function optionCardClassName(selected: boolean) {
  return `flex w-full cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
    selected
      ? 'border-black bg-gray-50/50'
      : 'border-border-light bg-white hover:border-gray-300'
  }`
}

export function PrintPreferenceDialog({
  open,
  onClose,
  onPrefer,
  onNotPrefer,
}: PrintPreferenceDialogProps) {
  const preferPrintId = useId()
  const notPreferPrintId = useId()
  const [choice, setChoice] = useState<PrintPreferenceChoice | null>(null)

  useEffect(() => {
    if (!open) {
      setChoice(null)
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

  const handleContinue = () => {
    if (choice === 'prefer') {
      onPrefer()
      return
    }
    if (choice === 'not-prefer') {
      onNotPrefer()
    }
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
        className="relative flex w-full max-w-md flex-col rounded-lg border border-border-light bg-white p-5 shadow-xl sm:p-6"
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
          className="w-full px-8 text-center text-lg font-bold text-black"
        >
          Print a shipping label?
          <span className="text-red-600" aria-hidden>
            *
          </span>
        </h2>

        <fieldset className="mt-5 w-full border-0 p-0">
          <legend className="sr-only">Print label preference</legend>
          <ul className="space-y-3">
            <li>
              <label htmlFor={preferPrintId} className={optionCardClassName(choice === 'prefer')}>
                <input
                  id={preferPrintId}
                  type="radio"
                  name="print-label-preference"
                  checked={choice === 'prefer'}
                  onChange={() => setChoice('prefer')}
                  className="mt-1 size-4 shrink-0 border border-gray-400 accent-black"
                />
                <span className="text-sm font-bold text-black">
                  Location has access to a printer and I want to print a label.
                </span>
              </label>
            </li>
            <li>
              <label
                htmlFor={notPreferPrintId}
                className={optionCardClassName(choice === 'not-prefer')}
              >
                <input
                  id={notPreferPrintId}
                  type="radio"
                  name="print-label-preference"
                  checked={choice === 'not-prefer'}
                  onChange={() => setChoice('not-prefer')}
                  className="mt-1 size-4 shrink-0 border border-gray-400 accent-black"
                />
                <span className="text-sm font-bold text-black">I prefer not to print a label</span>
              </label>
            </li>
          </ul>
        </fieldset>

        <div className="mt-4 flex w-full items-center gap-2.5 rounded-lg border border-border-light bg-gray-100 px-3 py-2.5 text-sm font-medium text-black">
          <Package className="size-4 shrink-0 text-black" strokeWidth={2} aria-hidden />
          <span>Please package this parcel before proceeding.</span>
        </div>

        <button
          type="button"
          disabled={choice === null}
          onClick={handleContinue}
          className="mt-6 w-full rounded-md py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-80 enabled:bg-gray-500 enabled:hover:bg-gray-600 sm:py-3"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
