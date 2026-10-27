import { X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { manualPrimaryButtonClassName } from '../ppg/manualFormShared'

type PrintPreferenceChoice = 'prefer' | 'not-prefer'

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

        <fieldset className="mt-5 w-full border-0 p-0">
          <legend className="sr-only">Print label preference</legend>
          <ul className="space-y-3">
            <li>
              <label
                htmlFor={preferPrintId}
                className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-black"
              >
                <input
                  id={preferPrintId}
                  type="radio"
                  name="print-label-preference"
                  checked={choice === 'prefer'}
                  onChange={() => setChoice('prefer')}
                  className="mt-0.5 size-4 shrink-0 border border-gray-400 accent-black"
                />
                <span>Location has access to a printer and I want to print a label.</span>
              </label>
            </li>
            <li>
              <label
                htmlFor={notPreferPrintId}
                className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-black"
              >
                <input
                  id={notPreferPrintId}
                  type="radio"
                  name="print-label-preference"
                  checked={choice === 'not-prefer'}
                  onChange={() => setChoice('not-prefer')}
                  className="mt-0.5 size-4 shrink-0 border border-gray-400 accent-black"
                />
                <span>I prefer not to print a label</span>
              </label>
            </li>
          </ul>
        </fieldset>

        <button
          type="button"
          disabled={choice === null}
          onClick={handleContinue}
          className={`mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50 ${manualPrimaryButtonClassName}`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
