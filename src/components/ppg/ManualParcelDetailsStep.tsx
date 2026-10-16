import type { LucideIcon } from 'lucide-react'
import { Boxes, Briefcase, ChevronLeft, ChevronRight, Package, ShoppingBag } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { ManualDeliveryAddressStep } from './ManualDeliveryAddressStep'
import { ManualFieldLabel } from './manualFormShared'
import {
  CARRY_ON_PARCEL_SIZE_ID,
  getManualParcelSizesForBooking,
  type DeliveryMethod,
} from './manualBookingState'

const manualParcelSizes = getManualParcelSizesForBooking()

const parcelSizeIcons: Record<string, LucideIcon> = {
  satchel: ShoppingBag,
  shoebox: Package,
  briefcase: Briefcase,
  'carry-on': Boxes,
}

function formatDimensionsForDisplay(dimensions: string) {
  return dimensions.replace(/×/g, 'x')
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
  onNeedsPackagingChange: (value: boolean | null) => void
  receiverAddress: string
  onReceiverAddressChange: (value: string) => void
  deliveryMethod: DeliveryMethod
}

export function ManualParcelDetailsStep({
  selectedSizeId,
  onSelectedSizeIdChange,
  needsPackaging,
  onNeedsPackagingChange,
  receiverAddress,
  onReceiverAddressChange,
  deliveryMethod,
}: ManualParcelDetailsStepProps) {
  const showPackagingQuestion = selectedSizeId !== CARRY_ON_PARCEL_SIZE_ID
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) {
      return
    }
    const card = el.querySelector<HTMLElement>('[data-parcel-size-card]')
    const step = card ? card.offsetWidth + 12 : el.clientWidth * 0.75
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' })
  }, [])

  function selectSize(sizeId: string) {
    onSelectedSizeIdChange(sizeId)
    if (sizeId === CARRY_ON_PARCEL_SIZE_ID) {
      onNeedsPackagingChange(false)
    } else if (selectedSizeId === CARRY_ON_PARCEL_SIZE_ID) {
      onNeedsPackagingChange(null)
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <section
        className="shrink-0 rounded-lg border border-border-light bg-white p-2.5 sm:p-3"
        aria-labelledby="parcel-size-heading"
      >
        <ManualFieldLabel htmlFor="parcel-size-grid" id="parcel-size-heading" required>
          Size
        </ManualFieldLabel>
        <div className="relative flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-white text-hubbed-orange shadow-sm transition-colors hover:bg-gray-50 sm:size-10"
            aria-label="Show previous parcel sizes"
            onClick={() => scrollCarousel('left')}
          >
            <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden />
          </button>
          <div
            ref={scrollRef}
            id="parcel-size-grid"
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="listbox"
            aria-label="Parcel size"
            aria-required="true"
          >
            {manualParcelSizes.map((size) => {
              const Icon = parcelSizeIcons[size.id] ?? Package
              const selected = selectedSizeId === size.id
              return (
                <button
                  key={size.id}
                  type="button"
                  data-parcel-size-card
                  role="option"
                  aria-selected={selected}
                  aria-label={`${size.name}, ${size.dimensions}, up to ${size.weight}`}
                  onClick={() => selectSize(size.id)}
                  className={`relative flex w-[7.25rem] shrink-0 snap-start flex-col items-center rounded-2xl border px-2.5 py-4 text-center transition-colors sm:w-[7.75rem] sm:px-3 sm:py-[1.125rem] ${
                    selected
                      ? 'border-2 border-hubbed-orange bg-hubbed-orange-tint'
                      : 'border border-border-light bg-white hover:border-gray-300'
                  }`}
                >
                  <span
                    className={`mb-3 flex size-11 items-center justify-center rounded-xl border bg-white ${
                      selected ? 'border-hubbed-orange' : 'border-border-light'
                    }`}
                  >
                    <Icon className="size-5 text-gray-900" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="text-sm font-bold leading-tight text-black">{size.name}</span>
                  <span className="mt-1.5 text-[11px] leading-tight text-text-muted sm:text-xs">
                    {formatDimensionsForDisplay(size.dimensions)}
                  </span>
                  <span className="mt-1.5 text-[11px] leading-tight text-text-muted sm:text-xs">
                    Up to <span className="font-bold text-black">{size.weight}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-white text-hubbed-orange shadow-sm transition-colors hover:bg-gray-50 sm:size-10"
            aria-label="Show next parcel sizes"
            onClick={() => scrollCarousel('right')}
          >
            <ChevronRight className="size-5" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      </section>

      {showPackagingQuestion ? (
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
              (Adds a flat <span className="font-bold text-black">$2.00</span> packaging fee)
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
      ) : null}

      <ManualDeliveryAddressStep
        address={receiverAddress}
        onAddressChange={onReceiverAddressChange}
        deliveryMethod={deliveryMethod}
      />
    </div>
  )
}
