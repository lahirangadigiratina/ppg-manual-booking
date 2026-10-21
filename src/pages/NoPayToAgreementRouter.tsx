import { Navigate, useLocation } from 'react-router-dom'
import {
  NOPAYTO_AGREEMENT_DETAILS_PATH,
  NOPAYTO_AGREEMENT_NEW_PATH,
  NOPAYTO_AGREEMENT_PATH,
  NOPAYTO_AGREEMENT_REQUEST_PATH,
} from '../config/appRoutes'
import {
  hasNoPayToAgreements,
  noPayToProfilePath,
} from '../nopayto/noPayToAgreementStorage'
import { NoPayToAgreementDetailsPage } from './NoPayToAgreementDetailsPage'
import { NoPayToAgreementPage } from './NoPayToAgreementPage'

function normalizePath(pathname: string) {
  return pathname.replace(/\/$/, '') || '/'
}

export function NoPayToAgreementRouter() {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)

  if (path === NOPAYTO_AGREEMENT_DETAILS_PATH) {
    return <NoPayToAgreementDetailsPage />
  }

  if (path === NOPAYTO_AGREEMENT_REQUEST_PATH || path === NOPAYTO_AGREEMENT_NEW_PATH) {
    return <NoPayToAgreementPage />
  }

  if (path === NOPAYTO_AGREEMENT_PATH) {
    return <Navigate to={noPayToProfilePath()} replace />
  }

  if (hasNoPayToAgreements()) {
    return <Navigate to={NOPAYTO_AGREEMENT_DETAILS_PATH} replace />
  }

  return <Navigate to={NOPAYTO_AGREEMENT_REQUEST_PATH} replace />
}
