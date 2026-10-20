import { useLocation } from 'react-router-dom'
import { PAYTO_AGREEMENT_DETAILS_PATH } from '../config/appRoutes'
import { PayToAgreementDetailsPage } from './PayToAgreementDetailsPage'
import { PayToAgreementPage } from './PayToAgreementPage'

export function PayToAgreementRouter() {
  const { pathname } = useLocation()

  if (pathname.startsWith(PAYTO_AGREEMENT_DETAILS_PATH)) {
    return <PayToAgreementDetailsPage />
  }

  return <PayToAgreementPage />
}
