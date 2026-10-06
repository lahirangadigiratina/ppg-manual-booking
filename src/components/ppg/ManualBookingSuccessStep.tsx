import { Check, Copy, MapPin, Package } from 'lucide-react'
import { useState } from 'react'

const TOTAL = '$18.76'
export const BOOKING_TRACKING_NUMBER = 'MP8031920017'

interface ManualBookingSuccessStepProps {
  onNext?: () => void
}

export function ManualBookingSuccessStep({ onNext }: ManualBookingSuccessStepProps) {
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

  return (
    <div className="flex flex-col items-center py-4 text-center sm:py-6">
      <div className="relative mb-6 flex size-20 items-center justify-center sm:size-24">
        <span
          className="absolute inset-0 rounded-full bg-green-100"
          aria-hidden
        />
        <span className="relative flex size-14 items-center justify-center rounded-full bg-green-600 sm:size-16">
          <Check className="size-8 text-white sm:size-9" strokeWidth={2.5} aria-hidden />
        </span>
      </div>

      <h2 className="text-2xl font-bold text-black sm:text-3xl">All Booked!</h2>
      <p className="mt-2 text-sm text-text-muted sm:text-base">
        Payment received — shipment is booked
      </p>
      <p className="mt-3 text-base font-bold text-black sm:text-lg">
        1 shipment confirmed · {TOTAL}
      </p>

      <article className="mt-8 w-full rounded-xl border border-border-light bg-white text-left">
        <div className="flex gap-3 p-4 sm:p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <Package className="size-6 text-amber-800/80" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-1 text-sm font-semibold text-black sm:text-base">
              <MapPin className="size-4 shrink-0 text-red-500" strokeWidth={2} aria-hidden />
              <span>Kavanaghs Pharmacy</span>
              <span className="font-normal text-text-muted">→</span>
            </p>
            <p className="mt-1 flex items-start gap-1 text-sm font-semibold text-black sm:text-base">
              <MapPin className="mt-0.5 size-4 shrink-0 text-red-500" strokeWidth={2} aria-hidden />
              <span>15/37 Nicholson St, Balmain East</span>
            </p>
            <p className="mt-2 text-sm text-text-muted">Handbag · 1kg</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-base font-bold text-black sm:text-lg">{TOTAL}</p>
            <p className="text-xs text-text-muted">incl. GST</p>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 border-t border-border-light px-4 py-3 text-sm sm:px-5">
          <span className="text-text-muted">Booking Ref</span>
          <span className="justify-self-end font-bold text-black">PPG-48213</span>
          <span className="text-text-muted">Tracking</span>
          <div className="flex items-center justify-end gap-1 justify-self-end">
            <span className="font-bold text-black">{BOOKING_TRACKING_NUMBER}</span>
            <button
              type="button"
              onClick={copyTrackingNumber}
              className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-gray-100 hover:text-black"
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

      <button
        type="button"
        onClick={onNext}
        className="mt-8 w-full rounded-md bg-black px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900 sm:text-base"
      >
        Back to Returns
      </button>
    </div>
  )
}
