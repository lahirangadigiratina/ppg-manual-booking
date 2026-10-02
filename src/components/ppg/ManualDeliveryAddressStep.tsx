import { Home, Search } from 'lucide-react'
import { useState } from 'react'
import {
  ManualFieldLabel,
  ManualStepHeading,
  manualInputClassName,
} from './manualFormShared'

export function ManualDeliveryAddressStep() {
  const [address, setAddress] = useState('')

  return (
    <div>
      <ManualStepHeading step={4} title="Delivery Address" />

      <div className="mb-5">
        <ManualFieldLabel htmlFor="receiver-address">Receiver Address</ManualFieldLabel>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-500"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            id="receiver-address"
            type="search"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="15/37 Nicholson St, Balmain East"
            autoComplete="off"
            className={`${manualInputClassName} py-3.5 pl-12`}
          />
        </div>
      </div>

      <div className="rounded-xl border border-hubbed-orange bg-[#fff4e8] p-4 sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            <Home className="size-5 text-gray-700" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-black">Deliver to Door</p>
            <p className="mt-0.5 text-sm text-text-muted">Only option in manual booking.</p>
          </div>
          <p className="shrink-0 text-base font-bold text-black sm:text-lg">$10.85</p>
        </div>
      </div>

    </div>
  )
}
