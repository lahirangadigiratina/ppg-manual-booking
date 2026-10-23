import { ArrowRight, X } from 'lucide-react'
import { useEffect } from 'react'
import {
  ManualFieldLabel,
  manualInputClassName,
  manualPrimaryButtonClassName,
  manualSecondaryButtonClassName,
} from './manualFormShared'
import {
  applyAustralianMobileFieldChange,
  focusAustralianMobileField,
} from './ppgSmsUtils'

interface OnlineBookingSmsDialogProps {
  open: boolean
  mobile: string
  sending: boolean
  onMobileChange: (value: string) => void
  onClose: () => void
  onSend: () => void
}

export function OnlineBookingSmsDialog({
  open,
  mobile,
  sending,
  onMobileChange,
  onClose,
  onSend,
}: OnlineBookingSmsDialogProps) {
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

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <button
        type="button"
        aria-label="Close online booking"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="online-booking-sms-title"
        className="relative w-full max-w-md rounded-lg border border-border-light bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="relative mb-4 pr-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-0 top-0 flex size-8 items-center justify-center rounded-md text-black hover:bg-gray-100"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
          <h2
            id="online-booking-sms-title"
            className="text-base font-bold leading-tight text-black sm:text-lg"
          >
            Online Booking
          </h2>
          <p className="mt-0.5 text-sm leading-snug text-text-muted">
            Enter the sender&apos;s mobile number to send the booking link by SMS.
          </p>
        </div>
        <div>
          <ManualFieldLabel htmlFor="sender-mobile-dialog">
            Sender&apos;s Mobile Number
          </ManualFieldLabel>
          <input
            id="sender-mobile-dialog"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={mobile}
            onFocus={() => onMobileChange(focusAustralianMobileField(mobile))}
            onChange={(event) =>
              onMobileChange(applyAustralianMobileFieldChange(mobile, event.target.value))
            }
            placeholder="+61 412 345 678"
            className={manualInputClassName}
          />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className={manualSecondaryButtonClassName}>
            Cancel
          </button>
          <button
            type="button"
            disabled={sending}
            onClick={onSend}
            className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 ${manualPrimaryButtonClassName}`}
          >
            {sending ? 'Sending…' : 'Send SMS'}
            {!sending && <ArrowRight className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  )
}
