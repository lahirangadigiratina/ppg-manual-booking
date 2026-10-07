import type { LucideIcon } from 'lucide-react'
import { Check, PenLine, Shield } from 'lucide-react'
import { useId, useState } from 'react'
import { DangerousGoodsDialog } from './DangerousGoodsDialog'
import { ParcelProtectionDialog } from './ParcelProtectionDialog'

interface AddonOption {
  id: string
  label: string
  price: string
  icon: LucideIcon
  subtitle?: string
}

function formatParcelValueDisplay(parcelValue: string) {
  const amount = Number(parcelValue.trim())
  if (!Number.isFinite(amount)) {
    return parcelValue.trim()
  }
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2)
}

const addonOptions: AddonOption[] = [
  {
    id: 'signature',
    label: 'Signature on Delivery',
    price: '+$3.50',
    icon: PenLine,
    subtitle: 'Recipient must sign upon delivery',
  },
  {
    id: 'protection',
    label: 'Parcel Protection',
    price: '+$2.50',
    icon: Shield,
  },
]

function parcelValueEnablesAddons(parcelValue: string) {
  const trimmed = parcelValue.trim()
  if (!trimmed) {
    return false
  }
  const amount = Number(trimmed)
  return Number.isFinite(amount) && amount > 0
}

function AddonRadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
        selected
          ? 'bg-hubbed-orange text-white'
          : 'border-2 border-gray-300 bg-white'
      }`}
      aria-hidden
    >
      {selected && <Check className="size-3.5" strokeWidth={3} />}
    </span>
  )
}

interface ManualOfferAddonsStepProps {
  parcelValue: string
  selectedAddons: string[]
  onSelectedAddonsChange: (ids: string[]) => void
  dangerousGoodsConfirmed: boolean
  onDangerousGoodsConfirmedChange: (confirmed: boolean) => void
}

export function ManualOfferAddonsStep({
  parcelValue,
  selectedAddons,
  onSelectedAddonsChange,
  dangerousGoodsConfirmed,
  onDangerousGoodsConfirmedChange,
}: ManualOfferAddonsStepProps) {
  const dangerousGoodsFieldId = useId()
  const selectedSet = new Set(selectedAddons)
  const [parcelProtectionOpen, setParcelProtectionOpen] = useState(false)
  const [dangerousGoodsOpen, setDangerousGoodsOpen] = useState(false)

  const addonsEnabled = parcelValueEnablesAddons(parcelValue)

  const toggleAddon = (id: string) => {
    if (!addonsEnabled) {
      return
    }
    const next = new Set(selectedAddons)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onSelectedAddonsChange([...next])
  }

  return (
    <div>
      <p className="mb-4 text-sm text-text-muted">
        Enhance your shipment with additional services.
      </p>

      <div className="mb-6 space-y-3">
        {addonOptions.map((addon) => {
          const Icon = addon.icon
          const selected = addonsEnabled && selectedSet.has(addon.id)

          if (!addonsEnabled) {
            return (
              <div
                key={addon.id}
                className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 sm:gap-4 sm:p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="size-5 text-gray-400" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-bold text-gray-500">{addon.label}</p>
                  <p className="mt-0.5 text-sm italic text-gray-400">
                    Enter your parcel value above to enable add-ons.
                  </p>
                </div>
              </div>
            )
          }

          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => toggleAddon(addon.id)}
              aria-pressed={selected}
              className="flex w-full items-center gap-3 rounded-xl border border-border-light bg-white p-4 text-left transition-colors hover:border-gray-300 sm:gap-4 sm:p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Icon className="size-5 text-gray-700" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-black">{addon.label}</p>
                <div className="mt-0.5 text-sm text-text-muted">
                  {addon.id === 'protection' ? (
                    <>
                      <span>
                        Cover your parcel valued at ${formatParcelValueDisplay(parcelValue)}
                      </span>
                      <button
                        type="button"
                        className="mt-1 block text-sm font-medium text-hubbed-orange underline hover:text-hubbed-orange-hover"
                        onClick={(event) => {
                          event.stopPropagation()
                          setParcelProtectionOpen(true)
                        }}
                      >
                        Parcel Protection Conditions
                      </button>
                    </>
                  ) : (
                    addon.subtitle
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                <p className="text-base font-bold text-black">{addon.price}</p>
                <AddonRadioIndicator selected={selected} />
              </div>
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border border-border-light bg-white p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <input
            id={dangerousGoodsFieldId}
            type="checkbox"
            checked={dangerousGoodsConfirmed}
            onChange={(e) => onDangerousGoodsConfirmedChange(e.target.checked)}
            className="mt-1 size-4 shrink-0 rounded border-gray-300"
          />
          <div className="min-w-0">
            <label
              htmlFor={dangerousGoodsFieldId}
              className="cursor-pointer text-sm font-semibold leading-snug text-black sm:text-base"
            >
              The sender confirms this parcel contains no dangerous or prohibited goods{' '}
              <span className="text-red-600" aria-hidden>
                *
              </span>
            </label>
            <button
              type="button"
              onClick={() => setDangerousGoodsOpen(true)}
              className="mt-2 block text-sm font-medium text-hubbed-orange underline hover:text-hubbed-orange-hover"
            >
              See what we can&apos;t accept
            </button>
          </div>
        </div>
      </div>

      <DangerousGoodsDialog
        open={dangerousGoodsOpen}
        onClose={() => setDangerousGoodsOpen(false)}
      />
      <ParcelProtectionDialog
        open={parcelProtectionOpen}
        onClose={() => setParcelProtectionOpen(false)}
      />
    </div>
  )
}
