import { useEffect } from 'react'

const TOTAL = '$18.76'

interface ManualAwaitingPaymentStepProps {
  onComplete?: () => void
}

export function ManualAwaitingPaymentStep({ onComplete }: ManualAwaitingPaymentStepProps) {
  useEffect(() => {
    if (!onComplete) {
      return
    }

    const timerId = window.setTimeout(onComplete, 6000)
    return () => window.clearTimeout(timerId)
  }, [onComplete])

  return (
    <div className="flex flex-col items-center py-6 sm:py-10">
      <div className="w-full max-w-[280px] rounded-[2rem] bg-[#2b2f36] p-5 shadow-lg sm:max-w-[300px] sm:p-6">
        <div className="rounded-xl bg-white px-4 py-8 text-center sm:py-10">
          <p className="text-3xl font-bold tracking-tight text-black sm:text-4xl">{TOTAL}</p>
          <p className="mt-3 text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:text-xs">
            Tap / Insert / Swipe
          </p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 px-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="aspect-square rounded-md border border-white/15 bg-white/5"
              aria-hidden
            />
          ))}
        </div>
      </div>

      <p className="mt-10 flex items-center gap-2 text-base font-bold text-black sm:text-lg">
        <span
          className="size-2.5 shrink-0 animate-pulse rounded-full bg-hubbed-orange"
          aria-hidden
        />
        Waiting for customer&apos;s card...
      </p>
    </div>
  )
}
