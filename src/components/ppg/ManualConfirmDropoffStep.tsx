import { Printer } from 'lucide-react'
import { useId, useState } from 'react'
import { manualPrimaryButtonClassName } from './manualFormShared'

function LabelBarcode({ className = '' }: { className?: string }) {
  const bars = [3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3]
  return (
    <div className={`flex h-12 items-end gap-px ${className}`} aria-hidden>
      {bars.map((w, i) => (
        <div key={i} className="h-full bg-black" style={{ width: `${w}px` }} />
      ))}
    </div>
  )
}

function LabelPreviewMock() {
  return (
    <div className="mx-auto w-full max-w-[280px] border border-gray-300 bg-white p-2.5 text-left text-black shadow-sm sm:p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[9px] leading-tight text-gray-700">
          <p>5/4/2022</p>
          <p className="font-bold">ATL</p>
        </div>
        <p className="text-right text-base font-bold tracking-wide sm:text-lg">SJBNPZG</p>
      </div>

      <div className="mt-1.5 inline-block bg-black px-3 py-1 text-sm font-bold text-white">POR009</div>

      <div className="mt-2 flex gap-4 text-[9px] text-gray-800">
        <p>
          <span className="font-semibold">Weight</span> 0.25kg
        </p>
        <p>
          <span className="font-semibold">Cube</span> 0.001m³
        </p>
      </div>

      <LabelBarcode className="mt-2 w-full" />
      <p className="mt-1 text-center font-mono text-[9px] tracking-wide">CP825373532AU75</p>

      <div className="mt-3 border-t border-gray-200 pt-2">
        <p className="text-[11px] font-bold leading-snug sm:text-xs">
          65 Salmon St, Port Melbourne VIC 3207
        </p>
        <p className="mt-1 text-[10px] text-gray-700">Leave in a safe place</p>
      </div>

      <p className="mt-3 text-[8px] leading-snug text-gray-600">
        <span className="font-semibold text-gray-800">From </span>
        St Kilda Road, San Remo NSW 2262
      </p>

      <div className="mt-3 border-t border-gray-200 pt-2">
        <p className="text-[8px] font-bold leading-tight sm:text-[9px]">
          Aviation Security and Dangerous Goods Declaration
        </p>
        <p className="mt-1 text-[7px] leading-[1.35] text-gray-600 sm:text-[8px]">
          The sender acknowledges that this article may be carried by air and declares that the
          contents are not dangerous goods and comply with applicable aviation security requirements.
        </p>
      </div>
    </div>
  )
}

interface ManualConfirmDropoffStepProps {
  consignmentId: string
  onConfirm?: () => void
}

export function ManualConfirmDropoffStep({
  consignmentId,
  onConfirm,
}: ManualConfirmDropoffStepProps) {
  const labelPrintedId = useId()
  const customerLabelId = useId()

  const [labelPrintedAttached, setLabelPrintedAttached] = useState(false)
  const [customerAttachedLabel, setCustomerAttachedLabel] = useState(false)

  const canConfirm = labelPrintedAttached || customerAttachedLabel

  return (
    <div className="w-full">
      <h2 className="text-center text-xl font-bold text-black sm:text-2xl">Confirm Dropoff</h2>

      <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-sm sm:px-5 sm:py-4">
        <dl className="grid gap-2 sm:grid-cols-3 sm:gap-4">
          <div>
            <dt className="text-text-muted">Consignment ID</dt>
            <dd className="font-semibold text-black">{consignmentId}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Item Reference</dt>
            <dd className="font-semibold text-black">—</dd>
          </div>
          <div>
            <dt className="text-text-muted">Retailer</dt>
            <dd className="font-semibold text-black">PARCELPOINT GO Dropoff</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 items-start justify-center rounded-lg border border-border-light bg-gray-100 p-4 sm:p-6">
          <LabelPreviewMock />
        </div>

        <div className="flex min-w-0 flex-1 flex-col lg:max-w-md">
          <p className="text-sm font-medium text-black sm:text-base">
            Do you require to print a label?
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" className={`flex-1 ${manualPrimaryButtonClassName}`}>
              Print Label
            </button>
            <button
              type="button"
              className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border-light bg-white text-black transition-colors hover:bg-gray-50"
              aria-label="Print label"
            >
              <Printer className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          <div className="mt-5 space-y-3 text-left text-sm text-black">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                id={labelPrintedId}
                checked={labelPrintedAttached}
                onChange={(e) => setLabelPrintedAttached(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-gray-300"
              />
              <span>Label printed and attached to the parcel</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                id={customerLabelId}
                checked={customerAttachedLabel}
                onChange={(e) => setCustomerAttachedLabel(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-gray-300"
              />
              <span>or Customer has already attached a label</span>
            </label>
          </div>

          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => {
              if (!canConfirm) {
                return
              }
              onConfirm?.()
            }}
            className={`mt-6 w-full rounded-md py-3.5 text-sm font-semibold transition-colors sm:text-base ${
              canConfirm
                ? 'bg-gray-700 text-white hover:bg-gray-800'
                : 'cursor-not-allowed bg-gray-200 text-gray-500'
            }`}
          >
            Confirm Dropoff
          </button>

          <p className="mt-4 text-center text-sm text-text-muted">
            Please <span className="font-bold text-black">hand off</span> this return parcel to the{' '}
            <span className="font-bold text-black">driver</span>
          </p>
        </div>
      </div>
    </div>
  )
}
