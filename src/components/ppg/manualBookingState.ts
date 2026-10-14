import { PARCELPOINT_STORES } from './parcelPointStores'

export type DeliveryMethod = 'atl' | 'atl-only' | 'parcelpoint'

export function isDoorDelivery(method: DeliveryMethod) {
  return method === 'atl' || method === 'atl-only'
}

export const CARRY_ON_PARCEL_SIZE_ID = 'carry-on'

export const PARCEL_SIZE_CATALOG = [
  { id: 'satchel', name: 'Satchel', dimensions: '25×15×5 cm', weight: '500g' },
  { id: 'shoebox', name: 'Shoebox', dimensions: '30×25×15 cm', weight: '3kg' },
  { id: 'briefcase', name: 'Briefcase', dimensions: '40×30×15 cm', weight: '5kg' },
  { id: 'carry-on', name: 'Carry On', dimensions: '55×40×20 cm', weight: '12kg' },
  { id: 'large-box', name: 'Large Box', dimensions: '60×45×30 cm', weight: '15kg' },
  { id: 'suitcase', name: 'Suitcase', dimensions: '65×45×25 cm', weight: '18kg' },
  { id: 'heavy-crate', name: 'Heavy Crate', dimensions: '80×50×50 cm', weight: '25kg' },
] as const

export const CONTENT_TYPE_OPTIONS = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing-fashion', label: 'Clothing & Fashion' },
  { value: 'food-perishables', label: 'Food & Perishables' },
  { value: 'fragile-items', label: 'Fragile Items' },
  { value: 'sporting-goods', label: 'Sporting Goods' },
  { value: 'books-media', label: 'Books & Media' },
  { value: 'health-beauty', label: 'Health & Beauty' },
  { value: 'household-items', label: 'Household Items' },
  { value: 'other', label: 'Other' },
] as const

export const ADDON_SUMMARY_LABELS: Record<string, string> = {
  signature: 'Signature on Delivery',
  protection: 'Parcel Protection',
}

export interface ManualBookingDraft {
  manualStep: number
  parcelSizeId: string
  needsPackaging: boolean | null
  receiverAddress: string
  deliveryMethod: DeliveryMethod
  parcelpointStoreId: string | null
  contentType: string
  parcelValue: string
  selectedAddons: readonly string[]
}

export function getParcelSizeById(id: string) {
  if (!id) {
    return undefined
  }
  return PARCEL_SIZE_CATALOG.find((size) => size.id === id)
}

export function getContentTypeLabel(value: string) {
  return CONTENT_TYPE_OPTIONS.find((type) => type.value === value)?.label ?? '—'
}

export function getParcelpointStoreName(storeId: string | null) {
  if (!storeId) {
    return null
  }
  return PARCELPOINT_STORES.find((store) => store.id === storeId)?.name ?? null
}

export function formatWeightForSummary(weight: string) {
  if (weight.endsWith('g') && !weight.endsWith('kg')) {
    return weight.replace(/g$/, ' g')
  }
  if (weight.endsWith('kg')) {
    return weight.replace(/kg$/, ' kg')
  }
  return weight
}

const BOOKING_CHARGE_AMOUNTS = {
  delivery: 11.85,
  packaging: 2.0,
  signature: 2.2,
  protection: 2.5,
} as const

export interface BookingPriceLineItem {
  label: string
  amount: number
}

const PACKAGING_FEE_LABEL = 'Packaging Fee'

/** Agent-quoted service lines (packaging is GST-inclusive; others ex-GST). */
function getBookingChargeLineItems(draft: ManualBookingDraft): BookingPriceLineItem[] {
  const items: BookingPriceLineItem[] = []

  if (draft.manualStep >= 1) {
    items.push({ label: 'Delivery', amount: BOOKING_CHARGE_AMOUNTS.delivery })
  }

  if (draft.needsPackaging === true) {
    items.push({ label: PACKAGING_FEE_LABEL, amount: BOOKING_CHARGE_AMOUNTS.packaging })
  }

  if (draft.manualStep >= 4) {
    if (draft.selectedAddons.includes('signature')) {
      items.push({
        label: 'Signature on Delivery',
        amount: BOOKING_CHARGE_AMOUNTS.signature,
      })
    }
    const protectionAmount = getParcelProtectionChargeAmount(
      draft.parcelValue,
      draft.selectedAddons,
    )
    if (protectionAmount !== null) {
      items.push({
        label: 'Parcel Protection',
        amount: protectionAmount,
      })
    }
  }

  return items
}

