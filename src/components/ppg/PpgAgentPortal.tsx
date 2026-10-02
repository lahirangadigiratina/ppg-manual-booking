import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { ManualContentsStep } from './ManualContentsStep'
import { ManualOfferAddonsStep } from './ManualOfferAddonsStep'
import { ManualAwaitingPaymentStep } from './ManualAwaitingPaymentStep'
import { ManualBookingSuccessStep } from './ManualBookingSuccessStep'
import { ManualPriceBreakdownStep } from './ManualPriceBreakdownStep'
import { ManualDeliveryAddressStep } from './ManualDeliveryAddressStep'
import { ManualParcelDetailsStep } from './ManualParcelDetailsStep'
import { ManualReceiverDetailsStep } from './ManualReceiverDetailsStep'
import { ManualSenderDetailsStep } from './ManualSenderDetailsStep'
import { PpgManualStepFooter } from './PpgManualStepFooter'
import { PpgManualStickyToolbar } from './PpgManualStickyToolbar'
import { SmsLinkSuccessDialog } from './SmsLinkSuccessDialog'
import { PpgPortalHeader } from './PpgPortalHeader'

type BookingMode = 'online' | 'manual'
type PortalScreen = 'home' | 'manual'

const MANUAL_STEP_COUNT = 6

export function PpgAgentPortal() {
  const [screen, setScreen] = useState<PortalScreen>('home')
  const [manualStep, setManualStep] = useState(1)
  const [bookingMode, setBookingMode] = useState<BookingMode>('online')
  const [mobile, setMobile] = useState('')
  const [smsLinkSentOpen, setSmsLinkSentOpen] = useState(false)

  const startManualFlow = () => {
    setManualStep(1)
    setScreen('manual')
  }

  if (screen === 'manual') {
    return (
      <div className="mx-auto flex h-full min-h-0 w-full max-w-xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        {manualStep !== 9 && (
          <PpgManualStickyToolbar
            manualStep={manualStep}
            manualStepCount={MANUAL_STEP_COUNT}
          />
        )}
        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          {manualStep === 1 && <ManualParcelDetailsStep />}
          {manualStep === 2 && <ManualSenderDetailsStep />}
          {manualStep === 3 && <ManualReceiverDetailsStep />}
          {manualStep === 4 && <ManualDeliveryAddressStep />}
          {manualStep === 5 && <ManualContentsStep />}
          {manualStep === 6 && <ManualOfferAddonsStep />}
          {manualStep === 7 && (
            <ManualPriceBreakdownStep onCharge={() => setManualStep(8)} />
          )}
          {manualStep === 8 && (
            <ManualAwaitingPaymentStep onComplete={() => setManualStep(9)} />
          )}
          {manualStep === 9 && (
            <ManualBookingSuccessStep
              onBackToHome={() => {
                setManualStep(1)
                setBookingMode('online')
                setScreen('home')
              }}
            />
          )}
        </div>
        <PpgManualStepFooter
          manualStep={manualStep}
          onBack={() => {
            if (manualStep === 1) {
              setBookingMode('online')
              setScreen('home')
              return
            }
            setManualStep(manualStep - 1)
          }}
          onNext={() => setManualStep(manualStep + 1)}
        />
      </div>
    )
  }

  return (
    <>
      <SmsLinkSuccessDialog
        open={smsLinkSentOpen}
        mobileNumber={mobile}
        onClose={() => setSmsLinkSentOpen(false)}
      />
      <div className="mx-auto h-full min-h-0 w-full max-w-xl overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <PpgPortalHeader badge="Kavanaghs Pharmacy" />

      <h2 className="mb-4 text-xl font-bold text-black sm:text-2xl">
        How is the customer booking?
      </h2>

      <div className="mb-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setBookingMode('online')}
          className={`rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors sm:py-4 sm:text-base ${
            bookingMode === 'online'
              ? 'bg-[#2b2f36] text-white'
              : 'border border-border-light bg-white text-text-muted hover:border-gray-300'
          }`}
        >
          Online Booking
        </button>
        <button
          type="button"
          onClick={() => {
            setBookingMode('manual')
            startManualFlow()
          }}
          className={`rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors sm:py-4 sm:text-base ${
            bookingMode === 'manual'
              ? 'bg-[#2b2f36] text-white'
              : 'border border-border-light bg-white text-text-muted hover:border-gray-300'
          }`}
        >
          Manual Booking
        </button>
      </div>

      {bookingMode === 'online' && (
        <>
          <div className="mb-6">
            <label
              htmlFor="sender-mobile"
              className="mb-2 block text-sm font-medium text-text-muted"
            >
              Sender&apos;s mobile number
            </label>
            <input
              id="sender-mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="0412 345 678"
              className="w-full rounded-xl border border-border-light bg-white px-4 py-3.5 text-base text-black placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <p className="mb-6 rounded-xl bg-[#eef2ff] px-4 py-4 text-center text-sm font-medium leading-snug text-[#3730a3] sm:text-base">
            Sends a link to the booking form — no OTP required.
          </p>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSmsLinkSentOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900 sm:py-3.5 sm:text-base"
            >
              Send SMS
              <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        </>
      )}
    </div>
    </>
  )
}
