import { X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { DROP_OFF_COLLECT_AMOUNT_LABEL } from './returnParcelDemo'
import { confirmDropoffButtonClassName } from './returnParcelShared'

interface ReturnDropoffCashConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ReturnDropoffCashConfirmDialog({
  open,
  onClose,
  onConfirm,
}: ReturnDropoffCashConfirmDialogProps) {
  const checkboxId = useId()
  const [cashReceived, setCashReceived] = useState(false)

  useEffect(() => {
    if (!open) {
      setCashReceived(false)
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
        aria-labelledby="return-dropoff-cash-confirm-title"
        className="relative flex w-full max-w-md flex-col items-center rounded-sm border border-border-light bg-white p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close payment confirmation"
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-md text-black hover:bg-gray-100 sm:right-3 sm:top-3"
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
        <h2
          id="return-dropoff-cash-confirm-title"
          className="w-full px-8 text-center text-base font-bold text-black sm:text-lg"
        >
          Payment Confirmation
        </h2>
        <p className="mt-2 w-full text-center text-sm leading-snug text-red-600">
          Please ensure that you collect the payment amount of {DROP_OFF_COLLECT_AMOUNT_LABEL}.
        </p>

        <label
          htmlFor={checkboxId}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2.5 text-center text-sm text-black"
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={cashReceived}
            onChange={(event) => setCashReceived(event.target.checked)}
            className="size-4 shrink-0 rounded border border-gray-400 accent-black focus:ring-2 focus:ring-gray-300"
          />
          <span>Cash Received</span>
        </label>

        <button
          type="button"
          disabled={!cashReceived}
          onClick={() => onConfirm()}
          className={`mt-6 w-auto min-w-[12rem] shrink-0 px-8 ${confirmDropoffButtonClassName}`}
        >
          Confirm Dropoff
        </button>
      </div>
    </div>
  )
}