function splitPackagingFromTaxableCharges(charges: BookingPriceLineItem[]) {
  const packagingTotal = charges
    .filter((item) => item.label === PACKAGING_FEE_LABEL)
    .reduce((sum, item) => sum + item.amount, 0)
  const taxable = charges.filter((item) => item.label !== PACKAGING_FEE_LABEL)
  const taxableTotal = taxable.reduce((sum, item) => sum + item.amount, 0)
  return { packagingTotal, taxable, taxableTotal }
}

export function buildBookingPriceLineItems(draft: ManualBookingDraft): BookingPriceLineItem[] {
  const charges = getBookingChargeLineItems(draft)
  const { packagingTotal, taxable, taxableTotal } = splitPackagingFromTaxableCharges(charges)

  if (taxableTotal <= 0 && packagingTotal <= 0) {
    return []
  }

  const items = [...taxable]
  if (packagingTotal > 0) {
    items.push({ label: PACKAGING_FEE_LABEL, amount: packagingTotal })
  }

  if (taxableTotal > 0) {
    const gst = Math.round(taxableTotal * 0.1 * 100) / 100
    items.push({ label: 'GST (10%)', amount: gst })
  }

  return items
}

export function calculateBookingTotal(draft: ManualBookingDraft) {
  const charges = getBookingChargeLineItems(draft)
  const { packagingTotal, taxableTotal } = splitPackagingFromTaxableCharges(charges)

  if (taxableTotal <= 0 && packagingTotal <= 0) {
    return null
  }

  const gst = taxableTotal > 0 ? Math.round(taxableTotal * 0.1 * 100) / 100 : 0
  return Math.round((taxableTotal + gst + packagingTotal) * 100) / 100
}

export function formatBookingAmount(amount: number) {
  return `$${amount.toFixed(2)}`
}

export function isParcelValueProvided(parcelValue: string) {
  return getDeclaredParcelValueAmount(parcelValue) !== null
}

/** Declared value in dollars, or null if missing/invalid. */
export function getDeclaredParcelValueAmount(parcelValue: string): number | null {
  const trimmed = parcelValue.trim()
  if (!trimmed) {
    return null
  }
  const amount = Number(trimmed)
  if (!Number.isFinite(amount) || amount <= 0) {
    return null
  }
  return amount
}

/** First $100 of cover is included (rate-card $0–$100 bracket). */
export const PARCEL_PROTECTION_INCLUDED_MAX_VALUE = 100

export function isParcelProtectionIncluded(parcelValue: string) {
  const amount = getDeclaredParcelValueAmount(parcelValue)
  return amount !== null && amount <= PARCEL_PROTECTION_INCLUDED_MAX_VALUE
}

export function isParcelProtectionApplied(draft: ManualBookingDraft) {
  if (draft.manualStep < 4) {
    return false
  }
  if (!getDeclaredParcelValueAmount(draft.parcelValue)) {
    return false
  }
  if (isParcelProtectionIncluded(draft.parcelValue)) {
    return true
  }
  return draft.selectedAddons.includes('protection')
}

export function getParcelProtectionChargeAmount(
  parcelValue: string,
  selectedAddons: readonly string[],
): number | null {
  if (!getDeclaredParcelValueAmount(parcelValue)) {
    return null
  }
  if (isParcelProtectionIncluded(parcelValue)) {
    return 0
  }
  if (selectedAddons.includes('protection')) {
    return BOOKING_CHARGE_AMOUNTS.protection
  }
  return null
}

export function formatDeclaredValue(parcelValue: string) {
  const trimmed = parcelValue.trim()
  if (!trimmed) {
    return 'Not declared'
  }
  const amount = Number(trimmed)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Not declared'
  }
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`
}

export function buildRouteSummary(draft: ManualBookingDraft) {
  if (isDoorDelivery(draft.deliveryMethod)) {
    const address =
      draft.receiverAddress.trim() || '12 Hall St, Bondi Beach NSW 2026'
    return `Deliver to door · ${address}`
  }

  const storeName = getParcelpointStoreName(draft.parcelpointStoreId)
  if (storeName) {
    return `Collect from PARCELPOINT · ${storeName}`
  }

  return 'Collect from PARCELPOINT · Select a location'
}

export function buildExtrasSummary(draft: ManualBookingDraft) {
  if (draft.manualStep < 4) {
    return { text: 'Not yet selected', faded: true }
  }

  const labels: string[] = []
  if (draft.selectedAddons.includes('signature')) {
    labels.push(ADDON_SUMMARY_LABELS.signature)
  }
  if (isParcelProtectionApplied(draft)) {
    labels.push(ADDON_SUMMARY_LABELS.protection)
  }

  if (labels.length === 0) {
    return { text: 'Not yet selected', faded: true }
  }

  return { text: labels.join(', '), faded: false }
}
