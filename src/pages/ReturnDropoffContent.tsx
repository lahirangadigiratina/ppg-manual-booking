import { MoreVertical, Printer } from 'lucide-react'
import { useState } from 'react'
import { HelpBubble } from '../components/return-parcel/HelpBubble'
import { PackageParcelReminderDialog } from '../components/return-parcel/PackageParcelReminderDialog'
import { SearchParcels } from '../components/return-parcel/SearchParcels'
import {
  manualPrimaryButtonClassName,
  manualSecondaryButtonClassName,
} from '../components/ppg/manualFormShared'

const DROPOFF_PARCEL = {
  name: 'Jordan Kumar',
  retailer: 'PPG Drop-off',
  listRetailer: 'AU SHEIN Returns',
  consignmentId: 'MP8032101040',
  itemId: 'HCJDGZZG9',
  status: 'Awaiting consumer dropoff',
  carrier: 'Aramex-Bulk',
}

const CONFIRMED_PARCEL = {
  customerName: 'Hashan A',
  retailer: 'Foxtel Returns',
  consignmentId: 'MP8032100940',
  itemId: 'HPZGMZMC3',
  status: 'Awaiting courier collection',
  carrier: 'Aramex-Bulk',
  consRef: '--',
  itemRef: '--',
  bookedAt: '2026-10-09 10:41 AM',
  droppedOffAt: '2026-10-09 10:42 AM',
}

export function ReturnDropoffContent() {
  const [confirmOpen, setConfirmOpen] = useState(true)
  const [packagingReminderOpen, setPackagingReminderOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) {
    return (
      <>
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="rounded-sm border border-border-light bg-white p-4 sm:p-6 lg:p-8">
            <SearchParcels
              initialQuery=""
              placeholder="Consignment ID, Item ID, Name, Customer, Partner, Reference Number"
            />

            <section className="mt-8 sm:mt-10">
              <h2 className="mb-3 text-base font-bold text-black sm:mb-4 sm:text-lg">History</h2>
              <div className="overflow-x-auto rounded-sm border border-border-light">
                <article className="bg-white">
                  <div className="flex flex-col gap-4 p-4 sm:p-5 xl:flex-row xl:items-center xl:gap-4 xl:py-4">
                    <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.7fr)_15.5rem] xl:gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-black">
                          {CONFIRMED_PARCEL.customerName}
                        </p>
                        <p className="mt-0.5 text-xs text-text-muted">
                          {CONFIRMED_PARCEL.retailer}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-black">
                          {CONFIRMED_PARCEL.consignmentId}
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-black">
                          Item: {CONFIRMED_PARCEL.itemId}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-black">{CONFIRMED_PARCEL.status}</p>
                        <p className="mt-0.5 text-xs text-black">{CONFIRMED_PARCEL.carrier}</p>
                      </div>
                      <div className="min-w-0 text-xs font-bold text-black">
                        <p>Cons Ref: {CONFIRMED_PARCEL.consRef}</p>
                        <p className="mt-0.5">Item Ref: {CONFIRMED_PARCEL.itemRef}</p>
                      </div>
                      <div className="min-w-[15.5rem] text-xs text-black">
                        <p className="whitespace-nowrap">
                          <span className="font-bold">Booked:</span> {CONFIRMED_PARCEL.bookedAt}
                        </p>
                        <p className="mt-0.5 whitespace-nowrap">
                          <span className="font-bold">Dropped Off:</span>{' '}
                          {CONFIRMED_PARCEL.droppedOffAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        className="flex size-10 items-center justify-center rounded border border-border-light bg-white text-black hover:bg-gray-50"
                        aria-label="Print label"
                      >
                        <Printer className="size-5" strokeWidth={1.75} />
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
              </div>
            </section>
          </div>
        </div>
        <HelpBubble />
      </>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="rounded-sm border border-border-light bg-white p-4 sm:p-6 lg:p-8">
          <SearchParcels initialQuery={DROPOFF_PARCEL.consignmentId} />

          <section className="mt-8 sm:mt-10">
            <h2 className="mb-3 text-base font-bold text-black sm:mb-4 sm:text-lg">
              Returns / Dropoff
            </h2>
            <div className="overflow-hidden rounded-sm border border-border-light">
              <article className="flex flex-col gap-4 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-black">{DROPOFF_PARCEL.name}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {DROPOFF_PARCEL.listRetailer}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-black">
                      {DROPOFF_PARCEL.consignmentId}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-black">
                      Item: {DROPOFF_PARCEL.itemId}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-black">{DROPOFF_PARCEL.status}</p>
                    <p className="mt-0.5 text-xs text-black">{DROPOFF_PARCEL.carrier}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded border border-border-light bg-white text-black hover:bg-gray-50"
                    aria-label="Print label"
                  >
                    <Printer className="size-5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    className="rounded-md bg-hubbed-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-hubbed-orange-hover sm:px-5"
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
              </article>
            </div>
          </section>
        </div>
      </div>
      <HelpBubble />
      {confirmOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dropoff-title"
            className="w-full max-w-md rounded-lg border border-border-light bg-white p-5 shadow-xl sm:p-6"
          >
            <h2
              id="confirm-dropoff-title"
              className="text-center text-base font-bold text-black sm:text-lg"
            >
              Please confirm parcel dropoff
            </h2>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-md bg-gray-100 px-4 py-4 text-sm">
              <dt className="text-text-muted">Name :</dt>
              <dd className="text-right font-semibold text-black">{DROPOFF_PARCEL.name}</dd>
              <dt className="text-text-muted">Consignment ID :</dt>
              <dd className="text-right font-semibold text-black">
                {DROPOFF_PARCEL.consignmentId}
              </dd>
              <dt className="text-text-muted">Item ID :</dt>
              <dd className="text-right font-semibold text-black">{DROPOFF_PARCEL.itemId}</dd>
              <dt className="text-text-muted">Retailer</dt>
              <dd className="text-right font-semibold text-black">{DROPOFF_PARCEL.retailer}</dd>
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className={`w-full ${manualSecondaryButtonClassName}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false)
                  setPackagingReminderOpen(true)
                }}
                className={`w-full ${manualPrimaryButtonClassName}`}
              >
                Confirm Dropoff
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <PackageParcelReminderDialog
        open={packagingReminderOpen}
        onContinue={() => {
          setPackagingReminderOpen(false)
          setConfirmed(true)
        }}
        onGoBack={() => {
          setPackagingReminderOpen(false)
          setConfirmOpen(true)
        }}
      />
    </>
  )
}
