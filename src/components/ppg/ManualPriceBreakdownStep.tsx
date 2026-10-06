import { ManualCheckStepHeading } from './manualFormShared'

interface LineItem {
  label: string
  amount: string
}

const lineItems: LineItem[] = [
  { label: 'Delivery', amount: '$10.85' },
  { label: 'Fuel Surcharge', amount: '$1.00' },
  { label: 'Packaging Fee', amount: '$3.00' },
  { label: 'Signature on Delivery', amount: '$2.20' },
  { label: 'GST (10%)', amount: '$1.71' },
]

const TOTAL = '$18.76'

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

export function ManualPriceBreakdownStep() {
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
    </div>
  )
}
