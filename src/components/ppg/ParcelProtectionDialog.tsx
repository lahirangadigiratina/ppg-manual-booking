import { Check, ShieldCheck, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ParcelPointGoTermsDialog } from './ParcelPointGoTermsDialog'

const PROTECTION_POINTS = [
  'Up to $100 of Parcel Protection is included at no extra cost, based on your declared parcel value.',
  'For declared values over $100 additional protection can be selected for a fee.',
  'Claims are assessed in accordance with the Terms and Conditions and require proof of value and evidence of loss or damage.',
  'Any additional Parcel Protection must be selected before completing your booking.',
] as const

interface ParcelProtectionDialogProps {
  open: boolean
  onClose: () => void
}

export function ParcelProtectionDialog({ open, onClose }: ParcelProtectionDialogProps) {
  const gotItRef = useRef<HTMLButtonElement>(null)
  const [termsOpen, setTermsOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setTermsOpen(false)
      return
    }

    gotItRef.current?.focus()

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
    <>
      <ParcelPointGoTermsDialog open={termsOpen} onClose={() => setTermsOpen(false)} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        role="presentation"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="parcel-protection-title"
          className="max-h-[min(90vh,720px)] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl sm:max-w-2xl sm:p-7"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-hubbed-orange-tint">
                <ShieldCheck className="size-5 text-hubbed-orange" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 id="parcel-protection-title" className="text-lg font-bold text-black sm:text-xl">
                  Parcel Protection
                </h2>
                <p className="mt-1 text-sm leading-snug text-text-muted">
                  Free protection up to $100 against loss or damage during delivery.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-gray-800 sm:text-base">
            Parcel Protection covers your parcel for loss or damage, up to a declared value of $100, at
            no extra cost. For parcels valued over $100, additional cover is available for a fee,
            based on your declared value.
          </p>

          <div className="mt-5 rounded-xl bg-gray-50 p-4 sm:p-5">
            <p className="text-xs font-bold tracking-wide text-text-muted">WHAT YOU NEED TO KNOW</p>
            <ul className="mt-3 space-y-3">
              {PROTECTION_POINTS.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm leading-snug text-gray-700">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-hubbed-orange"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 space-y-1 text-sm text-text-muted">
            <p>Terms, claim timeframes and exclusions apply.</p>
            <p>
              View{' '}
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="font-medium text-hubbed-orange underline hover:text-hubbed-orange-hover"
              >
                Terms &amp; Conditions
              </button>
              .
            </p>
          </div>

          <button
            ref={gotItRef}
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-hubbed-orange py-3.5 text-sm font-bold text-white transition-colors hover:bg-hubbed-orange-hover sm:text-base"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  )
}
