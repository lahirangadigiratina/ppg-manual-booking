import { AlertCircle, ArrowRight } from 'lucide-react'
import {
  formatAustralianMobileDisplay,
  sendBookingLinkSms,
} from './ppgSmsUtils'
import {
  manualPrimaryButtonClassName,
  manualSecondaryButtonClassName,
} from './manualFormShared'

const ppgPortalPanelClassName =
  'mx-auto flex w-full min-h-0 max-w-xl flex-col rounded-sm border border-border-light bg-white p-4 sm:p-6 lg:p-8'

interface PpgOnlineSmsFailedViewProps {
  mobile: string
  errorMessage: string
  sending: boolean
  onMobileChange: (value: string) => void
  onSendingChange: (sending: boolean) => void
  onSuccess: () => void
  onFailure: (message: string) => void
  onManualBooking: () => void
  onBackToHome: () => void
}

export function PpgOnlineSmsFailedView({
  mobile,
  errorMessage,
  sending,
  onMobileChange,
  onSendingChange,
  onSuccess,
  onFailure,
  onManualBooking,
  onBackToHome,
}: PpgOnlineSmsFailedViewProps) {
  const retrySend = async () => {
    onSendingChange(true)
    const result = await sendBookingLinkSms(mobile)
    onSendingChange(false)
    if (result.ok) {
      onSuccess()
      return
    }
    onFailure(result.error ?? 'Unable to send SMS.')
  }

  return (
    <div className={ppgPortalPanelClassName}>
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="size-6 text-red-600" strokeWidth={2} aria-hidden />
      </div>

      <h2 className="text-xl font-bold text-black sm:text-2xl">Message not sent</h2>
      <p className="mt-2 text-sm leading-snug text-text-muted sm:text-base">
        The booking link could not be sent to{' '}
        <span className="font-semibold tabular-nums text-black">
          {formatAustralianMobileDisplay(mobile)}
        </span>
        .
      </p>

      <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-snug text-red-800">
        {errorMessage ||
          'We could not deliver the SMS. Check the number or try again shortly.'}
      </p>

      <div className="mt-6">
        <label htmlFor="sender-mobile-retry" className="mb-2 block text-sm font-medium text-text-muted">
          Sender&apos;s mobile number
        </label>
        <input
          id="sender-mobile-retry"
          type="tel"
          value={mobile}
          onChange={(e) => onMobileChange(e.target.value)}
          placeholder="+61 412 345 678"
          className="w-full rounded-xl border border-border-light bg-white px-4 py-3.5 text-base text-black placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          disabled={sending}
          onClick={retrySend}
          className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 ${manualPrimaryButtonClassName}`}
        >
          {sending ? 'Sending…' : 'Try again'}
          {!sending && <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />}
        </button>
        <button type="button" onClick={onManualBooking} className={manualSecondaryButtonClassName}>
          Continue with manual booking
        </button>
        <button
          type="button"
          onClick={onBackToHome}
          className="py-2 text-sm font-medium text-text-muted transition-colors hover:text-black"
        >
          Back to online booking
        </button>
      </div>
    </div>
  )
}
