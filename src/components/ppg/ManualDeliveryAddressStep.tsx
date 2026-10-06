import { Check, Home, MapPin, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ManualFieldLabel, manualInputClassName } from './manualFormShared'
import type { DeliveryMethod } from './manualBookingState'

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
        className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-gray-500"
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
        placeholder="15/37 Nicholson St, Balmain East"
        autoComplete="off"
        className={`${manualInputClassName} py-3.5 pl-12`}
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f9fafb] px-3 py-1.5 text-xs font-normal text-gray-600 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
      {children}
    </span>
  )
}

function DeliveryOptionCard({
  selected,
  onSelect,
  children,
}: {
  selected: boolean
  onSelect: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full rounded-xl p-4 text-left transition-colors sm:p-5 ${
        selected
          ? 'border-2 border-hubbed-orange bg-hubbed-orange-tint'
          : 'border border-border-light bg-white hover:border-gray-300'
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-hubbed-orange text-white">
          <Check className="size-3" strokeWidth={3} aria-hidden />
        </span>
      )}
      {children}
    </button>
  )
}

interface ManualDeliveryAddressStepProps {
  address: string
  onAddressChange: (value: string) => void
  deliveryMethod: DeliveryMethod
  onDeliveryMethodChange: (method: DeliveryMethod) => void
}

export function ManualDeliveryAddressStep({
  address,
  onAddressChange,
  deliveryMethod,
  onDeliveryMethodChange,
}: ManualDeliveryAddressStepProps) {
  const doorFooterAddress =
    address.trim() || '12 Hall St, Bondi Beach NSW 2026'

  return (
    <div>
      <div className="mb-5">
        <ManualFieldLabel htmlFor="receiver-address">Receiver Address</ManualFieldLabel>
        <AddressSearchInput value={address} onChange={onAddressChange} />
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Delivery method">
        <DeliveryOptionCard
          selected={deliveryMethod === 'door'}
          onSelect={() => onDeliveryMethodChange('door')}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border-light bg-white">
              <Home className="size-5 text-gray-700" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1 pr-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-bold text-black">Deliver to Door</p>
                  <p className="mt-0.5 text-sm text-text-muted">Bondi Beach 2026</p>
                </div>
                <p className="shrink-0 text-base font-bold text-black sm:text-lg">$11.50</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <DeliveryBadge>
                  <span className="text-sm leading-none" aria-hidden>
                    🏠
                  </span>
                  Straight to their door
                </DeliveryBadge>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-border-light pt-3 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span className="min-w-0 truncate">{doorFooterAddress}</span>
            <span className="shrink-0 sm:text-right">
              Delivered by <span className="font-bold text-black">Mon, 12 Oct</span>
            </span>
          </div>
        </DeliveryOptionCard>
      </div>
    </div>
  )
}
