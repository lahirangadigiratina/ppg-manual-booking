import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PPG_HOME_PATH, PPG_ONLINE_SMS_FAILED_PATH } from '../../config/ppgRoutes'
import { PpgOnlineSmsFailedView } from './PpgOnlineSmsFailedView'
import {
  applyAustralianMobileFieldChange,
  focusAustralianMobileField,
  sendBookingLinkSms,
} from './ppgSmsUtils'
import { ManualContentsStep } from './ManualContentsStep'
import { ManualOfferAddonsStep } from './ManualOfferAddonsStep'
import { ManualBookingSuccessStep } from './ManualBookingSuccessStep'
import { ManualPriceBreakdownStep } from './ManualPriceBreakdownStep'
import { ManualDeliveryAddressStep } from './ManualDeliveryAddressStep'
import { ManualParcelDetailsStep } from './ManualParcelDetailsStep'
import { ManualReceiverDetailsStep } from './ManualReceiverDetailsStep'
import { ManualSenderDetailsStep } from './ManualSenderDetailsStep'
import { PpgBookingSummaryPanel } from './PpgBookingSummaryPanel'
import { PpgManualFlowStepHeader } from './PpgManualFlowStepHeader'
import { PpgManualStepFooter } from './PpgManualStepFooter'
import { SmsLinkSuccessDialog } from './SmsLinkSuccessDialog'
import {
  manualPrimaryButtonClassName,
  manualSegmentButtonClassName,
} from './manualFormShared'
import {
  calculateBookingTotal,
  formatBookingAmount,
  isParcelValueProvided,
  type DeliveryMethod,
  type ManualBookingDraft,
} from './manualBookingState'
type BookingMode = 'online' | 'manual'
type PortalScreen = 'home' | 'manual'

const ppgPageShellClassName =
  'mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8'

const ppgWhitePanelClassName =
  'flex w-full min-h-0 flex-col rounded-sm border border-border-light bg-white p-4 sm:p-6 lg:p-8'

const ppgPortalPanelClassName = `${ppgWhitePanelClassName} mx-auto w-full max-w-xl`

const ppgManualFormPanelClassName = `${ppgWhitePanelClassName} w-full max-w-xl lg:flex-none`

