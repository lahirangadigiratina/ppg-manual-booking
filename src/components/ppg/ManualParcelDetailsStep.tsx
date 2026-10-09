import type { LucideIcon } from 'lucide-react'
import {
  Boxes,
  Briefcase,
  Check,
  Handbag,
  Mail,
  Package,
  ShoppingBag,
} from 'lucide-react'
import { ManualFieldLabel } from './manualFormShared'
import { PARCEL_SIZE_CATALOG } from './manualBookingState'

const parcelSizeIcons: Record<string, LucideIcon> = {
  pouch: Mail,
  satchel: ShoppingBag,
  handbag: Handbag,
  shoebox: Package,
  briefcase: Briefcase,
  'carry-on': Boxes,
}

function compactSegmentButtonClassName(active: boolean) {
  return `w-full rounded-md px-3 py-2 text-xs font-semibold transition-colors sm:py-2.5 sm:text-sm ${
    active
      ? 'bg-[#2b2f36] text-white'
      : 'border border-border-light bg-white text-text-muted hover:border-gray-300'
  }`
}

interface ManualParcelDetailsStepProps {
  selectedSizeId: string
  onSelectedSizeIdChange: (id: string) => void
  needsPackaging: boolean | null
  onNeedsPackagingChange: (value: boolean) => void
}

export function ManualParcelDetailsStep({
  selectedSizeId,
  onSelectedSizeIdChange,
  needsPackaging,
  onNeedsPackagingChange,
}: ManualParcelDetailsStepProps) {
  return (
    <div className="w-full">
      <section className="shrink-0 pb-2" aria-labelledby="parcel-size-heading">
        <ManualFieldLabel htmlFor="parcel-size-grid" id="parcel-size-heading" required>
          Size
        </ManualFieldLabel>
        <div
          id="parcel-size-grid"
          className="grid grid-cols-3 gap-2"
          role="listbox"
          aria-label="Parcel size"
          aria-required="true"
        >
          {PARCEL_SIZE_CATALOG.map((size) => {
            const Icon = parcelSizeIcons[size.id] ?? Package
            const selected = selectedSizeId === size.id
            return (
              <button
                key={size.id}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={`${size.name}, ${size.dimensions}, up to ${size.weight}`}
                title={`${size.dimensions} · up to ${size.weight}`}
                onClick={() => onSelectedSizeIdChange(size.id)}
                className={`relative flex min-h-[112px] w-full flex-col items-center justify-center rounded-xl border px-2.5 py-4 text-center transition-colors sm:min-h-[118px] ${
                  selected
                    ? 'border-2 border-hubbed-orange bg-hubbed-orange-tint'
                    : 'border border-border-light bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-hubbed-orange text-white">
                    <Check className="size-2.5" strokeWidth={3} aria-hidden />
                  </span>
                )}
                <span
                  className={`mb-2.5 flex size-11 items-center justify-center rounded-lg border bg-white ${
                    selected ? 'border-hubbed-orange' : 'border-border-light'
                  }`}
                >
                  <Icon
                    className={`size-5 ${selected ? 'text-hubbed-orange' : 'text-gray-800'}`}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </span>
                <span className="text-sm font-bold leading-tight text-black">{size.name}</span>
                <span className="mt-1 text-xs leading-tight text-text-muted">
                  Up to <span className="font-bold text-black">{size.weight}</span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section
        className="shrink-0 rounded-lg border border-border-light bg-white p-2.5 sm:p-3"
        aria-labelledby="parcel-packaging-heading"
      >
        <p
          id="parcel-packaging-heading"
          className="mb-2 text-xs font-medium leading-snug text-text-muted sm:text-sm"
        >
          Does the customer need packaging?
          <span className="text-red-600"> *</span>
          <span className="mt-0.5 block font-normal">
            (Adds a flat <span className="font-bold text-black">$3.00</span> packaging fee)
          </span>
        </p>
        <div
          id="packaging-choice"
          className="grid grid-cols-2 gap-1.5"
          role="radiogroup"
          aria-label="Customer needs packaging"
          aria-required="true"
        >
          <button
            type="button"
            role="radio"
            aria-checked={needsPackaging === true}
            onClick={() => onNeedsPackagingChange(true)}
            className={compactSegmentButtonClassName(needsPackaging === true)}
          >
            Yes
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={needsPackaging === false}
            onClick={() => onNeedsPackagingChange(false)}
            className={compactSegmentButtonClassName(needsPackaging === false)}
          >
            No
          </button>
        </div>
      </section>
    </div>
  )
}
