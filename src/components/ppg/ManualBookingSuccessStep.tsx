import { Check, Copy, MapPin, Package } from 'lucide-react'
import { useState } from 'react'

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
    <div className="flex h-full min-h-0 flex-col items-center py-1 text-center sm:py-2">
      <div className="relative mb-3 flex size-14 shrink-0 items-center justify-center sm:mb-4 sm:size-16">
        <span className="absolute inset-0 rounded-full bg-green-100" aria-hidden />
        <span className="relative flex size-10 items-center justify-center rounded-full bg-green-600 sm:size-11">
          <Check className="size-6 text-white sm:size-7" strokeWidth={2.5} aria-hidden />
        </span>
      </div>

      <h2 className="text-xl font-bold text-black sm:text-2xl">All Booked!</h2>
      <p className="mt-1 text-sm text-text-muted">Payment received — shipment is booked</p>
      <p className="mt-1 text-sm text-text-muted">
        Digital Receipt has been sent to the Customer
      </p>
      <p className="mt-1.5 text-sm font-bold text-black sm:text-base">
        1 shipment confirmed · {totalLabel}
      </p>

      <article className="mt-4 w-full shrink-0 rounded-xl border border-border-light bg-white text-left sm:mt-5">
        <div className="flex gap-2.5 p-3 sm:gap-3 sm:p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 sm:size-10">
            <Package className="size-5 text-amber-800/80 sm:size-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-1 text-xs font-semibold text-black sm:text-sm">
              <MapPin className="size-3.5 shrink-0 text-red-500 sm:size-4" strokeWidth={2} aria-hidden />
              <span>Kavanaghs Pharmacy</span>
              <span className="font-normal text-text-muted">→</span>
            </p>
            <p className="mt-0.5 flex items-start gap-1 text-xs font-semibold text-black sm:text-sm">
              <MapPin
                className="mt-0.5 size-3.5 shrink-0 text-red-500 sm:size-4"
                strokeWidth={2}
                aria-hidden
              />
              <span>15/37 Nicholson St, Balmain East</span>
            </p>
            <p className="mt-1 text-xs text-text-muted sm:text-sm">Handbag · 1kg</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-black sm:text-base">{totalLabel}</p>
            <p className="text-[10px] text-text-muted sm:text-xs">incl. GST</p>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 border-t border-border-light px-3 py-2.5 text-xs sm:px-4 sm:text-sm">
          <span className="text-text-muted">Booking Ref</span>
          <span className="justify-self-end font-bold text-black">PPG-48213</span>
          <span className="text-text-muted">Tracking</span>
          <div className="flex items-center justify-end gap-1 justify-self-end">
            <span className="font-bold text-black">{BOOKING_TRACKING_NUMBER}</span>
            <button
              type="button"
              onClick={copyTrackingNumber}
              className="rounded-md p-1 text-text-muted transition-colors hover:bg-gray-100 hover:text-black"
              aria-label={trackingCopied ? 'Tracking number copied' : 'Copy tracking number'}
            >
              {trackingCopied ? (
                <Check className="size-3.5 text-green-600 sm:size-4" strokeWidth={2.5} aria-hidden />
              ) : (
                <Copy className="size-3.5 sm:size-4" strokeWidth={2} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </article>

      <button
        type="button"
        onClick={() => void proceedToDropoff()}
        className="mt-4 w-full shrink-0 rounded-md bg-hubbed-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-hubbed-orange-hover sm:mt-5"
      >
        Proceed to Dropoff
      </button>
    </div>
  )
}
