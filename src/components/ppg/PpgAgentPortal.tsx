import { ArrowRight, CreditCard, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  deliveryMethodFromPpgPath,
  PPG_HOME_PATH,
  PPG_ONLINE_SMS_FAILED_PATH,
  ppgPathForDeliveryMethod,
} from '../../config/ppgRoutes'
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
import { ManualParcelDetailsStep } from './ManualParcelDetailsStep'
import { ManualReceiverDetailsStep } from './ManualReceiverDetailsStep'
import { ManualSenderDetailsStep } from './ManualSenderDetailsStep'
import { PpgBookingSummaryPanel } from './PpgBookingSummaryPanel'
import { PpgManualFlowStepHeader } from './PpgManualFlowStepHeader'
import { PpgManualStepFooter } from './PpgManualStepFooter'
import { SmsLinkSuccessDialog } from './SmsLinkSuccessDialog'
import {
  ManualFieldLabel,
  manualInputClassName,
  manualPrimaryButtonClassName,
} from './manualFormShared'
import {
  calculateBookingTotal,
  formatBookingAmount,
  isParcelValueProvided,
  CARRY_ON_PARCEL_SIZE_ID,
  isDoorDelivery,
  type DeliveryMethod,
  type ManualBookingDraft,
} from './manualBookingState'
type BookingMode = 'online' | 'manual'
type PortalScreen = 'home' | 'manual'

const ppgPageShellClassName =
  'mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8'

const ppgManualPageShellClassName =
  'mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4'

const ppgWhitePanelClassName =
  'flex w-full min-h-0 flex-col rounded-sm border border-border-light bg-white p-4 sm:p-6 lg:p-8'

const ppgPortalPanelClassName = `${ppgWhitePanelClassName} mx-auto w-full max-w-xl`

const ppgManualFormPanelClassName =
  'flex w-full max-w-xl min-h-0 flex-1 flex-col rounded-sm border border-border-light bg-white p-3 sm:p-4 lg:p-5'

const ppgManualStepScrollClassName =
  'min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-4 pt-4 pe-3 sm:pe-4 [scrollbar-gutter:stable]'

