import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

export const manualInputClassName =
  'w-full rounded-xl border border-border-light bg-white px-4 py-3.5 text-base text-black placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'

/** Shared control height/typography for actions, nav, and segment choices */
const manualButtonSizeClassName =
  'py-3 text-sm font-semibold sm:py-3.5 sm:text-base'

export const manualPrimaryButtonClassName = `rounded-md bg-black px-6 text-white transition-colors hover:bg-gray-900 ${manualButtonSizeClassName}`

export const manualSecondaryButtonClassName = `rounded-md border border-border-light bg-white px-6 text-black transition-colors hover:bg-gray-50 ${manualButtonSizeClassName}`

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
      className="mb-2 block text-sm font-medium text-text-muted"
    >
      {children}
      {required && <span className="text-red-600"> *</span>}
    </label>
  )
}

export function ManualCheckStepHeading({ title }: { title: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white"
        aria-hidden
      >
        <Check className="size-5 text-black" strokeWidth={2.5} />
      </span>
      <h2 className="text-xl font-bold text-black sm:text-2xl">{title}</h2>
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
    <div className={pinned ? 'mb-4' : 'mb-6 mt-4 sm:mt-5'}>
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-base font-bold text-white"
          aria-hidden
        >
          {step}
        </span>
        <h2 className="text-xl font-bold text-black sm:text-2xl">{title}</h2>
      </div>
      {helperText ? (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{helperText}</p>
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
    <div className={pinned ? 'mb-4' : 'mb-6 mt-4 sm:mt-5'}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-base font-bold text-white"
            aria-hidden
          >
            4
          </span>
          <h2 className="shrink-0 whitespace-nowrap text-xl font-bold text-black sm:text-2xl">
            Contents &amp; Add-ons
          </h2>
        </div>
        <button
          type="button"
          onClick={onDangerousGoodsClick}
          className="shrink-0 text-left text-[11px] font-semibold leading-snug text-hubbed-orange hover:text-hubbed-orange-hover sm:text-xs"
        >
          Prohibited or dangerous goods?
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {MANUAL_CONTENTS_STEP_HELPER}
      </p>
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
