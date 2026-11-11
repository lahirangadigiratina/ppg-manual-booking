import { Package, Printer, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { DROP_OFF_PACKAGING_SURCHARGE_LABEL, type DropoffLabelParcelDemo } from './returnParcelDemo'
import { downloadDemoShippingLabel } from './returnParcelShared'

interface ParcelDropoffConfirmDialogProps {
  open: boolean
  parcel: DropoffLabelParcelDemo | null
  onClose: () => void
  onConfirm: () => void
}

type LabelAttachmentChoice = 'customer-attached' | 'location-print'

function labelOptionCardClassName(selected: boolean) {
  return `grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border p-4 transition-colors sm:p-4 ${
    selected
      ? 'border-black bg-gray-50'
      : 'border-border-light bg-white hover:border-gray-300'
  }`
}

function formatItemReference(parcel: DropoffLabelParcelDemo): string {
  if (parcel.itemReference === undefined) {
    return '—'
  }
  const trimmed = parcel.itemReference.trim()
  return trimmed.length > 0 ? trimmed : '—'
}

export function ParcelDropoffConfirmDialog({
  open,
  parcel,
  onClose,
  onConfirm,
}: ParcelDropoffConfirmDialogProps) {
  const labelAttachedId = useId()
  const locationPrintLabelId = useId()
  const shippingLabelChoiceName = useId()
  const includePackagingId = useId()
  const paymentReceivedId = useId()
  const [attachmentChoice, setAttachmentChoice] = useState<LabelAttachmentChoice | null>(null)
  const [includePackaging, setIncludePackaging] = useState(false)
  const [paymentReceived, setPaymentReceived] = useState(false)

  const packagingIncludedLocked = Boolean(parcel?.packagingPreIncluded)

  useEffect(() => {
    if (!open) {
      setAttachmentChoice(null)
      setIncludePackaging(false)
      setPaymentReceived(false)
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

  if (!open || !parcel) {
    return null
  }

  const itemReferenceDisplay = formatItemReference(parcel)
  const showPackagingSelection = Boolean(parcel.showPackagingSelection)
  const packagingActive = packagingIncludedLocked || includePackaging
  const showPaymentReceived =
    showPackagingSelection && includePackaging && !packagingIncludedLocked
  const paymentRequirementMet = !showPaymentReceived || paymentReceived
  const canConfirmDropoff = attachmentChoice !== null && paymentRequirementMet

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
            className="relative flex max-h-[min(92vh,780px)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border-light bg-white shadow-xl"
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

            <div className="flex flex-col overflow-y-auto px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
              <h2
                id="confirm-parcel-dropoff-title"
                className="px-8 text-center text-lg font-bold text-black sm:text-xl"
              >
                Confirm dropoff
              </h2>

              <dl className="mx-auto mt-5 grid w-fit max-w-full grid-cols-[auto_auto] gap-x-6 gap-y-2.5 rounded-xl bg-gray-100 px-4 py-4 text-sm sm:px-5">
                <dt className="text-text-muted">Consignment ID</dt>
                <dd className="text-right font-semibold text-black">{parcel.consignmentId}</dd>
                <dt className="text-text-muted">Item Reference</dt>
                <dd className="text-right font-semibold text-black">{itemReferenceDisplay}</dd>
                <dt className="text-text-muted">Retailer</dt>
                <dd className="text-right font-semibold text-black">
                  {parcel.retailer?.trim() ? parcel.retailer : '—'}
                </dd>
              </dl>

              {showPackagingSelection ? (
                <fieldset className="mt-5 border-0 p-0">
                  <legend className="text-sm font-bold text-black">Packaging selection</legend>
                  <label
                    htmlFor={includePackagingId}
                    className={`mt-3 flex w-full items-center gap-3 rounded-xl border p-3.5 transition-colors sm:p-4 ${
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
                      onChange={(event) => {
                        const checked = event.target.checked
                        setIncludePackaging(checked)
                        if (!checked) {
                          setPaymentReceived(false)
                        }
                      }}
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
                </fieldset>
              ) : null}

              <fieldset className="mt-5 border-0 p-0">
                <legend className="text-sm font-bold text-black">Shipping label</legend>
                <ul className="mt-3 space-y-3">
                  <li>
                    <label
                      htmlFor={labelAttachedId}
                      className={labelOptionCardClassName(attachmentChoice === 'customer-attached')}
                    >
                      <input
                        id={labelAttachedId}
                        type="radio"
                        name={shippingLabelChoiceName}
                        checked={attachmentChoice === 'customer-attached'}
                        onChange={() => setAttachmentChoice('customer-attached')}
                        className="size-4 shrink-0 border border-gray-400 accent-black"
                      />
                      <span className="min-w-0 text-sm font-bold text-black">
                        Label already attached to the parcel
                      </span>
                      <button
                        type="button"
                        aria-label="Print label"
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          downloadDemoShippingLabel()
                        }}
                        className="flex size-10 shrink-0 items-center justify-center rounded border border-border-light bg-white text-black hover:bg-gray-50"
                      >
                        <Printer className="size-5" strokeWidth={1.75} aria-hidden />
                      </button>
                    </label>
                  </li>
                  <li>
                    <div
                      className={labelOptionCardClassName(attachmentChoice === 'location-print')}
                    >
                      <input
                        id={locationPrintLabelId}
                        type="radio"
                        name={shippingLabelChoiceName}
                        checked={attachmentChoice === 'location-print'}
                        onChange={() => setAttachmentChoice('location-print')}
                        className="size-4 shrink-0 border border-gray-400 accent-black"
                      />
                      <label
                        htmlFor={locationPrintLabelId}
                        className="min-w-0 cursor-pointer text-sm font-bold text-black"
                      >
                        Location has access to a printer and I want to print a label.
                      </label>
                      {attachmentChoice === 'location-print' ? (
                        <button
                          type="button"
                          aria-label="Print label"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            downloadDemoShippingLabel()
                          }}
                          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-900"
                        >
                          <Printer className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
                          Print label
                        </button>
                      ) : (
                        <span className="size-10 shrink-0" aria-hidden />
                      )}
                    </div>
                  </li>
                </ul>
              </fieldset>

              {showPaymentReceived ? (
                <label
                  htmlFor={paymentReceivedId}
                  className="mt-5 flex w-full cursor-pointer items-center gap-2.5 text-sm text-black"
                >
                  <input
                    id={paymentReceivedId}
                    type="checkbox"
                    checked={paymentReceived}
                    onChange={(event) => setPaymentReceived(event.target.checked)}
                    className="size-4 shrink-0 rounded border border-gray-400 accent-black focus:ring-2 focus:ring-gray-300"
                  />
                  <span className="font-medium text-red-600">Payment Received</span>
                </label>
              ) : null}

              <button
                type="button"
                disabled={!canConfirmDropoff}
                onClick={() => onConfirm()}
                className="mt-6 w-auto min-w-[12rem] self-center rounded-md px-8 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 enabled:bg-black enabled:text-white enabled:hover:bg-gray-900 sm:py-2.5 sm:text-base"
              >
                Confirm dropoff
              </button>
            </div>
          </div>
    </div>
  )
}
