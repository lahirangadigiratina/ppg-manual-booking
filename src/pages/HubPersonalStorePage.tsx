import { ChevronDown } from 'lucide-react'
import { HubProfileLayout } from '../components/layout/HubProfileLayout'
import {
  ManualFieldLabel,
  manualFlowStepTitleClassName,
} from '../components/ppg/manualFormShared'

/** Read-only hub location fields — light gray fill, subtle border, dark gray value text */
const hubLocationReadOnlyClassName =
  'w-full cursor-default rounded-md border border-[#d1d5db] bg-[#eceff2] px-3.5 py-2.5 text-sm font-semibold text-[#374151] outline-none read-only:focus:border-[#d1d5db] read-only:focus:ring-0 sm:px-4 sm:py-3 sm:text-base'

function HubProfileReadOnlySelectField({
  id,
  value,
}: {
  id: string
  value: string
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        readOnly
        tabIndex={-1}
        value={value}
        aria-readonly="true"
        className={`${hubLocationReadOnlyClassName} pr-10`}
      />
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#374151] sm:right-3.5 sm:size-5"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  )
}

export function HubPersonalStorePage() {
  return (
    <HubProfileLayout>
      <div className="rounded-sm border border-border-light bg-white p-3 sm:p-4 lg:p-5">
        <h1 id="location-details-heading" className={manualFlowStepTitleClassName}>
          Location Details
        </h1>

        <div
          className="mt-5 flex flex-col gap-4 sm:mt-6"
          role="group"
          aria-labelledby="location-details-heading"
        >
          <div>
            <ManualFieldLabel htmlFor="location-name" required>
              Location Name
            </ManualFieldLabel>
            <input
              id="location-name"
              type="text"
              readOnly
              tabIndex={-1}
              value="BP Wellington Point"
              aria-readonly="true"
              className={hubLocationReadOnlyClassName}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <ManualFieldLabel htmlFor="address-line-1" required>
                Address Line 1
              </ManualFieldLabel>
              <input
                id="address-line-1"
                type="text"
                readOnly
                tabIndex={-1}
                value="Cnr Main & Birkdale Rds"
                aria-readonly="true"
                className={hubLocationReadOnlyClassName}
              />
            </div>
            <div>
              <ManualFieldLabel htmlFor="address-line-2">Address Line 2</ManualFieldLabel>
              <input
                id="address-line-2"
                type="text"
                readOnly
                tabIndex={-1}
                value="test 123"
                aria-readonly="true"
                className={hubLocationReadOnlyClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <ManualFieldLabel htmlFor="city-suburb" required>
                City / Suburb
              </ManualFieldLabel>
              <input
                id="city-suburb"
                type="text"
                readOnly
                tabIndex={-1}
                value="Perth"
                aria-readonly="true"
                className={hubLocationReadOnlyClassName}
              />
            </div>
            <div>
              <ManualFieldLabel htmlFor="post-code" required>
                Post Code
              </ManualFieldLabel>
              <input
                id="post-code"
                type="text"
                readOnly
                tabIndex={-1}
                value="6000"
                aria-readonly="true"
                className={hubLocationReadOnlyClassName}
              />
            </div>
            <div>
              <ManualFieldLabel htmlFor="state" required>
                State
              </ManualFieldLabel>
              <HubProfileReadOnlySelectField id="state" value="WA" />
            </div>
            <div>
              <ManualFieldLabel htmlFor="country" required>
                Country
              </ManualFieldLabel>
              <HubProfileReadOnlySelectField id="country" value="Australia" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <ManualFieldLabel htmlFor="location-email">Email</ManualFieldLabel>
              <input
                id="location-email"
                type="email"
                readOnly
                tabIndex={-1}
                value="wellington.point@hubbed.com.au"
                aria-readonly="true"
                className={hubLocationReadOnlyClassName}
              />
            </div>
            <div>
              <ManualFieldLabel htmlFor="location-mobile">Mobile</ManualFieldLabel>
              <input
                id="location-mobile"
                type="tel"
                readOnly
                tabIndex={-1}
                value="0412 345 678"
                aria-readonly="true"
                className={hubLocationReadOnlyClassName}
              />
            </div>
          </div>
        </div>
      </div>
    </HubProfileLayout>
  )
}
