import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, Check, PenLine, Shield } from 'lucide-react'
import { useState } from 'react'
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
}

export function ManualOfferAddonsStep({ parcelValue }: ManualOfferAddonsStepProps) {
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(() => new Set())
  const [parcelProtectionOpen, setParcelProtectionOpen] = useState(false)

  const addonsEnabled = parcelValueEnablesAddons(parcelValue)

  const toggleAddon = (id: string) => {
    if (!addonsEnabled) {
      return
    }
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
      <p className="mb-4 text-sm text-text-muted">
        Enhance your shipment with additional services.
      </p>

      <div className="mb-6 space-y-3">
        {addonOptions.map((addon) => {
          const Icon = addon.icon
          const selected = addonsEnabled && selectedAddons.has(addon.id)

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
                        Parcel Protection
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

      <div className="rounded-xl border border-hubbed-orange/40 bg-hubbed-orange-tint p-4 sm:p-5">
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

      <ParcelProtectionDialog
        open={parcelProtectionOpen}
        onClose={() => setParcelProtectionOpen(false)}
      />
    </div>
  )
}
