import type { LucideIcon } from 'lucide-react'
import {
  Boxes,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Handbag,
  Mail,
  Package,
  ShoppingBag,
} from 'lucide-react'
import { useRef } from 'react'
import {
  ManualFieldLabel,
  manualSegmentButtonClassName,
} from './manualFormShared'
import { PARCEL_SIZE_CATALOG } from './manualBookingState'

const parcelSizeIcons: Record<string, LucideIcon> = {
  pouch: Mail,
  satchel: ShoppingBag,
  handbag: Handbag,
  shoebox: Package,
  briefcase: Briefcase,
  'carry-on': Boxes,
}

function formatDimensionsForDisplay(dimensions: string) {
  return dimensions.replace(/×/g, ' × ')
}

const PARCEL_CARD_SCROLL_PX = 168

interface ManualParcelDetailsStepProps {
  selectedSizeId: string
  onSelectedSizeIdChange: (id: string) => void
  needsPackaging: boolean
  onNeedsPackagingChange: (value: boolean) => void
}

export function ManualParcelDetailsStep({
  selectedSizeId,
  onSelectedSizeIdChange,
  needsPackaging,
  onNeedsPackagingChange,
}: ManualParcelDetailsStepProps) {
  const sizeScrollRef = useRef<HTMLDivElement>(null)

  const scrollParcelSizes = (direction: 'left' | 'right') => {
    const el = sizeScrollRef.current
    if (!el) {
      return
    }
    el.scrollBy({
      left: direction === 'left' ? -PARCEL_CARD_SCROLL_PX : PARCEL_CARD_SCROLL_PX,
      behavior: 'smooth',
    })
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <section className="shrink-0 pb-4" aria-labelledby="parcel-size-heading">
        <ManualFieldLabel htmlFor="parcel-size-grid" id="parcel-size-heading">
          Size
        </ManualFieldLabel>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => scrollParcelSizes('left')}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-white shadow-sm transition-colors hover:bg-gray-50"
            aria-label="Show previous parcel sizes"
          >
            <ChevronLeft className="size-5 text-hubbed-orange" strokeWidth={2.5} aria-hidden />
          </button>

          <div
            ref={sizeScrollRef}
            className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              id="parcel-size-grid"
              className="flex w-max gap-3 py-0.5 pr-1"
              role="listbox"
              aria-label="Parcel size"
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
                    onClick={() => onSelectedSizeIdChange(size.id)}
                    className={`relative flex w-[132px] shrink-0 flex-col items-center rounded-2xl border px-3 py-4 text-center transition-colors sm:w-[140px] ${
                      selected
                        ? 'border-2 border-hubbed-orange bg-hubbed-orange-tint'
                        : 'border border-border-light bg-white hover:border-gray-300'
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full bg-hubbed-orange text-white shadow-sm">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                    )}
                    <span
                      className={`mb-3 flex size-12 items-center justify-center rounded-xl border bg-white ${
                        selected ? 'border-hubbed-orange' : 'border-border-light'
                      }`}
                    >
                      <Icon
                        className={`size-6 ${selected ? 'text-hubbed-orange' : 'text-gray-800'}`}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                    <span className="text-sm font-bold text-black">{size.name}</span>
                    <span className="mt-1 text-[11px] leading-snug text-text-muted">
                      {formatDimensionsForDisplay(size.dimensions)}
                    </span>
                    <span className="mt-1 text-[11px] text-text-muted">
                      Up to{' '}
                      <span className="font-bold text-black">{size.weight}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollParcelSizes('right')}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-white shadow-sm transition-colors hover:bg-gray-50"
            aria-label="Show more parcel sizes"
          >
            <ChevronRight className="size-5 text-hubbed-orange" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </section>

      <section
        className="mt-4 shrink-0 rounded-xl border border-border-light bg-white p-4 sm:p-5"
        aria-labelledby="parcel-packaging-heading"
      >
        <div
          id="parcel-packaging-heading"
          className="mb-3 space-y-1 text-sm font-medium leading-snug text-text-muted"
        >
          <p>Does the customer need packaging?</p>
          <p className="font-normal">
            (Adds a flat <span className="font-bold text-black">$3.00</span> packaging fee to the
            total)
          </p>
        </div>
        <div
          id="packaging-choice"
          className="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-label="Customer needs packaging"
        >
          <button
            type="button"
            onClick={() => onNeedsPackagingChange(true)}
            className={manualSegmentButtonClassName(needsPackaging)}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => onNeedsPackagingChange(false)}
            className={manualSegmentButtonClassName(!needsPackaging)}
          >
            No
          </button>
        </div>
      </section>
    </div>
  )
}
