import type { PayToAgreementRecord } from '../config/appRoutes'
import {
  NOPAYTO_AGREEMENT_DETAILS_PATH,
  NOPAYTO_AGREEMENT_NEW_PATH,
  NOPAYTO_AGREEMENT_REQUEST_PATH,
} from '../config/appRoutes'

const STORAGE_KEY = 'hubbed-nopayto-agreements'

/** Demo record when opening the details route with no saved agreements. */
export const DEMO_NOPAYTO_AGREEMENT: PayToAgreementRecord = {
  payerName: 'Yusra Aziz',
  bsb: '062-000',
  accountNumber: '•••• 4408',
  agreementId: 'NPT-HMP-28491',
  agreementSummary: 'PARCELPOINT Go bookings and store collections at this location',
  paymentFrequency: 'Per booking (variable amount)',
  status: 'pending_authorisation',
}

const DEFAULT_AGREEMENT_SUMMARY =
  'PARCELPOINT Go bookings and store collections at this location'
const DEFAULT_PAYMENT_FREQUENCY = 'Per booking (variable amount)'

function normalizeRecord(raw: Partial<PayToAgreementRecord>): PayToAgreementRecord {
  return {
    payerName: raw.payerName ?? DEMO_NOPAYTO_AGREEMENT.payerName,
    bsb: raw.bsb ?? DEMO_NOPAYTO_AGREEMENT.bsb,
    accountNumber: raw.accountNumber ?? DEMO_NOPAYTO_AGREEMENT.accountNumber,
    agreementId: raw.agreementId ?? DEMO_NOPAYTO_AGREEMENT.agreementId,
    agreementSummary: raw.agreementSummary ?? DEFAULT_AGREEMENT_SUMMARY,
    paymentFrequency: raw.paymentFrequency ?? DEFAULT_PAYMENT_FREQUENCY,
    status: raw.status ?? 'pending_authorisation',
  }
}

function readStoredAgreements(): PayToAgreementRecord[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.map((item) => normalizeRecord(item as Partial<PayToAgreementRecord>))
  } catch {
    return []
  }
}

function writeStoredAgreements(agreements: readonly PayToAgreementRecord[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(agreements))
  } catch {
    // sessionStorage may be unavailable
  }
}

export function getNoPayToAgreements(): PayToAgreementRecord[] {
  return readStoredAgreements()
}

export function hasNoPayToAgreements() {
  return getNoPayToAgreements().length > 0
}

export function addNoPayToAgreement(record: PayToAgreementRecord) {
  writeStoredAgreements([...getNoPayToAgreements(), record])
}

export function getNoPayToAgreementsForDisplay(): PayToAgreementRecord[] {
  const agreements = getNoPayToAgreements()
  return agreements.length > 0 ? agreements : [DEMO_NOPAYTO_AGREEMENT]
}

export function noPayToProfilePath(): string {
  return hasNoPayToAgreements()
    ? NOPAYTO_AGREEMENT_DETAILS_PATH
    : NOPAYTO_AGREEMENT_REQUEST_PATH
}

export function noPayToCreateAgreementPath(): string {
  return NOPAYTO_AGREEMENT_NEW_PATH
}

function maskAccountNumber(accountNumber: string) {
  const digits = accountNumber.replace(/\D/g, '')
  if (digits.length <= 4) {
    return accountNumber
  }
  return `•••• ${digits.slice(-4)}`
}

export function buildNoPayToRecordFromForm(input: {
  payerName: string
  bsb: string
  accountNumber: string
}): PayToAgreementRecord {
  return {
    payerName: input.payerName.trim() || DEMO_NOPAYTO_AGREEMENT.payerName,
    bsb: input.bsb.trim() || DEMO_NOPAYTO_AGREEMENT.bsb,
    accountNumber: maskAccountNumber(input.accountNumber.trim() || '770884408'),
    agreementId: `NPT-HMP-${Math.floor(10000 + Math.random() * 90000)}`,
    agreementSummary: DEFAULT_AGREEMENT_SUMMARY,
    paymentFrequency: DEFAULT_PAYMENT_FREQUENCY,
    status: 'pending_authorisation',
  }
}
