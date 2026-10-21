import { ArrowRight, CircleHelp, CreditCard, Store } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  deliveryMethodFromPpgPath,
  PPG_HOME_PATH,
  PPG_ONLINE_SMS_FAILED_PATH,
  ppgPathForDeliveryMethod,
} from '../../config/ppgRoutes'
import { hasPayToAgreements } from '../../payto/paytoAgreementStorage'
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
  IN_STORE_BOOKING_TITLE,
  ManualFieldLabel,
  manualFlowStepHelperClassName,
  manualFlowStepTitleClassName,
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

const ppgManualFormPanelClassName =
  'flex w-full max-w-xl min-h-0 flex-1 flex-col rounded-sm border border-border-light bg-white p-3 sm:p-4 lg:p-5'

const ppgPortalPanelClassName =
  'mx-auto flex w-full max-w-xl shrink-0 flex-col rounded-sm border border-border-light bg-white p-3 sm:p-4 lg:p-5'

const ppgManualStepScrollClassName =
  'min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-4 pt-4 pe-3 sm:pe-4 [scrollbar-gutter:stable]'

function BookingModeOption({
  selected,
  title,
  description,
  paymentLabel,
  paymentIcon: PaymentIcon,
  onClick,
  disabled = false,
  tooltip,
}: {
  selected: boolean
  title: string
  description: string
  paymentLabel: string
  paymentIcon: typeof CreditCard
  onClick: () => void
  disabled?: boolean
  tooltip?: string
}) {
  const tooltipId = useId()
  const cardClassName = `relative flex w-full flex-col rounded-lg border p-3 text-left transition-colors sm:p-3.5 ${
    disabled
      ? 'cursor-not-allowed border-border-light bg-gray-50 text-gray-400'
      : selected
        ? 'border-[#2b2f36] bg-[#2b2f36] text-white shadow-sm'
        : 'border-border-light bg-white text-black hover:border-gray-300'
  }`

  const body = (
    <>
      <span
        className={`absolute right-2.5 top-2.5 flex size-4 items-center justify-center rounded-full border-2 sm:right-3 sm:top-3 ${
          disabled ? 'border-gray-300' : selected ? 'border-white' : 'border-gray-300'
        }`}
        aria-hidden
      >
        {selected && !disabled ? <span className="size-2 rounded-full bg-white" /> : null}
      </span>

      <span className="flex items-center gap-1.5 pe-7">
        <span
          className={`text-sm font-bold leading-snug sm:text-base ${
            disabled ? 'text-gray-400' : ''
          }`}
        >
          {title}
        </span>
        {tooltip ? (
          <span className="group/tip relative z-10 inline-flex">
            <button
              type="button"
              aria-label="Why in store booking is unavailable"
              aria-describedby={tooltipId}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex rounded-full text-gray-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            >
              <CircleHelp className="size-4" strokeWidth={2} aria-hidden />
            </button>
            <span
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2 w-72 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-xs font-medium leading-snug text-white opacity-0 shadow-lg transition-opacity group-hover/tip:visible group-hover/tip:opacity-100 group-focus-within/tip:visible group-focus-within/tip:opacity-100"
            >
              {tooltip}
              <span
                className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-gray-900"
                aria-hidden
              />
            </span>
          </span>
        ) : null}
      </span>
      <span
        className={`mt-1.5 text-xs leading-snug sm:text-sm ${
          disabled ? 'text-gray-400' : selected ? 'text-white/85' : 'text-text-muted'
        }`}
      >
        {description}
      </span>

      <div
        className={`mt-2 border-t pt-2 sm:mt-2.5 sm:pt-2 ${
          disabled
            ? 'border-border-light'
            : selected
              ? 'border-white/20'
              : 'border-border-light'
        }`}
      >
        <span
          className={`flex items-center gap-1.5 text-[11px] font-medium sm:text-xs ${
            disabled ? 'text-gray-400' : selected ? 'text-white/90' : 'text-text-muted'
          }`}
        >
          <PaymentIcon className="size-3.5 shrink-0 sm:size-4" strokeWidth={1.75} aria-hidden />
          {paymentLabel}
        </span>
      </div>
    </>
  )

  if (tooltip) {
    return <div className={cardClassName}>{body}</div>
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cardClassName}
    >
      {body}
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
  const [deliverySelected, setDeliverySelected] = useState(false)
  const [contentType, setContentType] = useState('clothing-fashion')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [dangerousGoodsConfirmed, setDangerousGoodsConfirmed] = useState(false)
  const [paymentReceived, setPaymentReceived] = useState(false)
  const isSmsFailedRoute = location.pathname === PPG_ONLINE_SMS_FAILED_PATH
  const inStoreBookingEnabled = hasPayToAgreements()

  useEffect(() => {
    const methodFromPath = deliveryMethodFromPpgPath(location.pathname)
    if (!methodFromPath) {
      return
    }
    if (!hasPayToAgreements()) {
      setBookingMode('online')
      setScreen('home')
      navigate(PPG_HOME_PATH, { replace: true })
      return
    }
    setDeliveryMethod(methodFromPath)
    setDeliverySelected(false)
    setBookingMode('manual')
    setScreen('manual')
    setManualStep(1)
  }, [location.pathname, navigate])

  useEffect(() => {
    if (screen === 'manual' && !hasPayToAgreements()) {
      setBookingMode('online')
      setScreen('home')
      navigate(PPG_HOME_PATH, { replace: true })
    }
  }, [screen, navigate])

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
    if (!hasPayToAgreements()) {
      return
    }
    setManualStep(1)
    setDeliverySelected(false)
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
      deliverySelected,
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
            <div className="flex h-full min-h-0 flex-1 w-full flex-col">
              <PpgManualFlowStepHeader manualStep={manualStep} />
              <div
                className={
                  manualStep === 6
                    ? 'flex min-h-0 flex-1 flex-col overflow-hidden pb-0 pt-0'
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
                    deliverySelected={deliverySelected}
                    onDeliverySelectedChange={setDeliverySelected}
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
                    draft={bookingDraft}
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
                      !deliverySelected ||
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
            manualBookingDisabled={!inStoreBookingEnabled}
            onManualBooking={() => {
              if (!inStoreBookingEnabled) {
                return
              }
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
      <div className={`${ppgManualPageShellClassName} items-start overflow-y-auto`}>
        <div className={ppgPortalPanelClassName}>
          <h2 className={manualFlowStepTitleClassName}>How is the customer booking?</h2>
          <p className={`${manualFlowStepHelperClassName} mb-3 line-clamp-none sm:mb-4`}>
            Select how the booking will be made. Online payment is via payment gateway while In
            store payment can be collected through cash.
          </p>

          <div
            className={`grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 ${bookingMode === 'online' ? 'mb-3 sm:mb-4' : 'mb-0'}`}
          >
            <BookingModeOption
              selected={bookingMode === 'online'}
              title="Online Booking"
              description="Customer books online using their phone"
              paymentLabel="Online payment only"
              paymentIcon={CreditCard}
              onClick={() => setBookingMode('online')}
            />
            <BookingModeOption
              selected={bookingMode === 'manual' && inStoreBookingEnabled}
              title={IN_STORE_BOOKING_TITLE}
              description={
                inStoreBookingEnabled
                  ? "You book on the customer's behalf as the agent"
                  : 'Requires an active PayTo agreement before booking in store'
              }
              paymentLabel="Payment in store"
              paymentIcon={Store}
              disabled={!inStoreBookingEnabled}
              tooltip={
                inStoreBookingEnabled
                  ? undefined
                  : 'In-store booking is unavailable until a PayTo agreement is set up for this store. You can create it in the profile. You can still proceed with online booking.'
              }
              onClick={() => {
                setBookingMode('manual')
                startManualFlow()
              }}
            />
          </div>

          {bookingMode === 'online' && (
            <section className="flex flex-col gap-3 pt-0 sm:gap-3.5">
              <div>
                <ManualFieldLabel htmlFor="sender-mobile">
                  Sender&apos;s Mobile Number
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
