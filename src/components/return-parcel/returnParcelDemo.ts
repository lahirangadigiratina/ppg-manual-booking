export interface DropoffLabelParcelDemo {
  shipmentNumber: string
  name: string
  consignmentId: string
  itemId: string
  itemReference?: string
  retailer?: string
  /** Payment dialog: packaging add-on checked and not editable. */
  packagingPreIncluded?: boolean
  /** Confirm dropoff: show “Location has access to a printer…” as a third shipping label option. */
  showLocationPrinterLabelOption?: boolean
  /** Confirm dropoff: packaging add-on card (when payment confirmation is skipped). */
  showPackagingSelection?: boolean
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

/** Payment confirmation with packaging already included (locked on). */
export const DROP_OFF_PACKAGING_INCLUDED_PARCEL: DropoffLabelParcelDemo = {
  shipmentNumber: 'MP5500123700',
  name: 'Packaging Included Demo',
  consignmentId: 'HHZZZGLH5',
  itemId: 'HHZZZGLH5',
  packagingPreIncluded: true,
}

/** Shipment 3: payment confirmation → confirm dropoff (two shipping label options). */
export const DROP_OFF_PRINT_PREFERENCE_PARCEL: DropoffLabelParcelDemo = {
  shipmentNumber: 'MP5500123600',
  name: 'Jordan Kumar',
  consignmentId: 'MP8032116889',
  itemId: 'HCJDGZZG9',
  itemReference: '',
  retailer: 'T Return',
}

/** Same as MP5500123600 (payment → confirm dropoff), with a third shipping label option. */
export const DROP_OFF_LOCATION_PRINT_LABEL_PARCEL: DropoffLabelParcelDemo = {
  shipmentNumber: 'MP5500123800',
  name: 'Sam Rivera',
  consignmentId: 'MP8032116990',
  itemId: 'HCJDGZZG0',
  itemReference: '',
  retailer: 'T Return',
  showLocationPrinterLabelOption: true,
}

/** Search → confirm dropoff only (no payment confirmation). */
export const DROP_OFF_DIRECT_CONFIRM_DROPOFF_PARCEL: DropoffLabelParcelDemo = {
  shipmentNumber: 'MP5500123900',
  name: 'Alex Chen',
  consignmentId: 'MP8032117001',
  itemId: 'HCJDGZZG1',
  itemReference: '',
  retailer: 'T Return',
  showPackagingSelection: true,
}

export const DROP_OFF_BASE_COLLECT_AMOUNT = 24.5
export const DROP_OFF_PACKAGING_SURCHARGE_AMOUNT = 2

export function formatDropOffCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export const DROP_OFF_COLLECT_AMOUNT_LABEL = formatDropOffCurrency(DROP_OFF_BASE_COLLECT_AMOUNT)
export const DROP_OFF_PACKAGING_SURCHARGE_LABEL = formatDropOffCurrency(
  DROP_OFF_PACKAGING_SURCHARGE_AMOUNT,
)

export function dropOffCollectAmountLabel(includePackaging: boolean): string {
  const total = includePackaging
    ? DROP_OFF_BASE_COLLECT_AMOUNT + DROP_OFF_PACKAGING_SURCHARGE_AMOUNT
    : DROP_OFF_BASE_COLLECT_AMOUNT
  return formatDropOffCurrency(total)
}

function normalizeShipmentQuery(query: string): string {
  return query.trim().toUpperCase()
}

const DEMO_DROP_OFF_PARCELS: DropoffLabelParcelDemo[] = [
  DROP_OFF_CASH_CONFIRM_PARCEL,
  DROP_OFF_SECOND_PARCEL,
  DROP_OFF_PACKAGING_INCLUDED_PARCEL,
]

export function resolveDropoffDemoParcel(query: string): DropoffLabelParcelDemo | null {
  const normalized = normalizeShipmentQuery(query)
  return DEMO_DROP_OFF_PARCELS.find((parcel) => parcel.shipmentNumber === normalized) ?? null
}

const PARCEL_DROPOFF_CONFIRM_FLOW_PARCELS: DropoffLabelParcelDemo[] = [
  DROP_OFF_PRINT_PREFERENCE_PARCEL,
  DROP_OFF_LOCATION_PRINT_LABEL_PARCEL,
]

export function resolvePrintPreferenceParcel(query: string): DropoffLabelParcelDemo | null {
  const normalized = normalizeShipmentQuery(query)
  return (
    PARCEL_DROPOFF_CONFIRM_FLOW_PARCELS.find((parcel) => parcel.shipmentNumber === normalized) ??
    null
  )
}

const DIRECT_PARCEL_DROPOFF_CONFIRM_PARCELS: DropoffLabelParcelDemo[] = [
  DROP_OFF_DIRECT_CONFIRM_DROPOFF_PARCEL,
]

export function resolveDirectParcelDropoffConfirmParcel(
  query: string,
): DropoffLabelParcelDemo | null {
  const normalized = normalizeShipmentQuery(query)
  return (
    DIRECT_PARCEL_DROPOFF_CONFIRM_PARCELS.find((parcel) => parcel.shipmentNumber === normalized) ??
    null
  )
}
