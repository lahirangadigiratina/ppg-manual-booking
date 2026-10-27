import { useEffect } from 'react'
import {
  manualPrimaryButtonClassName,
  manualSecondaryButtonClassName,
} from '../ppg/manualFormShared'
import type { DropoffLabelParcelDemo } from './returnParcelDemo'

interface ParcelDropoffConfirmDialogProps {
  open: boolean
  parcel: DropoffLabelParcelDemo | null
  onClose: () => void
  onConfirm: () => void
}

export function ParcelDropoffConfirmDialog({
  open,
  parcel,
  onClose,
  onConfirm,
}: ParcelDropoffConfirmDialogProps) {
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

  if (!open || !parcel) {
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
        aria-labelledby="confirm-parcel-dropoff-title"
        className="w-full max-w-md rounded-lg border border-border-light bg-white p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="confirm-parcel-dropoff-title"
          className="text-center text-base font-bold text-black sm:text-lg"
        >
          Please confirm parcel dropoff
        </h2>
        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-md bg-gray-100 px-4 py-4 text-sm">
          <dt className="text-text-muted">Name :</dt>
          <dd className="text-right font-semibold text-black">{parcel.name}</dd>
          <dt className="text-text-muted">Consignment ID :</dt>
          <dd className="text-right font-semibold text-black">{parcel.consignmentId}</dd>
          <dt className="text-text-muted">Item ID :</dt>
          <dd className="text-right font-semibold text-black">{parcel.itemId}</dd>
          {parcel.retailer ? (
            <>
              <dt className="text-text-muted">Retailer</dt>
              <dd className="text-right font-semibold text-black">{parcel.retailer}</dd>
            </>
          ) : null}
        </dl>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className={`w-full ${manualSecondaryButtonClassName}`}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={`w-full ${manualPrimaryButtonClassName}`}>
            Confirm Dropoff
          </button>
        </div>
      </div>
    </div>
  )
}