function BookingModeOption({
  selected,
  title,
  description,
  paymentLabel,
  paymentIcon: PaymentIcon,
  onClick,
}: {
  selected: boolean
  title: string
  description: string
  paymentLabel: string
  paymentIcon: typeof CreditCard
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`relative flex min-h-[168px] flex-col rounded-2xl border p-4 text-left transition-colors sm:min-h-[176px] sm:p-5 ${
        selected
          ? 'border-[#2b2f36] bg-[#2b2f36] text-white shadow-sm'
          : 'border-border-light bg-white text-black hover:border-gray-300'
      }`}
    >
      <span
        className={`absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border-2 sm:right-4 sm:top-4 ${
          selected ? 'border-white' : 'border-gray-300'
        }`}
        aria-hidden
      >
        {selected ? <span className="size-2 rounded-full bg-white" /> : null}
      </span>

      <span className="pe-8 text-base font-bold leading-snug sm:text-lg">{title}</span>
      <span
        className={`mt-2 text-sm leading-snug ${
          selected ? 'text-white/85' : 'text-text-muted'
        }`}
      >
        {description}
      </span>

      <div
        className={`mt-auto border-t pt-3 sm:pt-3.5 ${
          selected ? 'border-white/20' : 'border-border-light'
        }`}
      >
        <span
          className={`flex items-center gap-2 text-xs font-medium sm:text-sm ${
            selected ? 'text-white/90' : 'text-text-muted'
          }`}
        >
          <PaymentIcon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          {paymentLabel}
        </span>
      </div>
    </button>
  )
}

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
  const [parcelSizeId, setParcelSizeId] = useState('')
  const [needsPackaging, setNeedsPackaging] = useState<boolean | null>(null)
  const [receiverAddress, setReceiverAddress] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    () => deliveryMethodFromPpgPath(location.pathname) ?? 'atl',
  )
  const [contentType, setContentType] = useState('clothing-fashion')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [dangerousGoodsConfirmed, setDangerousGoodsConfirmed] = useState(false)
  const [paymentReceived, setPaymentReceived] = useState(false)
  const isSmsFailedRoute = location.pathname === PPG_ONLINE_SMS_FAILED_PATH

  useEffect(() => {
    const methodFromPath = deliveryMethodFromPpgPath(location.pathname)
    if (!methodFromPath) {
      return
    }
    setDeliveryMethod(methodFromPath)
    setBookingMode('manual')
    setScreen('manual')
    setManualStep(1)
  }, [location.pathname])

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
    if (isDoorDelivery(deliveryMethod)) {
      navigate(ppgPathForDeliveryMethod(deliveryMethod), { replace: true })
    }
  }

  if (screen === 'manual') {
    const showBookingSummary = manualStep >= 1 && manualStep <= 5

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
      <div
        className={`${ppgManualPageShellClassName} flex h-full min-h-0 flex-1 flex-col overflow-hidden`}
      >
        <div
          className={`mx-auto flex w-full min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:items-stretch lg:justify-center lg:gap-5 ${
            showBookingSummary ? 'max-w-[920px]' : 'max-w-xl'
          }`}
        >
          <div className={`${ppgManualFormPanelClassName} min-w-0`}>
            <div
              className={`flex w-full flex-col ${
                manualStep === 6 ? '' : 'h-full min-h-0 flex-1'
              }`}
            >
              <PpgManualFlowStepHeader manualStep={manualStep} />
              <div
                className={
                  manualStep === 6
                    ? 'flex min-h-0 flex-1 flex-col overflow-hidden pb-0 pt-1'
                    : ppgManualStepScrollClassName
                }
              >
                {manualStep === 1 && (
                  <ManualParcelDetailsStep
                    selectedSizeId={parcelSizeId}
                    onSelectedSizeIdChange={setParcelSizeId}
                    needsPackaging={needsPackaging}
                    onNeedsPackagingChange={setNeedsPackaging}
                    receiverAddress={receiverAddress}
                    onReceiverAddressChange={setReceiverAddress}
                    deliveryMethod={deliveryMethod}
                  />
                )}
                {manualStep === 2 && <ManualSenderDetailsStep />}
                {manualStep === 3 && <ManualReceiverDetailsStep />}
                {manualStep === 4 && (
                  <div className="flex flex-col gap-8">
                    <ManualContentsStep
                      parcelValue={parcelValue}
                      onParcelValueChange={setParcelValue}
                      contentType={contentType}
                      onContentTypeChange={setContentType}
                    />
                    <ManualOfferAddonsStep
                      parcelValue={parcelValue}
                      selectedAddons={selectedAddons}
                      onSelectedAddonsChange={setSelectedAddons}
                      dangerousGoodsConfirmed={dangerousGoodsConfirmed}
                      onDangerousGoodsConfirmedChange={setDangerousGoodsConfirmed}
                    />
                  </div>
                )}
                {manualStep === 5 && (
                  <ManualPriceBreakdownStep
                    draft={bookingDraft}
                    paymentReceived={paymentReceived}
                    onPaymentReceivedChange={setPaymentReceived}
                  />
                )}
                {manualStep === 6 && (
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
                  (manualStep === 1 &&
                    (!parcelSizeId ||
                      (parcelSizeId !== CARRY_ON_PARCEL_SIZE_ID &&
                        needsPackaging === null))) ||
                  (manualStep === 4 &&
                    (!isParcelValueProvided(parcelValue) || !dangerousGoodsConfirmed)) ||
                  (manualStep === 5 && !paymentReceived)
                }
                onBack={() => {
                  if (manualStep === 1) {
                    setBookingMode('online')
                    setScreen('home')
                    navigate(PPG_HOME_PATH, { replace: true })
                    return
                  }
                  if (manualStep === 6) {
                    setManualStep(5)
                    return
                  }
                  if (manualStep === 5) {
                    setPaymentReceived(false)
                  }
                  setManualStep(manualStep - 1)
                }}
                onNext={() => {
                  if (manualStep === 5) {
                    setManualStep(6)
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
          <h2 className="mb-2 text-xl font-bold text-black sm:text-2xl">
            How is the customer booking?
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-text-muted sm:mb-6 sm:text-base">
            Select how the booking will be made. Online payment is via payment gateway while
            Manual can be collected through EFTPOS or Cash.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <BookingModeOption
              selected={bookingMode === 'online'}
              title="Online Booking"
              description="Customer books online using their phone"
              paymentLabel="Online payment only"
              paymentIcon={CreditCard}
              onClick={() => setBookingMode('online')}
            />
            <BookingModeOption
              selected={bookingMode === 'manual'}
              title="Manual Booking"
              description="You book on the customer's behalf as the agent"
              paymentLabel="Payment in store"
              paymentIcon={Store}
              onClick={() => {
                setBookingMode('manual')
                startManualFlow()
              }}
            />
          </div>

          {bookingMode === 'online' && (
            <section className="flex flex-col gap-4 pt-1">
              <div>
                <ManualFieldLabel htmlFor="sender-mobile">
                  Sender&apos;s mobile number
                </ManualFieldLabel>
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
                  className={manualInputClassName}
                />
              </div>

              <div className="flex w-full justify-end">
                <button
                  type="button"
                  disabled={smsSending}
                  onClick={handleSendSms}
                  className={`inline-flex min-w-[9.5rem] items-center justify-center gap-2 disabled:opacity-60 ${manualPrimaryButtonClassName}`}
                >
                  {smsSending ? 'Sending…' : 'Send SMS'}
                  {!smsSending && (
                    <ArrowRight className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  )}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
