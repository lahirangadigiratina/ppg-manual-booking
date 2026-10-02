import { useState } from 'react'
import {
  ManualFieldLabel,
  ManualStepHeading,
  manualInputClassName,
} from './manualFormShared'

export function ManualReceiverDetailsStep() {
  const [skipReceiverNotify, setSkipReceiverNotify] = useState(false)

  return (
    <div>
      <ManualStepHeading step={3} title="Receiver Details" />

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <ManualFieldLabel htmlFor="receiver-business-name">
            Business Name (optional)
          </ManualFieldLabel>
          <input
            id="receiver-business-name"
            type="text"
            placeholder="Jane's Bookstore"
            className={manualInputClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <ManualFieldLabel htmlFor="receiver-first-name" required>
              First Name
            </ManualFieldLabel>
            <input
              id="receiver-first-name"
              type="text"
              placeholder="Jane"
              className={manualInputClassName}
              autoComplete="given-name"
            />
          </div>
          <div>
            <ManualFieldLabel htmlFor="receiver-last-name" required>
              Last Name
            </ManualFieldLabel>
            <input
              id="receiver-last-name"
              type="text"
              placeholder="Smith"
              className={manualInputClassName}
              autoComplete="family-name"
            />
          </div>
          <div>
            <ManualFieldLabel htmlFor="receiver-email" required>
              Email
            </ManualFieldLabel>
            <input
              id="receiver-email"
              type="email"
              placeholder="jane@ex.com"
              className={manualInputClassName}
              autoComplete="email"
            />
          </div>
          <div>
            <ManualFieldLabel htmlFor="receiver-mobile" required>
              Mobile
            </ManualFieldLabel>
            <input
              id="receiver-mobile"
              type="tel"
              placeholder="0412 345 678"
              className={manualInputClassName}
              autoComplete="tel"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 pt-1">
          <input
            type="checkbox"
            checked={skipReceiverNotify}
            onChange={(e) => setSkipReceiverNotify(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 rounded border-gray-300 text-black focus:ring-indigo-200"
          />
          <span className="text-sm leading-snug text-gray-800">
            Don&apos;t notify the receiver{' '}
            <span className="text-text-muted">(sender&apos;s choice)</span>
          </span>
        </label>
      </form>

    </div>
  )
}
