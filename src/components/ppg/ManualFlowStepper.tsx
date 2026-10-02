import { Check } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Parcel Details', short: 'Parcel' },
  { id: 2, label: 'Sender Details', short: 'Sender' },
  { id: 3, label: 'Receiver Details', short: 'Receiver' },
  { id: 4, label: 'Delivery Address', short: 'Address' },
  { id: 5, label: 'Contents', short: 'Contents' },
  { id: 6, label: 'Offer Add-ons', short: 'Add-ons' },
] as const

const STEP_COUNT = STEPS.length

interface ManualFlowStepperProps {
  manualStep: number
  className?: string
  compact?: boolean
}

export function ManualFlowStepper({
  manualStep,
  className = '',
  compact = false,
}: ManualFlowStepperProps) {
  const formStep = Math.min(Math.max(manualStep, 1), STEP_COUNT)
  const current = STEPS[formStep - 1]
  const progressWidth = `${(formStep / STEP_COUNT) * 100}%`

  return (
    <nav
      aria-label="Booking progress"
      className={
        compact
          ? `pb-2 ${className}`
          : `mb-6 border-b border-border-light pb-6 ${className}`
      }
    >
      <div
        className={`flex items-center justify-between gap-3 ${compact ? 'mb-1.5' : 'mb-3'}`}
      >
        <p className="min-w-0 truncate text-sm text-text-muted">
          <span className="font-semibold text-black">
            Step {formStep}/{STEP_COUNT}
          </span>
          <span className="mx-2 text-border-light" aria-hidden>
            |
          </span>
          <span className="font-medium text-black">{current.label}</span>
        </p>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEP_COUNT}
        aria-valuenow={formStep}
        aria-valuetext={`Step ${formStep}, ${current.label}`}
      >
        <div
          className="h-full rounded-full bg-black transition-[width] duration-300 ease-out"
          style={{ width: progressWidth }}
        />
      </div>

      <ol
        className={`flex items-center justify-between gap-1 ${compact ? 'mt-2' : 'mt-4'}`}
      >
        {STEPS.map((step, index) => {
          const completed = formStep > step.id
          const active = formStep === step.id
          const isLast = index === STEPS.length - 1

          return (
            <li
              key={step.id}
              className={`flex min-w-0 items-center ${isLast ? 'shrink-0' : 'flex-1'}`}
            >
              <div
                className={`flex min-w-0 flex-col items-center ${compact ? 'gap-0.5' : 'gap-1'}`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full font-bold ${
                    compact
                      ? 'size-5 text-[9px] sm:size-6 sm:text-[10px]'
                      : 'size-6 text-[10px] sm:size-7 sm:text-xs'
                  } ${
                    active
                      ? 'bg-black text-white'
                      : completed
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-text-muted'
                  }`}
                  aria-current={active ? 'step' : undefined}
                  title={step.label}
                >
                  {completed ? (
                    <Check className="size-3 sm:size-3.5" strokeWidth={2.5} aria-hidden />
                  ) : (
                    step.id
                  )}
                </span>
                <span
                  className={`hidden max-w-[4.5rem] truncate text-center text-[10px] leading-none sm:block ${
                    active ? 'font-semibold text-black' : 'text-text-muted'
                  }`}
                >
                  {step.short}
                </span>
              </div>
              {!isLast && (
                <span
                  className={`mx-0.5 h-px min-w-[4px] flex-1 sm:mx-1 ${
                    compact ? 'mb-3' : 'mb-4'
                  } ${
                    completed ? 'bg-black' : 'bg-gray-200'
                  }`}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
