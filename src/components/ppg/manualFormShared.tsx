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
  pinned = false,
}: {
  step: number
  title: string
  /** When true, heading sits in fixed chrome above scrolling step body */
  pinned?: boolean
}) {
  return (
    <div
      className={
        pinned
          ? 'mb-4 flex items-center gap-3'
          : 'mb-6 mt-4 flex items-center gap-3 sm:mt-5'
      }
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-base font-bold text-white"
        aria-hidden
      >
        {step}
      </span>
      <h2 className="text-xl font-bold text-black sm:text-2xl">{title}</h2>
    </div>
  )
}

export function ManualContentsStepHeading({
  pinned = false,
  onDangerousGoodsClick,
}: {
  pinned?: boolean
  onDangerousGoodsClick?: () => void
}) {
  return (
    <div
      className={
        pinned
          ? 'mb-4 flex items-start justify-between gap-4'
          : 'mb-6 mt-4 flex items-start justify-between gap-4 sm:mt-5'
      }
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-base font-bold text-white"
          aria-hidden
        >
          5
        </span>
        <h2 className="text-xl font-bold text-black sm:text-2xl">Contents</h2>
      </div>
      <button
        type="button"
        onClick={onDangerousGoodsClick}
        className="shrink-0 pt-2 text-sm font-semibold text-hubbed-orange hover:text-hubbed-orange-hover"
      >
        Dangerous goods?
      </button>
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
  className = '',
}: {
  onBack?: () => void
  onNext?: () => void
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {onBack ? <ManualBackButton onBack={onBack} /> : <span aria-hidden />}
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
