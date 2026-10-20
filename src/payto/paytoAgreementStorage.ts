import type { PayToAgreementRecord } from '../config/appRoutes'
import {
  PAYTO_AGREEMENT_DETAILS_PATH,
  PAYTO_AGREEMENT_PATH,
} from '../config/appRoutes'

const STORAGE_KEY = 'hubbed-payto-agreement'

/** Demo record when opening the details route directly (no prior request in this session). */
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

export function savePayToAgreement(record: PayToAgreementRecord) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // sessionStorage may be unavailable
  }
}

export function getPayToAgreement(): PayToAgreementRecord | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }
    return normalizePayToRecord(JSON.parse(raw) as Partial<PayToAgreementRecord>)
  } catch {
    return null
  }
}

export function getPayToAgreementForDisplay(): PayToAgreementRecord {
  return getPayToAgreement() ?? DEMO_PAYTO_AGREEMENT
}

export function paytoProfilePath(): string {
  return getPayToAgreement() ? PAYTO_AGREEMENT_DETAILS_PATH : PAYTO_AGREEMENT_PATH
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
