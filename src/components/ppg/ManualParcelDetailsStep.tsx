import type { LucideIcon } from 'lucide-react'
import {
  Boxes,
  Briefcase,
  Check,
  Handbag,
  Luggage,
  Mail,
  Package,
  PackageOpen,
  ShoppingBag,
} from 'lucide-react'
import { useState } from 'react'
import {
  ManualFieldLabel,
  manualSegmentButtonClassName,
} from './manualFormShared'

interface ParcelSizeOption {
  id: string
  name: string
  dimensions: string
  weight: string
  icon: LucideIcon
}

const parcelSizes: ParcelSizeOption[] = [
  { id: 'pouch', name: 'Pouch', dimensions: '20×10×5 cm', weight: '250g', icon: Mail },
  { id: 'satchel', name: 'Satchel', dimensions: '25×15×5 cm', weight: '500g', icon: ShoppingBag },
  { id: 'handbag', name: 'Handbag', dimensions: '25×15×10 cm', weight: '1kg', icon: Handbag },
  { id: 'shoebox', name: 'Shoebox', dimensions: '30×25×15 cm', weight: '3kg', icon: Package },
  { id: 'briefcase', name: 'Briefcase', dimensions: '40×30×15 cm', weight: '5kg', icon: Briefcase },
  { id: 'carry-on', name: 'Carry On', dimensions: '55×40×20 cm', weight: '12kg', icon: Boxes },
  { id: 'large-box', name: 'Large Box', dimensions: '60×40×25 cm', weight: '15kg', icon: Package },
  { id: 'suitcase', name: 'Suitcase', dimensions: '70×45×25 cm', weight: '20kg', icon: Luggage },
  {
    id: 'heavy-crate',
    name: 'Heavy Crate',
    dimensions: '75×45×29 cm',
    weight: '25kg',
    icon: PackageOpen,
  },
]

export function ManualParcelDetailsStep() {
  const [selectedSizeId, setSelectedSizeId] = useState('shoebox')
  const [needsPackaging, setNeedsPackaging] = useState(true)

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <section
        className="min-h-0 flex-1 overflow-y-auto pb-4"
        aria-labelledby="parcel-size-heading"
      >
        <ManualFieldLabel htmlFor="parcel-size-grid" id="parcel-size-heading">
          Size
        </ManualFieldLabel>
        <div
          id="parcel-size-grid"
          className="grid grid-cols-3 gap-3"
          role="listbox"
          aria-label="Parcel size"
        >
          {parcelSizes.map((size) => {
            const Icon = size.icon
            const selected = selectedSizeId === size.id
            return (
              <button
                key={size.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => setSelectedSizeId(size.id)}
                className={`relative flex min-w-0 flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors ${
                  selected
                    ? 'border-2 border-hubbed-orange bg-hubbed-orange-tint'
                    : 'border border-border-light bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-hubbed-orange text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                )}
                <span
                  className={`mb-2 flex size-11 items-center justify-center rounded-lg border bg-white ${
                    selected ? 'border-hubbed-orange' : 'border-border-light'
                  }`}
                >
                  <Icon
                    className="size-6 text-hubbed-orange"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </span>
                <span className="text-sm font-bold text-black">{size.name}</span>
                <span className="mt-1 text-[10px] leading-tight text-text-muted sm:text-xs">
                  {size.dimensions}
                </span>
                <span className="mt-0.5 text-[10px] text-text-muted sm:text-xs">
                  Up to{' '}
                  <span className="font-semibold text-black">{size.weight}</span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section
        className="mt-4 shrink-0 rounded-xl border border-border-light bg-white p-4 sm:p-5"
        aria-labelledby="parcel-packaging-heading"
      >
        <p
          id="parcel-packaging-heading"
          className="mb-3 text-sm font-medium leading-snug text-text-muted"
        >
          Does the customer need packaging? (
          <span className="font-normal">
            Adds a flat <span className="font-bold text-black">$3.00</span> packaging fee to the
            total
          </span>
          )
        </p>
        <div
          id="packaging-choice"
          className="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-label="Customer needs packaging"
        >
          <button
            type="button"
            onClick={() => setNeedsPackaging(true)}
            className={manualSegmentButtonClassName(needsPackaging)}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setNeedsPackaging(false)}
            className={manualSegmentButtonClassName(!needsPackaging)}
          >
            No
          </button>
        </div>
      </section>
    </div>
  )
}
