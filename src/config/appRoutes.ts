export const REPORTS_PATH = '/reports'

export const HUB_PERSONAL_STORE_PATH = '/hub/personal-store'
export const HUB_OPERATING_HOURS_PATH = '/hub/operating-hours'
export const PAYTO_AGREEMENT_PATH = '/payto-agreement'
/** First-time PayTo request form. */
export const PAYTO_AGREEMENT_REQUEST_PATH = '/payto-agreement/request'
/** Create an additional agreement (same form as first-time). */
export const PAYTO_AGREEMENT_NEW_PATH = '/payto-agreement/new'
/** Existing agreements list / details. */
export const PAYTO_AGREEMENT_DETAILS_PATH = '/payto-agreement/details'

/** Parallel NoPayTo flow (full duplicate of PayTo under /nopayto). */
export const NOPAYTO_AGREEMENT_PATH = '/nopayto'
export const NOPAYTO_AGREEMENT_REQUEST_PATH = '/nopayto/request'
export const NOPAYTO_AGREEMENT_NEW_PATH = '/nopayto/new'
export const NOPAYTO_AGREEMENT_DETAILS_PATH = '/nopayto/details'

export type PayToAgreementStatus = 'pending_authorisation' | 'active'

export interface PayToAgreementRecord {
  payerName: string
  bsb: string
  accountNumber: string
  agreementId: string
  agreementSummary: string
  paymentFrequency: string
  status: PayToAgreementStatus
}

export function isHubProfilePath(pathname: string) {
  return (
    pathname.startsWith(HUB_PERSONAL_STORE_PATH) ||
    pathname.startsWith(HUB_OPERATING_HOURS_PATH) ||
    pathname.startsWith(PAYTO_AGREEMENT_PATH) ||
    pathname.startsWith(NOPAYTO_AGREEMENT_PATH)
  )
}
