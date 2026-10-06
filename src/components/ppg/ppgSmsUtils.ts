export function formatAustralianMobileDisplay(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return '—'
  }
  if (trimmed.startsWith('+')) {
    return trimmed
  }
  const digits = trimmed.replace(/\D/g, '')
  if (digits.startsWith('61')) {
    return `+${digits}`
  }
  if (digits.startsWith('0')) {
    return `+61 ${digits.slice(1)}`
  }
  return `+61 ${digits}`
}

export function normalizeMobileDigits(value: string) {
  return value.replace(/\D/g, '')
}

/** Demo numbers for Send SMS (any spacing / +61 / leading 0). */
export const DEMO_SMS_SUCCESS_MOBILE = '+61 412 345 678'
export const DEMO_SMS_FAILURE_MOBILE = '+61 412 345 670'

export function australianMobileKey(value: string) {
  let digits = normalizeMobileDigits(value)
  if (digits.startsWith('61')) {
    digits = digits.slice(2)
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }
  return digits
}

const AU_MOBILE_PREFIX = '+61 '
const AU_MOBILE_MIN_INPUT = '+61 4'

function formatAustralianNationalSpacing(digits: string) {
  if (digits.length <= 3) {
    return digits
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`
  }
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}

/** Keeps +61 prefix and Australian mobile digits (9 digits starting with 4). */
export function formatAustralianMobileFieldInput(value: string) {
  if (!value.trim()) {
    return ''
  }

  let digits = australianMobileKey(value)
  if (digits.length === 0) {
    return AU_MOBILE_PREFIX
  }

  if (!digits.startsWith('4')) {
    const fromFour = digits.slice(digits.indexOf('4'))
    digits = fromFour.startsWith('4') ? fromFour : `4${digits.replace(/\D/g, '')}`
  }

  digits = digits.replace(/\D/g, '').slice(0, 9)
  if (!digits.startsWith('4')) {
    digits = `4${digits}`.slice(0, 9)
  }

  return `${AU_MOBILE_PREFIX}${formatAustralianNationalSpacing(digits)}`
}

export function applyAustralianMobileFieldChange(previous: string, next: string) {
  if (next === '') {
    return ''
  }
  if (next.length <= AU_MOBILE_MIN_INPUT.length) {
    return AU_MOBILE_MIN_INPUT
  }
  if (!next.startsWith('+61')) {
    return formatAustralianMobileFieldInput(`${AU_MOBILE_PREFIX}${next.replace(/\D/g, '')}`)
  }
  const formatted = formatAustralianMobileFieldInput(next)
  if (formatted === AU_MOBILE_PREFIX && previous.startsWith(AU_MOBILE_MIN_INPUT)) {
    return AU_MOBILE_MIN_INPUT
  }
  return formatted
}

export function focusAustralianMobileField(current: string) {
  return current.trim() ? current : AU_MOBILE_MIN_INPUT
}

/** Mock send — use demo success/failure numbers above. */
export async function sendBookingLinkSms(mobile: string): Promise<{ ok: boolean; error?: string }> {
  await new Promise((resolve) => window.setTimeout(resolve, 600))

  const key = australianMobileKey(mobile)
  if (key.length < 9) {
    return { ok: false, error: 'Enter a valid mobile number and try again.' }
  }

  if (key === australianMobileKey(DEMO_SMS_FAILURE_MOBILE)) {
    return {
      ok: false,
      error: 'We could not deliver the SMS. Check the number or try again shortly.',
    }
  }

  if (key === australianMobileKey(DEMO_SMS_SUCCESS_MOBILE)) {
    return { ok: true }
  }

  return {
    ok: false,
    error: `For demo, use ${DEMO_SMS_SUCCESS_MOBILE} (success) or ${DEMO_SMS_FAILURE_MOBILE} (error).`,
  }
}
