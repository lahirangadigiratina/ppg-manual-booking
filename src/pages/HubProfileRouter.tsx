import { useLocation } from 'react-router-dom'
import {
  HUB_OPERATING_HOURS_PATH,
  HUB_PERSONAL_STORE_PATH,
  NOPAYTO_AGREEMENT_PATH,
  PAYTO_AGREEMENT_PATH,
} from '../config/appRoutes'
import { HubOperatingHoursPage } from './HubOperatingHoursPage'
import { HubPersonalStorePage } from './HubPersonalStorePage'
import { NoPayToAgreementRouter } from './NoPayToAgreementRouter'
import { PayToAgreementRouter } from './PayToAgreementRouter'

export function HubProfileRouter() {
  const { pathname } = useLocation()

  if (pathname.startsWith(HUB_PERSONAL_STORE_PATH)) {
    return <HubPersonalStorePage />
  }

  if (pathname.startsWith(HUB_OPERATING_HOURS_PATH)) {
    return <HubOperatingHoursPage />
  }

  if (pathname.startsWith(NOPAYTO_AGREEMENT_PATH)) {
    return <NoPayToAgreementRouter />
  }

  if (pathname.startsWith(PAYTO_AGREEMENT_PATH)) {
    return <PayToAgreementRouter />
  }

  return <PayToAgreementRouter />
}
