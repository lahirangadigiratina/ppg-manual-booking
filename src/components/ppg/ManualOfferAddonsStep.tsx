import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, PenLine, Shield } from 'lucide-react'
import { useState } from 'react'
import { ManualStepHeading } from './manualFormShared'

interface AddonOption {
  id: string
  label: string
  price: string
  icon: LucideIcon
}

const addonOptions: AddonOption[] = [
  { id: 'signature', label: 'Signature on Delivery', price: '$2.20', icon: PenLine },
  { id: 'protection', label: 'Parcel Protection', price: '$5.50', icon: Shield },
]

export function ManualOfferAddonsStep() {
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(
    () => new Set(['signature']),
  )

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div>
      <ManualStepHeading step={6} title="Offer Add-ons" />

      <div className="mb-6 space-y-3">
        {addonOptions.map((addon) => {
          const Icon = addon.icon
          const selected = selectedAddons.has(addon.id)
          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => toggleAddon(addon.id)}
              aria-pressed={selected}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors sm:gap-4 sm:p-5 ${
                selected
                  ? 'border-hubbed-orange bg-[#fff4e8]'
                  : 'border-border-light bg-white hover:border-gray-300'
              }`}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Icon className="size-5 text-gray-700" strokeWidth={1.75} aria-hidden />
              </span>
              <p className="min-w-0 flex-1 text-base font-bold text-black">{addon.label}</p>
              <p className="shrink-0 text-base font-bold text-black sm:text-lg">{addon.price}</p>
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border border-[#f5c89a] bg-[#fff4e8] p-4 sm:p-5">
        <div className="flex gap-3">
          <AlertTriangle
            className="size-5 shrink-0 text-amber-700"
            strokeWidth={1.75}
            aria-hidden
          />
          <div className="text-sm leading-snug text-[#5c4033] sm:text-base">
            <p className="font-bold text-hubbed-orange">Tell the customer:</p>
            <p className="mt-1">
              &ldquo;Your parcel can&apos;t contain dangerous or prohibited goods.&rdquo; Confirm
              verbally before continuing.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
