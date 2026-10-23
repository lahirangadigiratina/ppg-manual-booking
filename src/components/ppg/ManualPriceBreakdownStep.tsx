import {
  buildBookingPriceLineItems,
  calculateBookingTotal,
  formatBookingAmount,
  type ManualBookingDraft,
} from './manualBookingState'
import {
  ManualCheckStepHeading,
  manualFlowStepHelperClassName,
  manualFlowStepTitleClassName,
} from './manualFormShared'

function PriceRow({ label, amount, bold }: { label: string; amount: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className={`text-sm text-black sm:text-base ${bold ? 'font-bold' : ''}`}>
        {label}
      </span>
      <span
        className={`shrink-0 tabular-nums text-right text-sm text-black sm:text-base ${bold ? 'text-lg font-bold sm:text-xl' : ''}`}
      >
        {amount}
      </span>
    </div>
  )
}

interface ManualPriceBreakdownStepProps {
  draft: ManualBookingDraft
  paymentReceived: boolean
  onPaymentReceivedChange: (received: boolean) => void
}

export function ManualPriceBreakdownStep({
  draft,
  paymentReceived,
  onPaymentReceivedChange,
}: ManualPriceBreakdownStepProps) {
  const lineItems = buildBookingPriceLineItems(draft)
  const total = calculateBookingTotal(draft)
  const totalLabel = total === null ? '$—.—' : formatBookingAmount(total)

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
        <PriceRow label="Total" amount={totalLabel} bold />
      </div>

      <section
        className="mt-6 rounded-xl border border-border-light bg-white p-4 sm:p-5"
        aria-labelledby="payment-required-heading"
      >
        <h3 id="payment-required-heading" className={manualFlowStepTitleClassName}>
          Payment required
        </h3>

        <p className={`${manualFlowStepHelperClassName} mt-2 line-clamp-none`}>
          Collect {totalLabel} from the customer through cash. This booking cannot be
          completed until payment is confirmed.
        </p>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-border-light bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={paymentReceived}
            onChange={(e) => onPaymentReceivedChange(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 rounded border-gray-300 accent-hubbed-orange"
          />
          <span className="text-sm font-semibold leading-snug text-black sm:text-base">
            Payment of {totalLabel} received
          </span>
        </label>
      </section>
    </div>
  )
}
