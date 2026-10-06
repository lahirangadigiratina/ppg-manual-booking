import {
  buildBookingPriceLineItems,
  calculateBookingTotal,
  formatBookingAmount,
  type ManualBookingDraft,
} from './manualBookingState'
import { ManualCheckStepHeading } from './manualFormShared'

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
  draft: ManualBookingDraft
}

export function ManualPriceBreakdownStep({ draft }: ManualPriceBreakdownStepProps) {
  const lineItems = buildBookingPriceLineItems(draft)
  const total = calculateBookingTotal(draft)

  return (
    <div>
      <ManualCheckStepHeading title="Price Breakdown" />

      <div className="border-t border-border-light">
        {lineItems.map((item) => (
          <PriceRow
            key={item.label}
            label={item.label}
            amount={formatBookingAmount(item.amount)}
          />
        ))}
      </div>

      <div className="border-t border-border-light">
        <PriceRow
          label="Total"
          amount={total === null ? '$—.—' : formatBookingAmount(total)}
          bold
        />
      </div>
    </div>
  )
}
