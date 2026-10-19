import { Check, Copy, Package, Printer } from 'lucide-react'
import type { ManualBookingDraft } from './manualBookingState'
import {
  buildSuccessParcelSubtitle,
  buildSuccessRouteHeadline,
} from './manualBookingState'
import { useState } from 'react'
import {
  manualFlowStepHelperClassName,
  manualFlowStepTitleClassName,
} from './manualFormShared'

const successFooterButtonClassName =
  'flex w-full min-h-[52px] items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold sm:text-base'

export const BOOKING_TRACKING_NUMBER = 'MP8031920017'

interface ManualBookingSuccessStepProps {
  draft: ManualBookingDraft
  totalLabel: string
  onNext?: () => void
}

export function ManualBookingSuccessStep({
  draft,
  totalLabel,
  onNext,
}: ManualBookingSuccessStepProps) {
  const routeHeadline = buildSuccessRouteHeadline(draft)
  const parcelSubtitle = buildSuccessParcelSubtitle(draft)
  const [trackingCopied, setTrackingCopied] = useState(false)

  const copyTrackingNumber = async () => {
    try {
      await navigator.clipboard.writeText(BOOKING_TRACKING_NUMBER)
      setTrackingCopied(true)
      window.setTimeout(() => setTrackingCopied(false), 2000)
    } catch {
      setTrackingCopied(false)
    }
  }

  const proceedToDropoff = async () => {
    try {
      await navigator.clipboard.writeText(BOOKING_TRACKING_NUMBER)
    } catch {
      // Clipboard may be unavailable; still navigate to Returns
    }
    onNext?.()
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-0.5 py-3 sm:py-4">
        <div className="flex w-full flex-col items-center text-center">
        <div className="relative mb-2 flex size-12 shrink-0 items-center justify-center sm:mb-2.5 sm:size-14">
          <span className="absolute inset-0 rounded-full bg-green-100" aria-hidden />
          <span className="relative flex size-9 items-center justify-center rounded-full bg-green-600 sm:size-10">
            <Check className="size-5 text-white sm:size-6" strokeWidth={2.5} aria-hidden />
          </span>
        </div>

        <h2 className={manualFlowStepTitleClassName}>All Booked!</h2>
        <p className={manualFlowStepHelperClassName}>Payment received — shipment is booked</p>
        <p className={`${manualFlowStepHelperClassName} mt-0 line-clamp-none`}>
          Digital Receipt has been sent to the Customer
        </p>
        <p className="mt-1 text-xs font-bold text-black sm:text-sm">
          1 shipment confirmed · {totalLabel}
        </p>

        <article className="mt-2.5 w-full shrink-0 rounded-xl border border-border-light bg-white text-left sm:mt-3">
          <div className="flex gap-2 p-2.5 sm:p-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 sm:size-9">
              <Package className="size-4 text-amber-800/80 sm:size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug text-black">{routeHeadline}</p>
              <p className="mt-0.5 text-xs text-text-muted sm:text-sm">{parcelSubtitle}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-bold text-black sm:text-sm">{totalLabel}</p>
              <p className="text-[10px] text-text-muted">incl. GST</p>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 border-t border-border-light px-2.5 py-2.5 text-sm sm:px-3 sm:py-3">
            <span className="text-text-muted">Booking Ref</span>
            <span className="justify-self-end font-bold text-black">PPG-48213</span>
            <span className="text-text-muted">Tracking</span>
            <div className="flex items-center justify-end gap-1.5 justify-self-end">
              <span className="font-bold text-black">{BOOKING_TRACKING_NUMBER}</span>
              <button
                type="button"
                onClick={copyTrackingNumber}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-gray-100 hover:text-black"
                aria-label={trackingCopied ? 'Tracking number copied' : 'Copy tracking number'}
              >
                {trackingCopied ? (
                  <Check className="size-4 text-green-600" strokeWidth={2.5} aria-hidden />
                ) : (
                  <Copy className="size-4" strokeWidth={2} aria-hidden />
                )}
              </button>
            </div>
          </div>
        </article>

        <div className="mt-3 flex w-full shrink-0 flex-col gap-2 sm:mt-4">
          <button
            type="button"
            onClick={() => window.print()}
            className={`${successFooterButtonClassName} border border-border-light bg-white text-black transition-colors hover:bg-gray-50`}
          >
            <Printer className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            Print Label
          </button>
          <button
            type="button"
            onClick={() => void proceedToDropoff()}
            className={`${successFooterButtonClassName} bg-hubbed-orange text-white transition-colors hover:bg-hubbed-orange-hover`}
          >
            <span className="inline-block translate-x-1">Proceed to Dropoff</span>
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
