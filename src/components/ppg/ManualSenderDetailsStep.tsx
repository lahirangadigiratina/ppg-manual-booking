import { ManualFieldLabel, manualInputClassName } from './manualFormShared'

export function ManualSenderDetailsStep() {
  return (
    <div>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <ManualFieldLabel htmlFor="sender-business-name">
            Business Name (optional)
          </ManualFieldLabel>
          <input
            id="sender-business-name"
            type="text"
            placeholder="e.g., Hubbed"
            className={manualInputClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <ManualFieldLabel htmlFor="sender-first-name" required>
              First Name
            </ManualFieldLabel>
            <input
              id="sender-first-name"
              type="text"
              placeholder="Jane"
              className={manualInputClassName}
              autoComplete="given-name"
            />
          </div>
          <div>
            <ManualFieldLabel htmlFor="sender-last-name" required>
              Last Name
            </ManualFieldLabel>
            <input
              id="sender-last-name"
              type="text"
              placeholder="Smith"
              className={manualInputClassName}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div>
          <ManualFieldLabel htmlFor="sender-email" required>
            Email
          </ManualFieldLabel>
          <input
            id="sender-email"
            type="email"
            placeholder="jane@example.com"
            className={manualInputClassName}
            autoComplete="email"
          />
        </div>

        <div>
          <ManualFieldLabel htmlFor="sender-mobile" required>
            Mobile
          </ManualFieldLabel>
          <input
            id="sender-mobile"
            type="tel"
            placeholder="+61 412 345 678"
            className={manualInputClassName}
            autoComplete="tel"
          />
        </div>
      </form>
    </div>
  )
}
