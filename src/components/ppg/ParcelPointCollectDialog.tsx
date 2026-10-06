import {
  Bookmark,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { PARCELPOINT_STORES } from './parcelPointStores'

export { PARCELPOINT_STORES }

const MAP_PINS = [
  { top: '18%', left: '42%' },
  { top: '28%', left: '55%' },
  { top: '35%', left: '38%' },
  { top: '45%', left: '48%' },
  { top: '52%', left: '62%' },
  { top: '40%', left: '72%' },
  { top: '58%', left: '35%' },
  { top: '48%', left: '28%' },
  { top: '62%', left: '52%' },
  { top: '32%', left: '68%' },
  { top: '55%', left: '44%' },
] as const

const DISTANCE_OPTIONS = ['2 km', '5 km', '10 km'] as const
type DistanceOption = (typeof DISTANCE_OPTIONS)[number]

function DistanceRadiusDropdown({
  value,
  onChange,
}: {
  value: DistanceOption
  onChange: (value: DistanceOption) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-border-light bg-white px-4 py-2.5 text-sm font-medium text-black"
      >
        {value}
        <ChevronDown
          className={`size-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Search radius"
          className="absolute right-0 z-30 mt-1 min-w-[7.5rem] overflow-hidden rounded-xl border border-border-light bg-white py-1.5 shadow-lg"
        >
          {DISTANCE_OPTIONS.map((option) => {
            const isSelected = option === value
            return (
              <li key={option} role="presentation" className="px-1.5">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-black transition-colors ${
                    isSelected ? 'bg-hubbed-orange-tint' : 'hover:bg-gray-50'
                  }`}
                >
                  {option}
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-black" strokeWidth={2.5} aria-hidden />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

interface ParcelPointCollectDialogProps {
  open: boolean
  onClose: () => void
  onSelectStore?: (storeId: string) => void
}

export function ParcelPointCollectDialog({
  open,
  onClose,
  onSelectStore,
}: ParcelPointCollectDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [search, setSearch] = useState('')
  const [distanceRadius, setDistanceRadius] = useState<DistanceOption>('2 km')

  useEffect(() => {
    if (!open) {
      setSearch('')
      setDistanceRadius('2 km')
      return
    }

    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  const filteredStores = PARCELPOINT_STORES.filter((store) => {
    const q = search.trim().toLowerCase()
    if (!q) {
      return true
    }
    return (
      store.name.toLowerCase().includes(q) || store.address.toLowerCase().includes(q)
    )
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="parcelpoint-collect-title"
        className="flex max-h-[min(92vh,780px)] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-border-light px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-text-muted">COLLECT</p>
              <h2
                id="parcelpoint-collect-title"
                className="mt-1 text-xl font-bold text-black sm:text-2xl"
              >
                Collect from PARCELPOINT
              </h2>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-text-muted">
                <MapPin className="size-3.5 text-hubbed-orange" strokeWidth={2} aria-hidden />
                Bondi Junction 2022
              </span>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff0eb] text-hubbed-orange transition-colors hover:bg-[#ffe4d9]"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={2.5} aria-hidden />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
                strokeWidth={2}
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stores..."
                className="w-full rounded-lg border border-border-light py-2.5 pl-10 pr-4 text-sm text-black outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <DistanceRadiusDropdown value={distanceRadius} onChange={setDistanceRadius} />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <section
            aria-label="Map of nearby parcel points"
            className="relative min-h-[220px] flex-1 bg-[#e8ecef] lg:min-h-0"
          >
            <div
              className="absolute inset-0 bg-[linear-gradient(#d1d5db_1px,transparent_1px),linear-gradient(90deg,#d1d5db_1px,transparent_1px)] bg-size-[48px_48px] opacity-40"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-linear-to-br from-[#dbeafe]/50 via-transparent to-[#dcfce7]/40"
              aria-hidden
            />
            {MAP_PINS.map((pin, index) => (
              <span
                key={index}
                className="absolute flex size-7 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-[#1e293b] shadow-md"
                style={{ top: pin.top, left: pin.left }}
                aria-hidden
              >
                <MapPin className="size-3.5 text-white" strokeWidth={2} fill="white" />
              </span>
            ))}
            <div className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
              <span className="text-hubbed-orange">{MAP_PINS.length}</span>{' '}
              <span className="text-text-muted">on map</span>
            </div>
            <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-md border border-border-light bg-white shadow-sm">
              <button
                type="button"
                className="px-2.5 py-1 text-sm font-bold text-black hover:bg-gray-50"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                className="border-t border-border-light px-2.5 py-1 text-sm font-bold text-black hover:bg-gray-50"
                aria-label="Zoom out"
              >
                −
              </button>
            </div>
          </section>

          <section
            aria-labelledby="parcelpoint-nearby-stores-heading"
            className="flex w-full shrink-0 flex-col border-t border-border-light lg:w-[min(100%,380px)] lg:border-t-0 lg:border-l"
          >
            <div className="shrink-0 px-4 py-3 sm:px-5">
              <p
                id="parcelpoint-nearby-stores-heading"
                className="text-xs font-bold tracking-wide text-text-muted"
              >
                NEARBY STORES
              </p>
              <p className="text-sm font-semibold text-black">{filteredStores.length} available</p>
            </div>
            <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4 sm:px-5">
              {filteredStores.map((store) => (
                <li key={store.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStore?.(store.id)
                      onClose()
                    }}
                    className="flex w-full gap-3 rounded-xl border border-border-light bg-white p-3 text-left transition-colors hover:border-gray-300"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <MapPin className="size-4 text-rose-400" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-bold text-black">{store.name}</span>
                        <span className="shrink-0 text-xs font-semibold text-text-muted">
                          {store.distance}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs text-text-muted">{store.address}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="font-bold text-green-600">OPEN</span>
                        <Clock className="size-3 text-text-muted" aria-hidden />
                        <span className="text-text-muted">{store.hours}</span>
                      </span>
                    </span>
                    <Bookmark
                      className={`size-4 shrink-0 ${
                        store.bookmarked
                          ? 'fill-hubbed-orange text-hubbed-orange'
                          : 'text-gray-300'
                      }`}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