export function PpgAgentPortal() {
  const navigate = useNavigate()
  const location = useLocation()
  const [screen, setScreen] = useState<PortalScreen>('home')
  const [manualStep, setManualStep] = useState(1)
  const [bookingMode, setBookingMode] = useState<BookingMode>('online')
  const [mobile, setMobile] = useState('')
  const [smsLinkSentOpen, setSmsLinkSentOpen] = useState(false)
  const [smsSending, setSmsSending] = useState(false)
  const [smsErrorMessage, setSmsErrorMessage] = useState('')
  const [parcelValue, setParcelValue] = useState('')
  const [parcelSizeId, setParcelSizeId] = useState('shoebox')
  const [needsPackaging, setNeedsPackaging] = useState(true)
  const [receiverAddress, setReceiverAddress] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('door')
  const [contentType, setContentType] = useState('clothing-fashion')
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['signature'])
  const [dangerousGoodsConfirmed, setDangerousGoodsConfirmed] = useState(false)

  const isSmsFailedRoute = location.pathname === PPG_ONLINE_SMS_FAILED_PATH

  const handleSendSms = async () => {
    setSmsSending(true)
    const result = await sendBookingLinkSms(mobile)
    setSmsSending(false)
    if (result.ok) {
      setSmsLinkSentOpen(true)
      return
    }
    setSmsErrorMessage(result.error ?? 'Unable to send SMS.')
    navigate(PPG_ONLINE_SMS_FAILED_PATH)
  }

  const startManualFlow = () => {
    setManualStep(1)
    setScreen('manual')
  }

  if (screen === 'manual') {
    const showBookingSummary = manualStep >= 1 && manualStep <= 7

    const bookingDraft: ManualBookingDraft = {
      manualStep,
      parcelSizeId,
      needsPackaging,
      receiverAddress,
      deliveryMethod,
      parcelpointStoreId: null,
      contentType,
      parcelValue,
      selectedAddons,
    }

    return (
      <div className={`${ppgPageShellClassName} overflow-y-auto`}>
        <div
          className={`mx-auto flex w-full min-h-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch lg:justify-center lg:gap-6 ${
            showBookingSummary ? 'max-w-[920px]' : 'max-w-xl'
          }`}
        >
          <div className={`${ppgManualFormPanelClassName} min-h-0 min-w-0`}>
            <div className="flex h-full min-h-0 w-full flex-col">
              <PpgManualFlowStepHeader manualStep={manualStep} />
              <div className="min-h-0 flex-1 overflow-y-auto pb-4 pt-4">
                {manualStep === 1 && (
                  <ManualParcelDetailsStep
                    selectedSizeId={parcelSizeId}
                    onSelectedSizeIdChange={setParcelSizeId}
                    needsPackaging={needsPackaging}
                    onNeedsPackagingChange={setNeedsPackaging}
                  />
                )}
                {manualStep === 2 && <ManualSenderDetailsStep />}
                {manualStep === 3 && <ManualReceiverDetailsStep />}
                {manualStep === 4 && (
                  <ManualDeliveryAddressStep
                    address={receiverAddress}
                    onAddressChange={setReceiverAddress}
                    deliveryMethod={deliveryMethod}
                    onDeliveryMethodChange={setDeliveryMethod}
                  />
                )}
                {manualStep === 5 && (
                  <ManualContentsStep
                    parcelValue={parcelValue}
                    onParcelValueChange={setParcelValue}
                    contentType={contentType}
                    onContentTypeChange={setContentType}
                  />
                )}
                {manualStep === 6 && (
                  <ManualOfferAddonsStep
                    parcelValue={parcelValue}
                    selectedAddons={selectedAddons}
                    onSelectedAddonsChange={setSelectedAddons}
                    dangerousGoodsConfirmed={dangerousGoodsConfirmed}
                    onDangerousGoodsConfirmedChange={setDangerousGoodsConfirmed}
                  />
                )}
                {manualStep === 7 && <ManualPriceBreakdownStep draft={bookingDraft} />}
                {manualStep === 8 && (
                  <ManualBookingSuccessStep
                    totalLabel={formatBookingAmount(
                      calculateBookingTotal(bookingDraft) ?? 0,
                    )}
                    onNext={() => {
                      setManualStep(1)
                      setBookingMode('online')
                      setScreen('home')
                      navigate('/returns')
                    }}
                  />
                )}
              </div>
              <PpgManualStepFooter
                manualStep={manualStep}
                nextDisabled={
                  (manualStep === 5 && !isParcelValueProvided(parcelValue)) ||
                  (manualStep === 6 && !dangerousGoodsConfirmed)
                }
                onBack={() => {
                  if (manualStep === 1) {
                    setBookingMode('online')
                    setScreen('home')
                    return
                  }
                  if (manualStep === 8) {
                    setManualStep(7)
                    return
                  }
                  setManualStep(manualStep - 1)
                }}
                onNext={() => {
                  if (manualStep === 7) {
                    setManualStep(8)
                    return
                  }
                  setManualStep(manualStep + 1)
                }}
              />
            </div>
          </div>

          {showBookingSummary && (
            <div className="flex min-h-0 w-full min-w-0 flex-col lg:w-[300px] lg:max-w-[300px] lg:flex-none">
              <PpgBookingSummaryPanel draft={bookingDraft} className="h-full min-h-0 flex-1" />
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isSmsFailedRoute) {
    return (
      <>
        <SmsLinkSuccessDialog
          open={smsLinkSentOpen}
          mobileNumber={mobile}
          onClose={() => {
            setSmsLinkSentOpen(false)
            navigate(PPG_HOME_PATH)
          }}
        />
        <div className={`${ppgPageShellClassName} overflow-y-auto`}>
          <PpgOnlineSmsFailedView
            mobile={mobile}
            errorMessage={smsErrorMessage}
            sending={smsSending}
            onMobileChange={setMobile}
            onSendingChange={setSmsSending}
            onSuccess={() => {
              setSmsLinkSentOpen(true)
              navigate(PPG_HOME_PATH)
            }}
            onFailure={setSmsErrorMessage}
            onManualBooking={() => {
              setBookingMode('manual')
              navigate(PPG_HOME_PATH)
              startManualFlow()
            }}
          />
        </div>
      </>
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
                  inputMode="tel"
                  autoComplete="tel"
                  value={mobile}
                  onFocus={() => setMobile((current) => focusAustralianMobileField(current))}
                  onChange={(e) =>
                    setMobile((previous) =>
                      applyAustralianMobileFieldChange(previous, e.target.value),
                    )
                  }
                  placeholder="+61 412 345 678"
                  className="w-full rounded-xl border border-border-light bg-white px-4 py-3.5 text-base text-black placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  disabled={smsSending}
                  onClick={handleSendSms}
                  className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 ${manualPrimaryButtonClassName}`}
                >
                  {smsSending ? 'Sending…' : 'Send SMS'}
                  {!smsSending && (
                    <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
