import { Search, X } from 'lucide-react'
import { useState } from 'react'

export function SearchParcels() {
  const [query, setQuery] = useState('MP8021760051')

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
            className="w-full rounded-md border border-gray-300 bg-white py-3 pl-4 pr-20 text-sm text-black shadow-sm outline-none transition-shadow placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:py-3.5 sm:text-base"
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
            <Search className="size-5 text-gray-600" strokeWidth={1.75} aria-hidden />
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
    </section>
  )
}
