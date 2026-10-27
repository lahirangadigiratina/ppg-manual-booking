export interface DropoffLabelParcelDemo {
  shipmentNumber: string
  name: string
  consignmentId: string
  itemId: string
  retailer?: string
}

/** Step 1: search + Enter → payment confirmation, then label dialog after Confirm Dropoff. */
export const DROP_OFF_CASH_CONFIRM_PARCEL: DropoffLabelParcelDemo = {
  shipmentNumber: 'MP5500123499',
  name: 'Test Parcel',
  consignmentId: 'HHZZZGLH3',
  itemId: 'HHZZZGLH3',
}

/** Shipment 2: payment confirmation first, then label dialog (same flow as shipment 1). */
export const DROP_OFF_SECOND_PARCEL: DropoffLabelParcelDemo = {
  shipmentNumber: 'MP5500123500',
  name: 'Test Parcel Two',
  consignmentId: 'HHZZZGLH4',
  itemId: 'HHZZZGLH4',
}

/**
 * Shipment 3: print preference first → payment → label dialog only if user chose Prefer.
 * Search + Enter → “Do you wish to print?” (Prefer / Not prefer).
 */
export const DROP_OFF_PRINT_PREFERENCE_PARCEL: DropoffLabelParcelDemo = {
  shipmentNumber: 'MP5500123600',
  name: 'Jordan Kumar',
  consignmentId: 'MP8032101040',
  itemId: 'HCJDGZZG9',
  retailer: 'PPG Drop-off',
}

export const DROP_OFF_COLLECT_AMOUNT_LABEL = '$24.50'

function normalizeShipmentQuery(query: string): string {
  return query.trim().toUpperCase()
}

const DEMO_DROP_OFF_PARCELS: DropoffLabelParcelDemo[] = [
  DROP_OFF_CASH_CONFIRM_PARCEL,
  DROP_OFF_SECOND_PARCEL,
]

export function resolveDropoffDemoParcel(query: string): DropoffLabelParcelDemo | null {
  const normalized = normalizeShipmentQuery(query)
  return DEMO_DROP_OFF_PARCELS.find((parcel) => parcel.shipmentNumber === normalized) ?? null
}

export function resolvePrintPreferenceParcel(query: string): DropoffLabelParcelDemo | null {
  if (normalizeShipmentQuery(query) === DROP_OFF_PRINT_PREFERENCE_PARCEL.shipmentNumber) {
    return DROP_OFF_PRINT_PREFERENCE_PARCEL
  }
  return null
}
