import { Check, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { manualInputClassName } from '../ppg/manualFormShared'
import { PackageParcelReminderDialog } from './PackageParcelReminderDialog'
import type { DropoffLabelParcelDemo } from './returnParcelDemo'

interface ConfirmDropoffLabelDialogProps {
  open: boolean
  parcel: DropoffLabelParcelDemo | null
  /** When opening, start on attach (1) or match label (2). */
  initialStep?: 1 | 2
  onClose: () => void
}

function ParcelInfoPanel({ parcel }: { parcel: DropoffLabelParcelDemo }) {
  return (
    <div className="mx-auto mt-4 w-full max-w-md rounded-md bg-gray-200/70 px-5 py-4 text-sm text-black sm:max-w-lg sm:px-6 sm:py-5 sm:text-base">
      <dl className="mx-auto w-fit space-y-2.5 sm:space-y-3">
        <div className="grid grid-cols-[9.5rem_1fr] items-baseline gap-x-2 sm:grid-cols-[11rem_1fr]">
          <dt className="font-normal">Name :</dt>
          <dd className="m-0 font-bold">{parcel.name}</dd>
        </div>
        <div className="grid grid-cols-[9.5rem_1fr] items-baseline gap-x-2 sm:grid-cols-[11rem_1fr]">
          <dt className="font-normal">Consignment ID :</dt>
          <dd className="m-0 font-bold">{parcel.consignmentId}</dd>
        </div>
        <div className="grid grid-cols-[9.5rem_1fr] items-baseline gap-x-2 sm:grid-cols-[11rem_1fr]">
          <dt className="font-normal">Item ID :</dt>
          <dd className="m-0 font-bold">{parcel.itemId}</dd>
        </div>
      </dl>
    </div>
  )
}

function DropoffStepper({ step }: { step: 1 | 2 }) {
  const stepOneComplete = step >= 2

  return (
    <div className="flex items-start justify-between gap-2 px-2 sm:px-4">
      <div className="flex flex-1 flex-col items-center gap-2">
        <span
          className={`flex size-9 items-center justify-center rounded-full text-sm font-bold text-white ${
            stepOneComplete ? 'bg-black' : 'bg-black'
          }`}
        >
          {stepOneComplete ? <Check className="size-5" strokeWidth={2.5} aria-hidden /> : '01'}
        </span>
        <span className="text-center text-sm font-bold text-black">Attach label</span>
      </div>
      <div className="mt-4 h-px flex-1 bg-gray-300" aria-hidden />
      <div className="flex flex-1 flex-col items-center gap-2">
        <span
          className={`flex size-9 items-center justify-center rounded-full text-sm font-bold text-white ${
            step === 2 ? 'bg-black' : 'bg-gray-300'
          }`}
        >
          02
        </span>
        <span
          className={`text-center text-sm ${step === 2 ? 'font-bold text-black' : 'font-medium text-text-muted'}`}
        >
          Match label
        </span>
      </div>
    </div>
  )
}

function AttachLabelIllustration() {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-sm border border-border-light bg-white p-4 sm:min-h-[260px]">
      <div className="relative w-full max-w-[200px]">
        <div className="aspect-[4/3] rounded-sm border-2 border-amber-800/30 bg-amber-100/80 shadow-sm" />
        <div className="absolute bottom-3 left-3 right-3 rounded border border-dashed border-gray-400 bg-white/90 px-2 py-1 text-[10px] font-semibold text-amber-700">
          NEW Print Free label
        </div>
      </div>
      <p className="mt-4 text-center text-[10px] font-semibold tracking-wide text-gray-500">
        Powered by PARCELPOINT
      </p>
    </div>
  )
}

function MatchLabelIllustration() {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-sm border border-border-light bg-gray-50 p-4 sm:min-h-[260px]">
      <div className="relative w-full max-w-[220px] rounded-sm border border-gray-300 bg-white p-3 shadow-sm">
        <div className="h-8 rounded-sm bg-gradient-to-r from-black via-black to-orange-500" />
        <div className="mt-2 space-y-1 px-1">
          <div className="h-2 w-3/4 rounded bg-gray-200" />
          <div className="h-2 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="mt-3 h-10 rounded-sm bg-gray-100" aria-hidden />
        <div className="absolute bottom-6 left-4 rounded border-2 border-red-600 bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-black">
          AX83500
        </div>
      </div>
      <p className="mt-4 text-center text-[10px] font-semibold tracking-wide text-gray-500">
        Powered by PARCELPOINT
      </p>
    </div>
  )
}

