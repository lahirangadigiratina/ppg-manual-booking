import { ArrowRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ManualFieldLabel, manualInputClassName } from './manualFormShared'
import {
  applyAustralianMobileFieldChange,
  australianMobileKey,
  focusAustralianMobileField,
  isCompleteAustralianMobile,
  lookupSenderProfileByMobile,
  validateAustralianMobile,
} from './ppgSmsUtils'

function fieldClassName(hasError: boolean, withTrailingAction: boolean) {
  return `${manualInputClassName}${
    withTrailingAction ? ' !pr-11 sm:!pr-12' : ''
  }${
    hasError
      ? ' border-red-500 focus:border-red-500 focus:ring-red-100'
      : ''
  }`
}

export function ManualSenderDetailsStep() {
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [phoneHint, setPhoneHint] = useState<string | null>(null)
  const [lookupPending, setLookupPending] = useState(false)

  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const runPhoneValidationAndLookup = useCallback(async (value: string) => {
    const validationError = validateAustralianMobile(value)
    if (validationError) {
      setPhoneError(validationError)
      setPhoneHint(null)
      return
    }

    setPhoneError(null)
    setLookupPending(true)
    setPhoneHint(null)

    try {
      const profile = await lookupSenderProfileByMobile(value)
      if (profile) {
        setEmail(profile.email)
        setBusinessName(profile.businessName)
        setFirstName(profile.firstName)
        setLastName(profile.lastName)
        setPhoneHint('Sender details filled from this number.')
      } else {
        setPhoneHint('Number not on file — enter the details below.')
      }
    } finally {
      setLookupPending(false)
    }
  }, [])

  function handlePhoneBlur() {
    if (!phone.trim()) {
      setPhoneError('Enter a mobile number.')
      setPhoneHint(null)
      return
    }
    void runPhoneValidationAndLookup(phone)
  }

  function handlePhoneChange(rawNext: string) {
    const formatted = applyAustralianMobileFieldChange(phone, rawNext)
    setPhone(formatted)
    setPhoneError(null)
    setPhoneHint(null)
    if (isCompleteAustralianMobile(formatted)) {
      void runPhoneValidationAndLookup(formatted)
    }
  }

  function submitPhoneLookup() {
    if (!phone.trim()) {
      setPhoneError('Enter a mobile number.')
      setPhoneHint(null)
      return
    }
    void runPhoneValidationAndLookup(phone)
  }

  const showPhoneLookupAction = australianMobileKey(phone).length > 1

  return (
    <div>
      <form className="space-y-3.5 sm:space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
        <div>
          <ManualFieldLabel htmlFor="sender-phone" required>
            Phone number
          </ManualFieldLabel>
          <div className="relative">
            <input
              id="sender-phone"
              type="tel"
              inputMode="tel"
              placeholder="+61 412 345 678"
              className={fieldClassName(Boolean(phoneError), showPhoneLookupAction)}
              autoComplete="tel"
              value={phone}
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={
                phoneError
                  ? 'sender-phone-error'
                  : phoneHint
                    ? 'sender-phone-hint'
                    : undefined
              }
              onFocus={() => setPhone((current) => focusAustralianMobileField(current))}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={handlePhoneBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && showPhoneLookupAction) {
                  e.preventDefault()
                  submitPhoneLookup()
                }
              }}
            />
            {showPhoneLookupAction ? (
              <button
                type="button"
                onClick={submitPhoneLookup}
                disabled={lookupPending}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md bg-black text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 sm:right-2.5"
                aria-label="Look up sender by phone number"
              >
                <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />
              </button>
            ) : null}
          </div>
          {phoneError ? (
            <p id="sender-phone-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {phoneError}
            </p>
          ) : null}
          {!phoneError && lookupPending ? (
            <p id="sender-phone-hint" className="mt-1.5 text-sm text-text-muted">
              Checking number…
            </p>
          ) : null}
          {!phoneError && !lookupPending && phoneHint ? (
            <p
              id="sender-phone-hint"
              className={`mt-1.5 text-sm ${
                phoneHint.includes('filled') ? 'text-green-700' : 'text-text-muted'
              }`}
            >
              {phoneHint}
            </p>
          ) : null}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <ManualFieldLabel htmlFor="sender-business-name">
            Business Name (optional)
          </ManualFieldLabel>
          <input
            id="sender-business-name"
            type="text"
            placeholder="Hubbed"
            className={manualInputClassName}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
