import { Printer, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { manualPrimaryButtonClassName } from '../ppg/manualFormShared'
import type { DropoffLabelParcelDemo } from './returnParcelDemo'

interface ParcelDropoffConfirmDialogProps {
  open: boolean
  parcel: DropoffLabelParcelDemo | null
  onClose: () => void
  onConfirm: () => void
}

type LabelAttachmentChoice = 'printed-attached' | 'customer-attached'

function ShippingLabelPreview() {
  return (
    <div className="flex h-full min-h-[280px] flex-col rounded-sm border border-border-light bg-white p-3 sm:min-h-[320px] sm:p-4">
      <div className="mx-auto w-full max-w-[240px] flex-1 rounded-sm border border-gray-300 bg-white p-2 text-[8px] leading-tight text-black shadow-sm sm:text-[9px]">
        <p className="text-center font-bold tracking-wide">SJBNPZG</p>
        <div className="mx-auto mt-1 w-fit rounded-sm bg-black px-3 py-1 text-center text-[10px] font-bold text-white">
          POR009
        </div>
        <div className="mt-2 space-y-0.5 border-t border-gray-200 pt-2">
          <div className="h-6 rounded bg-gray-100" aria-hidden />
          <p>Weight 0.25kg</p>
          <p>Cube 0.001m³</p>
          <p>5/4/2022</p>
        </div>
        <p className="mt-2 font-semibold">Port Melbourne, VIC 3207</p>
        <p className="mt-1 text-text-muted">From</p>
        <div className="mt-1 h-8 rounded bg-gray-50" aria-hidden />
        <p className="mt-2 border-t border-gray-200 pt-1 text-[7px] text-text-muted">
          Aviation Security and Dangerous Goods Declaration
        </p>
      </div>
    </div>
  )
}

export function ParcelDropoffConfirmDialog({
  open,
  parcel,
  onClose,
  onConfirm,
}: ParcelDropoffConfirmDialogProps) {
  const printedAttachedId = useId()
  const customerAttachedId = useId()
  const [attachmentChoice, setAttachmentChoice] = useState<LabelAttachmentChoice | null>(null)

  useEffect(() => {
    if (!open) {
      setAttachmentChoice(null)
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

  const itemReference = parcel.itemReference ?? parcel.itemId

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-parcel-dropoff-title"
        className="relative flex max-h-[min(92vh,780px)] w-full max-w-3xl flex-col overflow-hidden rounded-sm border border-border-light bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirm dropoff"
          className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-md text-black hover:bg-gray-100 sm:right-3 sm:top-3"
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </button>

        <div className="overflow-y-auto px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <h2
            id="confirm-parcel-dropoff-title"
            className="px-8 text-center text-lg font-bold text-black sm:text-xl"
          >
            Confirm Dropoff
          </h2>

          <dl className="mx-auto mt-4 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-md bg-gray-100 px-4 py-3 text-sm sm:px-5 sm:py-4">
            <dt className="text-text-muted">Consignment ID</dt>
            <dd className="text-right font-semibold text-black">{parcel.consignmentId}</dd>
            <dt className="text-text-muted">Item Reference</dt>
            <dd className="text-right font-semibold text-black">{itemReference || '—'}</dd>
            {parcel.retailer ? (
              <>
                <dt className="text-text-muted">Retailer</dt>
                <dd className="text-right font-semibold text-black">{parcel.retailer}</dd>
              </>
            ) : null}
          </dl>

          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
            <ShippingLabelPreview />

            <div className="flex flex-col">
              <p className="text-sm font-bold text-black">Do you require to print a label?</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className={`flex-1 ${manualPrimaryButtonClassName}`}>
                  Print Label
                </button>
                <button
                  type="button"
                  aria-label="Print label"
                  className="flex size-[42px] shrink-0 items-center justify-center rounded-md border border-border-light bg-white text-black hover:bg-gray-50 sm:size-11"
                >
                  <Printer className="size-5" strokeWidth={1.75} aria-hidden />
                </button>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-black">
                <li>
                  <label
                    htmlFor={printedAttachedId}
                    className="flex cursor-pointer items-start gap-2.5"
                  >
                    <input
                      id={printedAttachedId}
                      type="checkbox"
                      checked={attachmentChoice === 'printed-attached'}
                      onChange={() => setAttachmentChoice('printed-attached')}
                      className="mt-0.5 size-4 shrink-0 rounded border border-gray-400 accent-black"
                    />
                    <span>Label printed and attached to the parcel</span>
                  </label>
                </li>
                <li className="text-center text-sm font-medium text-text-muted">or</li>
                <li>
                  <label
                    htmlFor={customerAttachedId}
                    className="flex cursor-pointer items-start gap-2.5"
                  >
                    <input
                      id={customerAttachedId}
                      type="checkbox"
                      checked={attachmentChoice === 'customer-attached'}
                      onChange={() => setAttachmentChoice('customer-attached')}
                      className="mt-0.5 size-4 shrink-0 rounded border border-gray-400 accent-black"
                    />
                    <span>Customer has already attached a label</span>
                  </label>
                </li>
              </ul>

              <button
                type="button"
                disabled={attachmentChoice === null}
                onClick={onConfirm}
                className="mt-5 w-full rounded-md bg-gray-400 px-6 py-2.5 text-sm font-semibold text-white transition-colors enabled:bg-gray-600 enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70 sm:py-3"
              >
                Confirm Dropoff
              </button>
            </div>
          </div>

          <p className="mt-5 text-right text-sm text-black sm:text-base">
            Please <span className="font-bold">hand off</span> this return parcel to the{' '}
            <span className="font-bold">driver</span>
          </p>
        </div>
      </div>
    </div>
  )
}
