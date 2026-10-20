export const HUB_PERSONAL_STORE_PATH = '/hub/personal-store'
export const HUB_OPERATING_HOURS_PATH = '/hub/operating-hours'
export const PAYTO_AGREEMENT_PATH = '/payto-agreement'
export const PAYTO_AGREEMENT_DETAILS_PATH = '/payto-agreement/details'

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
    pathname.startsWith(PAYTO_AGREEMENT_PATH)
  )
}
