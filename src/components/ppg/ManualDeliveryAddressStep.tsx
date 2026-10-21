import { MapPin, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ManualFieldLabel, manualInputClassName } from './manualFormShared'
import {
  BOOKING_CHARGE_AMOUNTS,
  formatBookingAmount,
  type DeliveryMethod,
} from './manualBookingState'

const mockAddresses = [
  '15/37 Nicholson St, Balmain East NSW 2041',
  '42 Nicholson Street, Fitzroy VIC 3065',
  '8/120 Nicholson Parade, Cronulla NSW 2230',
  '100 George St, Sydney NSW 2000',
  '25 Martin Place, Sydney NSW 2000',
  '1 Macquarie St, Sydney NSW 2000',
  '88 Crown St, Surry Hills NSW 2010',
  '500 Collins St, Melbourne VIC 3000',
  '200 Adelaide St, Brisbane QLD 4000',
  '15 Pirie St, Adelaide SA 5000',
] as const

function filterAddresses(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) {
    return []
  }
  return mockAddresses.filter((line) => line.toLowerCase().includes(q)).slice(0, 8)
}

function AddressSearchInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = 'receiver-address-suggestions'

  const suggestions = useMemo(() => filterAddresses(value), [value])
  const showDropdown = open && value.trim().length > 0

  useEffect(() => {
    setActiveIndex(suggestions.length > 0 ? 0 : -1)
  }, [value, suggestions.length])

  useEffect(() => {
    if (!showDropdown) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [showDropdown])

  const selectSuggestion = (line: string) => {
    onChange(line)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-gray-500 sm:left-3.5 sm:size-5"
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        id="receiver-address"
        type="search"
        value={value}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          showDropdown && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
        }
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => {
          if (value.trim()) {
            setOpen(true)
          }
        }}
        onKeyDown={(e) => {
          if (!showDropdown || suggestions.length === 0) {
            return
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => (i + 1) % suggestions.length)
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
          } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault()
            selectSuggestion(suggestions[activeIndex])
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        placeholder="Search address"
        autoComplete="off"
        className={`${manualInputClassName} py-2.5 !pl-11 !pr-3.5 text-sm sm:!pl-12 sm:!pr-4 sm:text-base`}
      />

      {showDropdown && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-border-light bg-white py-1 shadow-lg"
        >
          {suggestions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-text-muted" role="presentation">
              No matching addresses
            </li>
          ) : (
            suggestions.map((line, index) => {
              const highlighted = index === activeIndex
              return (
                <li key={line} role="presentation">
                  <button
                    id={`${listId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={highlighted}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectSuggestion(line)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      highlighted ? 'bg-hubbed-orange-tint' : ''
                    }`}
                  >
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-text-muted"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="text-sm text-black sm:text-base">{line}</span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}

function DeliveryBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f9fafb] px-2 py-0.5 text-[11px] font-normal leading-snug text-gray-600 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:px-2.5 sm:py-1 sm:text-xs">
      {children}
    </span>
  )
}

const DOOR_DELIVERY_ROUTES = [
  {
    id: 'atl' as const,
    areaLabel: 'Bondi Junction 2022',
    badge: 'Straight to door - ATL delivery',
    defaultAddress: '25 Spring St, Bondi Junction NSW 2022',
  },
  {
    id: 'atl-only' as const,
    areaLabel: 'Bondi Beach 2026',
    badge: 'Straight to door - ATL/Signature on Delivery available',
    defaultAddress: '12 Hall St, Bondi Beach NSW 2026',
  },
] as const

interface ManualDeliveryAddressStepProps {
  address: string
  onAddressChange: (value: string) => void
  deliveryMethod: DeliveryMethod
  deliverySelected: boolean
  onDeliverySelectedChange: (selected: boolean) => void
}

export function ManualDeliveryAddressStep({
  address,
  onAddressChange,
  deliveryMethod,
  deliverySelected,
  onDeliverySelectedChange,
}: ManualDeliveryAddressStepProps) {
  const activeRoute =
    DOOR_DELIVERY_ROUTES.find((route) => route.id === deliveryMethod) ??
    DOOR_DELIVERY_ROUTES[0]
  const doorFooterAddress = address.trim() || activeRoute.defaultAddress

  return (
    <div className="flex flex-col gap-4">
      <div aria-labelledby="receiver-address-label">
        <ManualFieldLabel htmlFor="receiver-address" id="receiver-address-label">
          Receiver Address
        </ManualFieldLabel>
        <AddressSearchInput value={address} onChange={onAddressChange} />
      </div>

      <button
        type="button"
        aria-label="Delivery method"
        aria-pressed={deliverySelected}
        onClick={() => onDeliverySelectedChange(true)}
        className={`relative w-full rounded-lg p-2.5 text-left transition-colors sm:p-3 ${
          deliverySelected
            ? 'border-2 border-hubbed-orange bg-hubbed-orange-tint'
            : 'border border-border-light bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border-light bg-white text-lg leading-none"
            aria-hidden
          >
            🏠
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-black sm:text-base">Deliver to Door</p>
                <p className="text-xs text-text-muted sm:text-sm">{activeRoute.areaLabel}</p>
              </div>
              <p className="shrink-0 text-sm font-bold text-black sm:text-base">
                {formatBookingAmount(BOOKING_CHARGE_AMOUNTS.delivery)}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <DeliveryBadge>
                <span className="text-sm leading-none" aria-hidden>
                  🏠
                </span>
                {activeRoute.badge}
              </DeliveryBadge>
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex flex-col gap-1 border-t border-border-light pt-2 text-xs text-text-muted sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:text-sm">
          <span className="min-w-0 text-left leading-snug">{doorFooterAddress}</span>
          <span className="shrink-0 sm:text-right">
            Delivered by <span className="font-bold text-black">Mon, 12 Oct</span>
          </span>
        </div>
      </button>
    </div>
  )
}