export function ConfirmDropoffLabelDialog({
  open,
  parcel,
  initialStep = 1,
  onClose,
}: ConfirmDropoffLabelDialogProps) {
  const crossOutId = useId()
  const attachId = useId()
  const referenceInputId = useId()
  const [step, setStep] = useState<1 | 2>(1)
  const [crossedOutOldLabel, setCrossedOutOldLabel] = useState(false)
  const [attachedNewLabel, setAttachedNewLabel] = useState(false)
  const [referenceCode, setReferenceCode] = useState('')
  const [packagingReminderOpen, setPackagingReminderOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setStep(1)
      setCrossedOutOldLabel(false)
      setAttachedNewLabel(false)
      setReferenceCode('')
      setPackagingReminderOpen(false)
      return
    }
    setStep(initialStep)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, initialStep, onClose])

  if (!open || !parcel) {
    return null
  }

  const attachStepsComplete = crossedOutOldLabel && attachedNewLabel
  const referenceProvided = referenceCode.trim().length > 0

  return (
    <>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dropoff-label-title"
        className="relative flex max-h-[min(92vh,720px)] w-full max-w-3xl flex-col overflow-hidden rounded-sm border border-border-light bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirm dropoff"
          className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-md text-black hover:bg-gray-100 sm:right-3 sm:top-3"
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </button>

        <div className="overflow-y-auto px-4 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <h2
            id="confirm-dropoff-label-title"
            className="px-8 text-center text-lg font-bold text-black sm:text-xl"
          >
            Confirm Dropoff
          </h2>

          {step === 1 ? (
            <p className="mt-2 text-center text-sm font-medium text-red-600">
              Please use the new Print Free label as shown in the picture below
            </p>
          ) : null}

          <ParcelInfoPanel parcel={parcel} />

          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
            {step === 1 ? <AttachLabelIllustration /> : <MatchLabelIllustration />}

            <div className="flex min-h-[260px] flex-col sm:min-h-[280px]">
              <DropoffStepper step={step} />

              {step === 1 ? (
                <>
                  <div className="mt-6">
                    <p className="text-sm font-bold text-black">Steps:</p>
                    <ul className="mt-3 space-y-3">
                      <li>
                        <label
                          htmlFor={crossOutId}
                          className="flex cursor-pointer items-start gap-2.5 text-sm text-black"
                        >
                          <input
                            id={crossOutId}
                            type="checkbox"
                            checked={crossedOutOldLabel}
                            onChange={(event) => setCrossedOutOldLabel(event.target.checked)}
                            className="mt-0.5 size-4 shrink-0 rounded border border-gray-400 accent-black"
                          />
                          <span>Cross out the old label with the marker</span>
                        </label>
                      </li>
                      <li>
                        <label
                          htmlFor={attachId}
                          className="flex cursor-pointer items-start gap-2.5 text-sm text-black"
                        >
                          <input
                            id={attachId}
                            type="checkbox"
                            checked={attachedNewLabel}
                            onChange={(event) => setAttachedNewLabel(event.target.checked)}
                            className="mt-0.5 size-4 shrink-0 rounded border border-gray-400 accent-black"
                          />
                          <span>
                            Attach the <span className="font-semibold text-red-600">New</span> Print
                            Free label on the package
                          </span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-auto flex justify-end pt-6">
                    <button
                      type="button"
                      disabled={!attachStepsComplete}
                      onClick={() => setStep(2)}
                      className="min-w-[10rem] rounded-md bg-gray-300 px-10 py-2.5 text-sm font-semibold text-black transition-colors enabled:bg-gray-400 enabled:hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-80 sm:py-3"
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-6 px-1 sm:px-2">
                    <label htmlFor={referenceInputId} className="text-sm font-bold text-black">
                      Enter the label reference / scan barcode
                      <span className="text-red-600" aria-hidden>
                        *
                      </span>
                    </label>
                    <input
                      id={referenceInputId}
                      type="text"
                      value={referenceCode}
                      onChange={(event) => setReferenceCode(event.target.value)}
                      placeholder="Reference Number / Tracking Code"
                      className={`mt-2 ${manualInputClassName}`}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mt-auto flex justify-end pt-6">
                    <button
                      type="button"
                      disabled={!referenceProvided}
                      onClick={() => setPackagingReminderOpen(true)}
                      className="min-w-[10rem] rounded-md bg-gray-600 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[12rem] sm:py-3"
                    >
                      Confirm Dropoff
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <PackageParcelReminderDialog
      open={packagingReminderOpen}
      onContinue={() => {
        setPackagingReminderOpen(false)
        onClose()
      }}
      onGoBack={() => setPackagingReminderOpen(false)}
    />
    </>
  )
}
