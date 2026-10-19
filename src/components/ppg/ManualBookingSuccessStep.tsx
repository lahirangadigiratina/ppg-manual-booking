import { Check, Copy, MapPin, Package, Printer } from 'lucide-react'
import { useState } from 'react'
import {
  manualFlowStepHelperClassName,
  manualFlowStepTitleClassName,
} from './manualFormShared'

const successFooterButtonClassName =
  'flex w-full min-h-[52px] items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold sm:text-base'

export const BOOKING_TRACKING_NUMBER = 'MP8031920017'

interface ManualBookingSuccessStepProps {
  totalLabel: string
  onNext?: () => void
}

export function ManualBookingSuccessStep({ totalLabel, onNext }: ManualBookingSuccessStepProps) {
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
      <div className="flex min-h-0 flex-1 flex-col items-center overflow-hidden py-0.5 text-center">
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
              <p className="flex flex-wrap items-center gap-1 text-xs font-semibold text-black">
                <MapPin className="size-3 shrink-0 text-red-500" strokeWidth={2} aria-hidden />
                <span>Kavanaghs Pharmacy</span>
                <span className="font-normal text-text-muted">→</span>
              </p>
              <p className="mt-0.5 flex items-start gap-1 text-xs font-semibold text-black">
                <MapPin
                  className="mt-0.5 size-3 shrink-0 text-red-500"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>15/37 Nicholson St, Balmain East</span>
              </p>
              <p className="mt-0.5 text-xs text-text-muted">Handbag · 1kg</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-bold text-black sm:text-sm">{totalLabel}</p>
              <p className="text-[10px] text-text-muted">incl. GST</p>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1 border-t border-border-light px-2.5 py-2 text-xs sm:px-3">
            <span className="text-text-muted">Booking Ref</span>
            <span className="justify-self-end font-bold text-black">PPG-48213</span>
            <span className="text-text-muted">Tracking</span>
            <div className="flex items-center justify-end gap-1 justify-self-end">
              <span className="font-bold text-black">{BOOKING_TRACKING_NUMBER}</span>
              <button
                type="button"
                onClick={copyTrackingNumber}
                className="rounded-md p-0.5 text-text-muted transition-colors hover:bg-gray-100 hover:text-black"
                aria-label={trackingCopied ? 'Tracking number copied' : 'Copy tracking number'}
              >
                {trackingCopied ? (
                  <Check className="size-3.5 text-green-600" strokeWidth={2.5} aria-hidden />
                ) : (
                  <Copy className="size-3.5" strokeWidth={2} aria-hidden />
                )}
              </button>
            </div>
          </div>
        </article>
      </div>

      <div className="shrink-0 bg-white pt-2.5 pb-0.5">
        <div className="flex w-full flex-col gap-2">
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
            Proceed to Dropoff
          </button>
        </div>
      </div>
    </div>
  )
}
