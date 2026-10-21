import { Navigate, useLocation } from 'react-router-dom'
import {
  PAYTO_AGREEMENT_DETAILS_PATH,
  PAYTO_AGREEMENT_NEW_PATH,
  PAYTO_AGREEMENT_PATH,
  PAYTO_AGREEMENT_REQUEST_PATH,
} from '../config/appRoutes'
import { hasPayToAgreements, paytoProfilePath } from '../payto/paytoAgreementStorage'
import { PayToAgreementDetailsPage } from './PayToAgreementDetailsPage'
import { PayToAgreementPage } from './PayToAgreementPage'

function normalizePath(pathname: string) {
  return pathname.replace(/\/$/, '') || '/'
}

export function PayToAgreementRouter() {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)

  if (path === PAYTO_AGREEMENT_DETAILS_PATH) {
    return <PayToAgreementDetailsPage />
  }

  if (path === PAYTO_AGREEMENT_REQUEST_PATH || path === PAYTO_AGREEMENT_NEW_PATH) {
    return <PayToAgreementPage />
  }

  // Base /payto-agreement → first-time request or existing details.
  if (path === PAYTO_AGREEMENT_PATH) {
    return <Navigate to={paytoProfilePath()} replace />
  }

  // Unknown sub-path under PayTo — send users to the right entry.
  if (hasPayToAgreements()) {
    return <Navigate to={PAYTO_AGREEMENT_DETAILS_PATH} replace />
  }

  return <Navigate to={PAYTO_AGREEMENT_REQUEST_PATH} replace />
}
