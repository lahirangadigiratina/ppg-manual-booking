import { Package, X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { manualPrimaryButtonClassName } from '../ppg/manualFormShared'

interface PackageParcelReminderDialogProps {
  open: boolean
  onContinue: () => void
  onGoBack: () => void
}

export function PackageParcelReminderDialog({
  open,
  onContinue,
  onGoBack,
}: PackageParcelReminderDialogProps) {
  useEffect(() => {
    if (!open) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onGoBack()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onGoBack])

  if (!open) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-[100dvh] w-full items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onGoBack}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-parcel-reminder-title"
        className="relative flex w-full max-w-md flex-col items-center rounded-xl border border-border-light bg-white px-5 pb-6 pt-5 shadow-xl sm:px-6 sm:pb-7 sm:pt-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onGoBack}
          aria-label="Close packaging reminder"
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-md text-slate-700 hover:bg-gray-100 sm:right-3 sm:top-3"
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </button>

        <div
          className="flex size-14 items-center justify-center rounded-full bg-black sm:size-16"
          aria-hidden
        >
          <Package className="size-7 text-white sm:size-8" strokeWidth={1.75} />
        </div>

        <h2
          id="package-parcel-reminder-title"
          className="mt-5 px-6 text-center text-xl font-bold text-slate-900 sm:text-[1.35rem]"
        >
          Package this parcel first
        </h2>

        <p className="mt-3 max-w-sm px-2 text-center text-sm leading-relaxed text-gray-500">
          Please package this parcel before proceeding.
        </p>

        <button
          type="button"
          onClick={onContinue}
          className={`mt-6 w-full ${manualPrimaryButtonClassName}`}
        >
          OK
        </button>
      </div>
    </div>,
    document.body,
  )
}
