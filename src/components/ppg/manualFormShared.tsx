import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

export const manualInputClassName =
  'w-full rounded-xl border border-border-light bg-white px-4 py-3.5 text-base text-black placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'

export function ManualFieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-text-muted">
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

export function ManualStepHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-6 mt-4 flex items-center gap-3 sm:mt-5">
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

export function ManualNextButton({ onNext }: { onNext?: () => void }) {
  return (
    <div className="mt-8 flex justify-end">
      <button
        type="button"
        onClick={onNext}
        className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900 sm:py-3.5 sm:text-base"
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
      className="rounded-md border border-border-light bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-50 sm:py-3.5 sm:text-base"
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
        className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900 sm:py-3.5 sm:text-base"
      >
        Next
      </button>
    </div>
  )
}
