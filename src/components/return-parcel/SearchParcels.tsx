import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDropoffLabelDialog } from './ConfirmDropoffLabelDialog'
import { ParcelDropoffConfirmDialog } from './ParcelDropoffConfirmDialog'
import { ReturnDropoffCashConfirmDialog } from './ReturnDropoffCashConfirmDialog'
import {
  resolveDirectParcelDropoffConfirmParcel,
  resolveDropoffDemoParcel,
  resolvePrintPreferenceParcel,
  type DropoffLabelParcelDemo,
} from './returnParcelDemo'

export function SearchParcels({
  initialQuery = 'MP8021760051',
  placeholder = '',
}: {
  initialQuery?: string
  placeholder?: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [cashConfirmOpen, setCashConfirmOpen] = useState(false)
  const [labelConfirmOpen, setLabelConfirmOpen] = useState(false)
  const [labelParcel, setLabelParcel] = useState<DropoffLabelParcelDemo | null>(null)
  const [labelDialogInitialStep, setLabelDialogInitialStep] = useState<1 | 2>(1)
  const [pendingDropoffParcel, setPendingDropoffParcel] =
    useState<DropoffLabelParcelDemo | null>(null)
  const [parcelDropoffConfirmOpen, setParcelDropoffConfirmOpen] = useState(false)

  const resetDropoffFlow = () => {
    setPendingDropoffParcel(null)
  }

  const tryOpenDialogForQuery = () => {
    const directConfirmParcel = resolveDirectParcelDropoffConfirmParcel(query)
    if (directConfirmParcel) {
      setPendingDropoffParcel(directConfirmParcel)
      setParcelDropoffConfirmOpen(true)
      return
    }
    const printPreferenceParcel = resolvePrintPreferenceParcel(query)
    if (printPreferenceParcel) {
      setPendingDropoffParcel(printPreferenceParcel)
      setCashConfirmOpen(true)
      return
    }
    const parcel = resolveDropoffDemoParcel(query)
    if (!parcel) {
      return
    }
    setPendingDropoffParcel(parcel)
    setCashConfirmOpen(true)
  }

  const openLabelDialog = (parcel: DropoffLabelParcelDemo, initialStep: 1 | 2 = 1) => {
    setLabelParcel(parcel)
    setLabelDialogInitialStep(initialStep)
    setLabelConfirmOpen(true)
  }

  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-black sm:mb-4 sm:text-lg">
        Search Parcels
      </h2>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
        <div className="relative min-w-0 flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                tryOpenDialogForQuery()
              }
            }}
            className="w-full rounded-md border border-gray-300 bg-white py-3 pl-4 pr-20 text-sm text-black shadow-sm outline-none transition-shadow placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:py-3.5 sm:text-base [&::-webkit-search-cancel-button]:appearance-none"
            placeholder={placeholder}
            aria-label="Search parcels"
          />
          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="rounded p-0.5 text-gray-500 hover:text-gray-800"
                aria-label="Clear search"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            )}
            <button
              type="button"
              onClick={() => tryOpenDialogForQuery()}
              className="rounded p-0.5 text-gray-600 hover:text-gray-900"
              aria-label="Search parcels"
            >
              <Search className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900 sm:min-w-[160px] sm:py-3.5 lg:min-w-[180px]"
        >
          Scan Barcode
        </button>
        <button
          type="button"
          className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900 sm:min-w-[160px] sm:py-3.5 lg:min-w-[180px]"
        >
          Scan QR Code
        </button>
      </div>
      <ParcelDropoffConfirmDialog
        open={parcelDropoffConfirmOpen}
        parcel={pendingDropoffParcel}
        onClose={() => {
          setParcelDropoffConfirmOpen(false)
          resetDropoffFlow()
        }}
        onConfirm={() => {
          setParcelDropoffConfirmOpen(false)
          resetDropoffFlow()
        }}
      />
      <ReturnDropoffCashConfirmDialog
        open={cashConfirmOpen}
        packagingIncludedLocked={Boolean(pendingDropoffParcel?.packagingPreIncluded)}
        onClose={() => {
          setCashConfirmOpen(false)
          resetDropoffFlow()
        }}
        onConfirm={() => {
          if (!pendingDropoffParcel) {
            return
          }
          const parcel = pendingDropoffParcel
          setCashConfirmOpen(false)
          if (resolvePrintPreferenceParcel(parcel.shipmentNumber)) {
            setParcelDropoffConfirmOpen(true)
            return
          }
          resetDropoffFlow()
          openLabelDialog(parcel, 1)
        }}
      />
      <ConfirmDropoffLabelDialog
        open={labelConfirmOpen}
        parcel={labelParcel}
        initialStep={labelDialogInitialStep}
        onClose={() => {
          setLabelConfirmOpen(false)
          setLabelParcel(null)
          setLabelDialogInitialStep(1)
        }}
      />
    </section>
  )
}
