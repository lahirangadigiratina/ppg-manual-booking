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

/** Mock send — fails when number is missing or too short (demo failure path). */
export async function sendBookingLinkSms(mobile: string): Promise<{ ok: boolean; error?: string }> {
  await new Promise((resolve) => window.setTimeout(resolve, 600))

  const digits = normalizeMobileDigits(mobile)
  if (digits.length < 10) {
    return { ok: false, error: 'Enter a valid mobile number and try again.' }
  }

  // Demo: numbers ending in 0 simulate carrier failure
  if (digits.endsWith('0')) {
    return {
      ok: false,
      error: 'We could not deliver the SMS. Check the number or try again shortly.',
    }
  }

  return { ok: true }
}
