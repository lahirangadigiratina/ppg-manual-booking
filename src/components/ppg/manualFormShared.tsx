import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

export const manualInputClassName =
  'w-full rounded-lg border border-border-light bg-white px-3.5 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:px-4 sm:py-3 sm:text-base'

/** Shared control height/typography for actions, nav, and segment choices */
const manualButtonSizeClassName =
  'py-2 text-sm font-semibold sm:py-2.5 sm:text-base'

export const manualPrimaryButtonClassName = `rounded-md bg-black px-6 text-white transition-colors hover:bg-gray-900 ${manualButtonSizeClassName}`

export const manualSecondaryButtonClassName = `rounded-md border border-border-light bg-white px-6 text-black transition-colors hover:bg-gray-50 ${manualButtonSizeClassName}`

/** User-facing label for agent-led (in-store) booking — not the code “manual” mode id */
export const IN_STORE_BOOKING_TITLE = 'In Store Booking'

export const IN_STORE_BOOKING_INTRO_SUFFIX =
  'In store payment can be collected through cash.'

export const CONTINUE_IN_STORE_BOOKING_LABEL = 'Continue with in store booking'

/** Manual booking flow — consistent step titles and helper copy */
export const manualFlowStepTitleClassName =
  'text-base font-bold text-black sm:text-lg'

export const manualFlowStepHelperClassName =
  'mt-1.5 line-clamp-2 text-[11px] leading-snug text-text-muted sm:mt-2 sm:text-xs'

export const manualFlowStepBadgeClassName =
  'flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white'

export const manualFieldLabelClassName =
  'block text-xs font-bold text-black sm:text-sm'

export function manualSegmentButtonClassName(active: boolean) {
  return `w-full rounded-md px-4 transition-colors ${manualButtonSizeClassName} ${
    active
      ? 'bg-[#2b2f36] text-white'
      : 'border border-border-light bg-white text-text-muted hover:border-gray-300'
  }`
}

export function ManualFieldLabel({
  htmlFor,
  id,
  children,
  required,
}: {
  htmlFor: string
  id?: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      id={id}
      className={`mb-0.5 ${manualFieldLabelClassName}`}
    >
      {children}
      {required && <span className="text-red-600"> *</span>}
    </label>
  )
}

export function ManualCheckStepHeading({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white"
        aria-hidden
      >
        <Check className="size-4 text-black" strokeWidth={2.5} />
      </span>
      <h2 className={manualFlowStepTitleClassName}>{title}</h2>
    </div>
  )
}

export function ManualStepHeading({
  step,
  title,
  helperText,
  pinned = false,
}: {
  step: number
  title: string
  helperText?: string
  /** When true, heading sits in fixed chrome above scrolling step body */
  pinned?: boolean
}) {
  return (
    <div className={pinned ? 'mb-1' : 'mb-6 mt-4 sm:mt-5'}>
      <div className="flex items-center gap-2.5">
        <span className={manualFlowStepBadgeClassName} aria-hidden>
          {step}
        </span>
        <h2 className={manualFlowStepTitleClassName}>{title}</h2>
      </div>
      {helperText ? (
        <p className={manualFlowStepHelperClassName}>{helperText}</p>
      ) : null}
    </div>
  )
}

const MANUAL_CONTENTS_STEP_HELPER =
  'Describe what is inside the parcel and its value, offer optional add-ons, and confirm dangerous goods rules.'

export function ManualContentsStepHeading({
  pinned = false,
  onDangerousGoodsClick,
}: {
  pinned?: boolean
  onDangerousGoodsClick?: () => void
}) {
  return (
    <div className={pinned ? 'mb-1' : 'mb-6 mt-4 sm:mt-5'}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={manualFlowStepBadgeClassName} aria-hidden>
            4
          </span>
          <h2 className={`min-w-0 ${manualFlowStepTitleClassName}`}>Contents &amp; Add-ons</h2>
        </div>
        <button
          type="button"
          onClick={onDangerousGoodsClick}
          className="shrink-0 text-left text-[11px] font-semibold leading-snug text-hubbed-orange hover:text-hubbed-orange-hover sm:text-xs"
        >
          Prohibited or dangerous goods?
        </button>
      </div>
      <p className={manualFlowStepHelperClassName}>{MANUAL_CONTENTS_STEP_HELPER}</p>
    </div>
  )
}

export function ManualNextButton({ onNext }: { onNext?: () => void }) {
  return (
    <div className="mt-8 flex justify-end">
      <button
        type="button"
        onClick={onNext}
        className={manualPrimaryButtonClassName}
      >
        Next
      </button>
    </div>
  )
}

export function ManualBackButton({ onBack }: { onBack?: () => void }) {
  if (!onBack) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onBack}
      className={manualSecondaryButtonClassName}
    >
      Back
    </button>
  )
}

export function ManualStepNav({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = 'Next',
  className = '',
}: {
  onBack?: () => void
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {onBack ? <ManualBackButton onBack={onBack} /> : <span aria-hidden />}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={`${manualPrimaryButtonClassName} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {nextLabel}
      </button>
    </div>
  )
}
