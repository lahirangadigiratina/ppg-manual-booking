import type { DeliveryMethod } from '../components/ppg/manualBookingState'

export const PPG_HOME_PATH = '/ppg'
export const PPG_ATL_PATH = '/ppg/ATL'
export const PPG_ATL_ONLY_PATH = '/ppg/ATL-only'
export const PPG_ONLINE_SMS_FAILED_PATH = '/ppg/online/sms-failed'

export function deliveryMethodFromPpgPath(
  pathname: string,
): Extract<DeliveryMethod, 'atl' | 'atl-only'> | null {
  const path = pathname.replace(/\/$/, '')
  if (path === PPG_ATL_PATH) {
    return 'atl'
  }
  if (path === PPG_ATL_ONLY_PATH) {
    return 'atl-only'
  }
  return null
}

export function ppgPathForDeliveryMethod(method: DeliveryMethod): string {
  if (method === 'atl') {
    return PPG_ATL_PATH
  }
  if (method === 'atl-only') {
    return PPG_ATL_ONLY_PATH
  }
  return PPG_HOME_PATH
}
