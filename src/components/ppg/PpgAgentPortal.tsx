import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { ManualContentsStep } from './ManualContentsStep'
import { ManualOfferAddonsStep } from './ManualOfferAddonsStep'
import { ManualAwaitingPaymentStep } from './ManualAwaitingPaymentStep'
import { ManualBookingSuccessStep } from './ManualBookingSuccessStep'
import { ManualConfirmDropoffStep } from './ManualConfirmDropoffStep'
import { BOOKING_TRACKING_NUMBER } from './ManualBookingSuccessStep'
import { ManualPriceBreakdownStep } from './ManualPriceBreakdownStep'
import { ManualDeliveryAddressStep } from './ManualDeliveryAddressStep'
import { ManualParcelDetailsStep } from './ManualParcelDetailsStep'
import { ManualReceiverDetailsStep } from './ManualReceiverDetailsStep'
import { ManualSenderDetailsStep } from './ManualSenderDetailsStep'
import { PpgManualFlowStepHeader } from './PpgManualFlowStepHeader'
import { PpgManualStepFooter } from './PpgManualStepFooter'
import { SmsLinkSuccessDialog } from './SmsLinkSuccessDialog'
import {
  manualPrimaryButtonClassName,
  manualSegmentButtonClassName,
} from './manualFormShared'
type BookingMode = 'online' | 'manual'
type PortalScreen = 'home' | 'manual'

const ppgPageShellClassName =
  'mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8'

const ppgWhitePanelClassName =
  'flex w-full min-h-0 flex-col rounded-sm border border-border-light bg-white p-4 sm:p-6 lg:p-8'

const ppgPortalPanelClassName = `${ppgWhitePanelClassName} mx-auto w-full max-w-xl`

export function PpgAgentPortal() {
  const [screen, setScreen] = useState<PortalScreen>('home')
  const [manualStep, setManualStep] = useState(1)
  const [bookingMode, setBookingMode] = useState<BookingMode>('online')
  const [mobile, setMobile] = useState('')
  const [smsLinkSentOpen, setSmsLinkSentOpen] = useState(false)
  const [parcelValue, setParcelValue] = useState('')

  const startManualFlow = () => {
    setManualStep(1)
    setScreen('manual')
  }

  if (screen === 'manual') {
    return (
      <div className={`${ppgPageShellClassName} overflow-y-auto`}>
        <div className={`${ppgPortalPanelClassName} min-h-0 flex-1`}>
          <div className="flex h-full min-h-0 w-full flex-col">
            <PpgManualFlowStepHeader manualStep={manualStep} />
            <div
              className={
                manualStep === 1
                  ? 'flex min-h-0 flex-1 flex-col overflow-hidden pb-4 pt-4'
                  : 'min-h-0 flex-1 overflow-y-auto pb-4 pt-4'
              }
            >
              {manualStep === 1 && <ManualParcelDetailsStep />}
              {manualStep === 2 && <ManualSenderDetailsStep />}
              {manualStep === 3 && <ManualReceiverDetailsStep />}
              {manualStep === 4 && <ManualDeliveryAddressStep />}
              {manualStep === 5 && (
                <ManualContentsStep
                  parcelValue={parcelValue}
                  onParcelValueChange={setParcelValue}
                />
              )}
              {manualStep === 6 && <ManualOfferAddonsStep parcelValue={parcelValue} />}
              {manualStep === 7 && <ManualPriceBreakdownStep />}
              {manualStep === 8 && (
                <ManualAwaitingPaymentStep onComplete={() => setManualStep(9)} />
              )}
              {manualStep === 9 && (
                <ManualBookingSuccessStep onNext={() => setManualStep(10)} />
              )}
              {manualStep === 10 && (
                <ManualConfirmDropoffStep
                  consignmentId={BOOKING_TRACKING_NUMBER}
                  onConfirm={() => {
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
        </div>
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
      <div className={`${ppgPageShellClassName} overflow-y-auto`}>
        <div className={ppgPortalPanelClassName}>
          <h2 className="mb-4 text-xl font-bold text-black sm:text-2xl">
            How is the customer booking?
          </h2>

          <div className="mb-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setBookingMode('online')}
              className={manualSegmentButtonClassName(bookingMode === 'online')}
            >
              Online Booking
            </button>
            <button
              type="button"
              onClick={() => {
                setBookingMode('manual')
                startManualFlow()
              }}
              className={manualSegmentButtonClassName(bookingMode === 'manual')}
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
                  placeholder="+61 412 345 678"
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
                  className={`inline-flex items-center justify-center gap-2 ${manualPrimaryButtonClassName}`}
                >
                  Send SMS
                  <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
