import { CreditCard } from 'lucide-react'
import { ManualCheckStepHeading } from './manualFormShared'

interface LineItem {
  label: string
  amount: string
}

const lineItems: LineItem[] = [
  { label: 'Delivery', amount: '$10.85' },
  { label: 'Packaging Fee', amount: '$3.00' },
  { label: 'Signature on Delivery', amount: '$2.20' },
  { label: 'GST (10%)', amount: '$1.61' },
]

const TOTAL = '$17.66'

function PriceRow({ label, amount, bold }: { label: string; amount: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className={`text-sm text-black sm:text-base ${bold ? 'font-bold' : ''}`}>
        {label}
      </span>
      <span className={`text-sm text-black sm:text-base ${bold ? 'text-lg font-bold sm:text-xl' : ''}`}>
        {amount}
      </span>
    </div>
  )
}

interface ManualPriceBreakdownStepProps {
  onCharge?: () => void
}

export function ManualPriceBreakdownStep({ onCharge }: ManualPriceBreakdownStepProps) {
  return (
    <div>
      <ManualCheckStepHeading title="Price Breakdown" />

      <div className="border-t border-border-light">
        {lineItems.map((item) => (
          <PriceRow key={item.label} label={item.label} amount={item.amount} />
        ))}
      </div>

      <div className="border-t border-border-light">
        <PriceRow label="Total" amount={TOTAL} bold />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onCharge}
          className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-hubbed-orange px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-hubbed-orange-hover sm:text-lg"
        >
          <CreditCard className="size-5 text-yellow-300" strokeWidth={1.75} aria-hidden />
          Charge to EFTPOS
        </button>
      </div>

      <p className="mt-6 rounded-xl border border-indigo-200 bg-[#eef2ff] px-4 py-4 text-center text-sm leading-snug text-[#3730a3] sm:text-base">
        Pushes {TOTAL} to the store&apos;s dedicated PARCELPOINT terminal for the customer to tap
        or insert.
      </p>
    </div>
  )
}
