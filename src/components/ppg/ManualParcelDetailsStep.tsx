import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Check,
  ChevronRight,
  Handbag,
  Luggage,
  Mail,
  Package,
  ShoppingBag,
} from 'lucide-react'
import { useState } from 'react'
import {
  ManualFieldLabel,
  ManualStepHeading,
} from './manualFormShared'

interface ParcelSizeOption {
  id: string
  name: string
  dimensions: string
  weight: string
  icon: LucideIcon
}

const parcelSizes: ParcelSizeOption[] = [
  { id: 'pouch', name: 'Pouch', dimensions: '20×10×5cm', weight: '250g', icon: ShoppingBag },
  { id: 'satchel', name: 'Satchel', dimensions: '25×15×5cm', weight: '500g', icon: Mail },
  { id: 'handbag', name: 'Handbag', dimensions: '25×15×10cm', weight: '1kg', icon: Handbag },
  { id: 'shoebox', name: 'Shoebox', dimensions: '30×25×15cm', weight: '3kg', icon: Package },
  { id: 'briefcase', name: 'Briefcase', dimensions: '40×30×15cm', weight: '5kg', icon: Briefcase },
  { id: 'carry-on', name: 'Carry On', dimensions: '55×40×20cm', weight: '12kg', icon: Luggage },
]

export function ManualParcelDetailsStep() {
  const [selectedSizeId, setSelectedSizeId] = useState('handbag')
  const [needsPackaging, setNeedsPackaging] = useState(true)

  return (
    <div>
      <ManualStepHeading step={1} title="Parcel Details" />

      <div className="mb-8">
        <ManualFieldLabel htmlFor="parcel-size-scroll">Size</ManualFieldLabel>
        <div className="relative">
          <div
            id="parcel-size-scroll"
            className="flex gap-3 overflow-x-auto pb-2 pr-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  className={`relative flex w-[108px] shrink-0 flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors sm:w-[118px] ${
                    selected
                      ? 'border-hubbed-orange bg-[#fff4e8]'
                      : 'border-border-light bg-white hover:border-gray-300'
                  }`}
                >
                  {selected && (
                    <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-hubbed-orange text-white">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                  )}
                  <Icon
                    className="mb-2 size-8 text-gray-700"
                    strokeWidth={1.5}
                    aria-hidden
                  />
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
          <div
            className="pointer-events-none absolute right-0 top-0 flex h-full w-10 items-center justify-end bg-gradient-to-l from-white to-transparent"
            aria-hidden
          >
            <ChevronRight className="size-5 text-gray-400" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-3 text-sm font-medium text-text-muted">
          Does the customer need packaging? (store offers it)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setNeedsPackaging(true)}
            className={`rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors sm:py-4 sm:text-base ${
              needsPackaging
                ? 'bg-[#2b2f36] text-white'
                : 'border border-border-light bg-white text-text-muted hover:border-gray-300'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setNeedsPackaging(false)}
            className={`rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors sm:py-4 sm:text-base ${
              !needsPackaging
                ? 'bg-[#2b2f36] text-white'
                : 'border border-border-light bg-white text-text-muted hover:border-gray-300'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {needsPackaging && (
        <p className="mb-6 rounded-xl bg-[#eef2ff] px-4 py-4 text-center text-sm leading-snug text-[#3730a3] sm:text-base">
          Adds a flat <span className="font-bold">$3.00</span> packaging fee to the total.
        </p>
      )}

    </div>
  )
}
