import { HelpBubble } from '../components/return-parcel/HelpBubble'
import { ParcelHistoryRow, type ParcelRecord } from '../components/return-parcel/ParcelHistoryRow'
import { SearchParcels } from '../components/return-parcel/SearchParcels'

const mockHistory: ParcelRecord[] = [
  {
    customerName: 'Sadrush Chilukuri',
    method: 'PARCELPOINT GO Dropoff',
    parcelId: 'MP8021760051',
    itemCode: 'PGAAAAR43',
    status: 'Awaiting consumer dropoff',
    consRef: 'SCPT001',
    itemRef: 'SCPT001',
    bookedAt: '21/09/2026 3:37 PM',
  },
]

export function ReturnParcelContent() {
  return (
    <>
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="rounded-sm border border-border-light bg-white p-4 sm:p-6 lg:p-8">
          <SearchParcels />

          <section className="mt-8 sm:mt-10">
            <h2 className="mb-3 text-base font-bold text-black sm:mb-4 sm:text-lg">History</h2>
            <div className="overflow-hidden rounded-sm border border-border-light">
              {mockHistory.map((parcel) => (
                <ParcelHistoryRow key={parcel.parcelId} parcel={parcel} />
              ))}
            </div>
          </section>
        </div>
      </div>
      <HelpBubble />
    </>
  )
}
