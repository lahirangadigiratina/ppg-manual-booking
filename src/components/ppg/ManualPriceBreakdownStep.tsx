import { Banknote, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { ManualCheckStepHeading, manualSecondaryButtonClassName } from './manualFormShared'

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

type PaymentMethod = 'eftpos' | 'cash'

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('eftpos')

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

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          aria-pressed={paymentMethod === 'eftpos'}
          onClick={() => setPaymentMethod('eftpos')}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-colors sm:text-lg ${
            paymentMethod === 'eftpos'
              ? 'bg-hubbed-orange text-white hover:bg-hubbed-orange-hover'
              : `${manualSecondaryButtonClassName} py-4`
          }`}
        >
          <CreditCard
            className={`size-5 ${paymentMethod === 'eftpos' ? 'text-yellow-300' : 'text-gray-700'}`}
            strokeWidth={1.75}
            aria-hidden
          />
          EFTPOS
        </button>
        <button
          type="button"
          aria-pressed={paymentMethod === 'cash'}
          onClick={() => setPaymentMethod('cash')}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-colors sm:text-lg ${
            paymentMethod === 'cash'
              ? 'bg-[#2b2f36] text-white hover:bg-[#1f2329]'
              : `${manualSecondaryButtonClassName} py-4`
          }`}
        >
          <Banknote
            className={`size-5 ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-700'}`}
            strokeWidth={1.75}
            aria-hidden
          />
          Cash
        </button>
      </div>

      {paymentMethod === 'eftpos' && (
        <p className="mt-6 rounded-xl border border-indigo-200 bg-[#eef2ff] px-4 py-4 text-center text-sm leading-snug text-[#3730a3] sm:text-base">
          Pushes {TOTAL} to the store&apos;s dedicated PARCELPOINT terminal for the customer to tap
          or insert.
        </p>
      )}
    </div>
  )
}
