import { MoreVertical, Printer } from 'lucide-react'

export interface ParcelRecord {
  customerName: string
  method: string
  parcelId: string
  itemCode: string
  status: string
  consRef: string
  itemRef: string
  bookedAt: string
}

interface ParcelHistoryRowProps {
  parcel: ParcelRecord
}

export function ParcelHistoryRow({ parcel }: ParcelHistoryRowProps) {
  return (
    <article className="border-b border-border-light bg-white last:border-b-0">
      <div className="flex flex-col gap-4 p-4 sm:p-5 xl:flex-row xl:items-center xl:gap-6 xl:py-4">
        <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-black">{parcel.customerName}</p>
            <p className="mt-0.5 text-xs text-text-muted sm:text-sm">{parcel.method}</p>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-black">{parcel.parcelId}</p>
            <p className="mt-0.5 text-xs text-text-muted sm:text-sm">Item: {parcel.itemCode}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-black">{parcel.status}</p>
          </div>
          <div className="min-w-0 text-xs text-black sm:text-sm">
            <p>Cons Ref: {parcel.consRef}</p>
            <p className="mt-0.5">Item Ref: {parcel.itemRef}</p>
          </div>
          <div className="min-w-0 text-xs text-black sm:text-sm">
            <p>
              <span className="font-bold">Booked:</span> {parcel.bookedAt}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3 xl:justify-end">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded border border-border-light bg-white text-black hover:bg-gray-50"
            aria-label="Print label"
          >
            <Printer className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="rounded-md bg-hubbed-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-hubbed-orange-hover sm:px-6 sm:py-3"
          >
            Confirm Dropoff
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded border border-border-light bg-white text-black hover:bg-gray-50"
            aria-label="More actions"
          >
            <MoreVertical className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </article>
  )
}
