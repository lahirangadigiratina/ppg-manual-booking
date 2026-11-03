import { Package, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import {
  DROP_OFF_PACKAGING_SURCHARGE_LABEL,
  dropOffCollectAmountLabel,
} from './returnParcelDemo'

interface ReturnDropoffCashConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  /** Packaging add-on is on and cannot be changed (e.g. pre-purchased). */
  packagingIncludedLocked?: boolean
}

export function ReturnDropoffCashConfirmDialog({
  open,
  onClose,
  onConfirm,
  packagingIncludedLocked = false,
}: ReturnDropoffCashConfirmDialogProps) {
  const cashReceivedId = useId()
  const includePackagingId = useId()
  const [cashReceived, setCashReceived] = useState(false)
  const [includePackaging, setIncludePackaging] = useState(false)

  const packagingActive = packagingIncludedLocked || includePackaging
  const collectAmountLabel = dropOffCollectAmountLabel(packagingActive)

  useEffect(() => {
    if (!open) {
      setCashReceived(false)
      setIncludePackaging(false)
      return
    }
    if (packagingIncludedLocked) {
      setIncludePackaging(true)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, packagingIncludedLocked])

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
        aria-labelledby="return-dropoff-cash-confirm-title"
        className="relative flex w-full max-w-md flex-col rounded-xl border border-border-light bg-white p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirm drop-off"
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-md text-black hover:bg-gray-100 sm:right-3 sm:top-3"
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </button>

        <h2
          id="return-dropoff-cash-confirm-title"
          className="w-full px-8 text-center text-lg font-bold text-black sm:text-xl"
        >
          Payment Confirmation
        </h2>

        <label
          htmlFor={includePackagingId}
          className={`mt-5 flex w-full items-center gap-3 rounded-xl border p-3.5 transition-colors sm:p-4 ${
            packagingActive
              ? 'border-black bg-gray-50'
              : 'border-border-light bg-white hover:border-gray-300'
          } ${packagingIncludedLocked ? 'cursor-default opacity-95' : 'cursor-pointer'}`}
        >
          <input
            id={includePackagingId}
            type="checkbox"
            checked={packagingActive}
            disabled={packagingIncludedLocked}
            onChange={(event) => setIncludePackaging(event.target.checked)}
            className="size-4 shrink-0 rounded border border-gray-400 accent-black focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
          />
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-black"
            aria-hidden
          >
            <Package className="size-5" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-black">
              {packagingIncludedLocked ? 'Packaging Included' : 'Add packaging'}
            </span>
            {packagingIncludedLocked ? (
              <span className="mt-0.5 block text-xs leading-snug text-black sm:text-sm">
                Please package this parcel
              </span>
            ) : null}
            <span className="mt-0.5 block text-xs leading-snug text-text-muted sm:text-sm">
              Shoebox · 30 × 25 × 15 cm ·{' '}
              <span className="whitespace-nowrap">up to 3kg</span>
            </span>
          </span>
          {packagingIncludedLocked ? null : (
            <span className="shrink-0 text-sm font-bold tabular-nums text-black">
              +{DROP_OFF_PACKAGING_SURCHARGE_LABEL}
            </span>
          )}
        </label>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-md border border-gray-300 border-l-4 border-l-black bg-gray-200/80 py-4 pl-3 pr-4 sm:pl-4 sm:pr-5">
          <div className="min-w-0">
            <p className="text-xs font-bold leading-snug text-black sm:text-sm">
              Please ensure that you collect the payment.
            </p>
          </div>
          <p
            className="shrink-0 text-xl font-bold tabular-nums text-black"
            aria-live="polite"
          >
            {collectAmountLabel}
          </p>
        </div>

        <label
          htmlFor={cashReceivedId}
          className="mt-5 flex w-full cursor-pointer items-center gap-2.5 text-sm text-black"
        >
          <input
            id={cashReceivedId}
            type="checkbox"
            checked={cashReceived}
            onChange={(event) => setCashReceived(event.target.checked)}
            className="size-4 shrink-0 rounded border border-gray-400 accent-black focus:ring-2 focus:ring-gray-300"
          />
          <span className="font-medium text-red-600">Payment Received</span>
        </label>

        <button
          type="button"
          disabled={!cashReceived}
          onClick={() => onConfirm()}
          className="mt-6 w-auto min-w-[12rem] self-center rounded-md px-8 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#f5ded4] disabled:hover:bg-[#f5ded4] enabled:bg-hubbed-orange enabled:hover:bg-hubbed-orange-hover sm:py-3 sm:text-base"
        >
          Confirm Dropoff
        </button>
      </div>
    </div>
  )
}
