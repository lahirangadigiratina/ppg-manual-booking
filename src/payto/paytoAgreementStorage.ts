import type { PayToAgreementRecord } from '../config/appRoutes'
import {
  PAYTO_AGREEMENT_DETAILS_PATH,
  PAYTO_AGREEMENT_NEW_PATH,
  PAYTO_AGREEMENT_REQUEST_PATH,
} from '../config/appRoutes'

const STORAGE_KEY = 'hubbed-payto-agreements'
const LEGACY_STORAGE_KEY = 'hubbed-payto-agreement'

/** Demo record when opening the details route with no saved agreements. */
export const DEMO_PAYTO_AGREEMENT: PayToAgreementRecord = {
  payerName: 'Yusra Aziz',
  bsb: '062-000',
  accountNumber: '•••• 4408',
  agreementId: 'PTO-HMP-28491',
  agreementSummary: 'PARCELPOINT Go bookings and hub collections at this location',
  paymentFrequency: 'Per booking (variable amount)',
  status: 'pending_authorisation',
}

const DEFAULT_AGREEMENT_SUMMARY =
  'PARCELPOINT Go bookings and hub collections at this location'
const DEFAULT_PAYMENT_FREQUENCY = 'Per booking (variable amount)'

function normalizePayToRecord(raw: Partial<PayToAgreementRecord>): PayToAgreementRecord {
  return {
    payerName: raw.payerName ?? DEMO_PAYTO_AGREEMENT.payerName,
    bsb: raw.bsb ?? DEMO_PAYTO_AGREEMENT.bsb,
    accountNumber: raw.accountNumber ?? DEMO_PAYTO_AGREEMENT.accountNumber,
    agreementId: raw.agreementId ?? DEMO_PAYTO_AGREEMENT.agreementId,
    agreementSummary: raw.agreementSummary ?? DEFAULT_AGREEMENT_SUMMARY,
    paymentFrequency: raw.paymentFrequency ?? DEFAULT_PAYMENT_FREQUENCY,
    status: raw.status ?? 'pending_authorisation',
  }
}

function readStoredAgreements(): PayToAgreementRecord[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        return parsed.map((item) =>
          normalizePayToRecord(item as Partial<PayToAgreementRecord>),
        )
      }
    }

    // Migrate legacy single-record storage into the list format.
    const legacyRaw = sessionStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacyRaw) {
      const legacy = normalizePayToRecord(
        JSON.parse(legacyRaw) as Partial<PayToAgreementRecord>,
      )
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([legacy]))
      sessionStorage.removeItem(LEGACY_STORAGE_KEY)
      return [legacy]
    }
  } catch {
    // sessionStorage may be unavailable
  }
  return []
}

function writeStoredAgreements(agreements: readonly PayToAgreementRecord[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(agreements))
    sessionStorage.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // sessionStorage may be unavailable
  }
}

export function getPayToAgreements(): PayToAgreementRecord[] {
  return readStoredAgreements()
}

export function hasPayToAgreements() {
  return getPayToAgreements().length > 0
}

/** Latest agreement, or null when none are saved. */
export function getPayToAgreement(): PayToAgreementRecord | null {
  const agreements = getPayToAgreements()
  return agreements[agreements.length - 1] ?? null
}

export function addPayToAgreement(record: PayToAgreementRecord) {
  const next = [...getPayToAgreements(), record]
  writeStoredAgreements(next)
}

export function getPayToAgreementsForDisplay(): PayToAgreementRecord[] {
  const agreements = getPayToAgreements()
  return agreements.length > 0 ? agreements : [DEMO_PAYTO_AGREEMENT]
}

/** Profile menu destination: details for existing users, request form for first-time. */
export function paytoProfilePath(): string {
  return hasPayToAgreements()
    ? PAYTO_AGREEMENT_DETAILS_PATH
    : PAYTO_AGREEMENT_REQUEST_PATH
}

export function paytoCreateAgreementPath(): string {
  return PAYTO_AGREEMENT_NEW_PATH
}

export function maskAccountNumber(accountNumber: string) {
  const digits = accountNumber.replace(/\D/g, '')
  if (digits.length <= 4) {
    return accountNumber
  }
  return `•••• ${digits.slice(-4)}`
}

export function buildPayToRecordFromForm(input: {
  payerName: string
  bsb: string
  accountNumber: string
}): PayToAgreementRecord {
  return {
    payerName: input.payerName.trim() || DEMO_PAYTO_AGREEMENT.payerName,
    bsb: input.bsb.trim() || DEMO_PAYTO_AGREEMENT.bsb,
    accountNumber: maskAccountNumber(input.accountNumber.trim() || '770884408'),
    agreementId: `PTO-HMP-${Math.floor(10000 + Math.random() * 90000)}`,
    agreementSummary: DEFAULT_AGREEMENT_SUMMARY,
    paymentFrequency: DEFAULT_PAYMENT_FREQUENCY,
    status: 'pending_authorisation',
  }
}
