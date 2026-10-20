import type { LucideIcon } from 'lucide-react'
import { Check, PenLine, Shield } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { DangerousGoodsDialog } from './DangerousGoodsDialog'
import { ParcelProtectionDialog } from './ParcelProtectionDialog'
import {
  BOOKING_CHARGE_AMOUNTS,
  formatBookingAmount,
  formatDeclaredValue,
  formatParcelProtectionAddonPrice,
  getDeclaredParcelValueAmount,
  isParcelProtectionIncluded,
} from './manualBookingState'

interface AddonOption {
  id: string
  label: string
  price: string
  icon: LucideIcon
  subtitle?: string
}

const addonOptions: AddonOption[] = [
  {
    id: 'signature',
    label: 'Signature on Delivery',
    price: `+${formatBookingAmount(BOOKING_CHARGE_AMOUNTS.signature)}`,
    icon: PenLine,
    subtitle: 'Recipient must sign upon delivery',
  },
  {
    id: 'protection',
    label: 'Parcel Protection',
    price: '',
    icon: Shield,
  },
]

function parcelValueEnablesAddons(parcelValue: string) {
  return getDeclaredParcelValueAmount(parcelValue) !== null
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
  const protectionIncluded = addonsEnabled && isParcelProtectionIncluded(parcelValue)
  const protectionAddonPrice =
    formatParcelProtectionAddonPrice(parcelValue) ?? '+$2.50 per $100 above $100'

  useEffect(() => {
    if (!protectionIncluded || !selectedAddons.includes('protection')) {
      return
    }
    onSelectedAddonsChange(selectedAddons.filter((id) => id !== 'protection'))
  }, [protectionIncluded, selectedAddons, onSelectedAddonsChange])

  const toggleAddon = (id: string) => {
    if (!addonsEnabled) {
      return
    }
    if (id === 'protection' && protectionIncluded) {
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

  const renderProtectionBody = () => (
    <>
      <span>Covers your parcel valued at {formatDeclaredValue(parcelValue)}</span>
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
  )

  return (
    <div>
      <div className="mb-6 space-y-3">
        {addonOptions.map((addon) => {
          const Icon = addon.icon

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

          if (addon.id === 'protection' && protectionIncluded) {
            return (
              <div
                key={addon.id}
                className="flex w-full items-center gap-3 rounded-xl border-2 border-hubbed-orange bg-hubbed-orange-tint p-4 sm:gap-4 sm:p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="size-5 text-gray-700" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-black">{addon.label}</p>
                  <div className="mt-0.5 text-sm text-text-muted">{renderProtectionBody()}</div>
                </div>
                <p className="shrink-0 text-base font-bold text-hubbed-orange sm:text-lg">
                  Included
                </p>
              </div>
            )
          }

          const selected =
            addon.id === 'protection'
              ? selectedSet.has('protection')
              : selectedSet.has(addon.id)

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
                  {addon.id === 'protection' ? renderProtectionBody() : addon.subtitle}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                <p className="text-base font-bold text-black">
                  {addon.id === 'protection' ? protectionAddonPrice : addon.price}
                </p>
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
            className="mt-1 size-4 shrink-0 rounded border-gray-300 accent-hubbed-orange"
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
              See What Cannot Be Sent
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
