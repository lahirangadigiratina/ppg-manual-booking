import type { LucideIcon } from 'lucide-react'
import { Boxes, Briefcase, Package, ShoppingBag } from 'lucide-react'
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

function compactSegmentButtonClassName(active: boolean) {
  return `w-full rounded-md px-3 py-1.5 text-xs font-semibold transition-colors sm:py-2 sm:text-sm ${
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

  function selectSize(sizeId: string) {
    onSelectedSizeIdChange(sizeId)
    if (sizeId === CARRY_ON_PARCEL_SIZE_ID) {
      onNeedsPackagingChange(false)
    } else if (selectedSizeId === CARRY_ON_PARCEL_SIZE_ID) {
      onNeedsPackagingChange(null)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="shrink-0" aria-labelledby="parcel-size-heading">
        <ManualFieldLabel htmlFor="parcel-size-grid" id="parcel-size-heading" required>
          Size
        </ManualFieldLabel>
        <div
          id="parcel-size-grid"
          className="grid w-full grid-cols-2 gap-1.5 sm:gap-2"
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
                role="option"
                aria-selected={selected}
                aria-label={`${size.name}, ${size.dimensions}, up to ${size.weight}`}
                onClick={() => selectSize(size.id)}
                className={`relative flex w-full flex-col items-center rounded-lg border px-1.5 py-2 text-center transition-colors sm:px-2 sm:py-2.5 ${
                  selected
                    ? 'border-2 border-hubbed-orange bg-hubbed-orange-tint'
                    : 'border border-border-light bg-white hover:border-gray-300'
                }`}
              >
                <span
                  className={`mb-1 flex size-8 items-center justify-center rounded-md border bg-white sm:size-9 ${
                    selected ? 'border-hubbed-orange' : 'border-border-light'
                  }`}
                >
                  <Icon className="size-4 text-gray-900" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="text-xs font-bold leading-tight text-black">{size.name}</span>
                <span className="mt-0.5 text-[10px] leading-tight text-text-muted sm:text-xs">
                  Up to <span className="font-bold text-black">{size.weight}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {showPackagingQuestion ? (
        <div className="shrink-0" aria-labelledby="parcel-packaging-heading">
          <p
            id="parcel-packaging-heading"
            className="mb-1.5 text-xs font-medium leading-snug text-text-muted"
          >
            Does the customer need packaging?
            <span className="text-red-600"> *</span>{' '}
            <span className="font-normal">
              (Adds <span className="font-bold text-black">$2.00</span>)
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
        </div>
      ) : null}

      <ManualDeliveryAddressStep
        address={receiverAddress}
        onAddressChange={onReceiverAddressChange}
        deliveryMethod={deliveryMethod}
      />
    </div>
  )
}
