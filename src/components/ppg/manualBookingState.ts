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
] as const

/** Largest weight offered on manual booking step 1. */
export const MANUAL_PARCEL_MAX_WEIGHT_KG = 12

function parcelCatalogWeightKg(weight: string): number {
  if (weight.endsWith('kg')) {
    return Number.parseFloat(weight.slice(0, -2))
  }
  if (weight.endsWith('g')) {
    return Number.parseFloat(weight.slice(0, -1)) / 1000
  }
  return Number.POSITIVE_INFINITY
}

/** Sizes shown in the step 1 grid (excludes anything above 12 kg). */
export function getManualParcelSizesForBooking() {
  return PARCEL_SIZE_CATALOG.filter(
    (size) => parcelCatalogWeightKg(size.weight) <= MANUAL_PARCEL_MAX_WEIGHT_KG,
  )
}

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
  deliverySelected: boolean
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

export const BOOKING_CHARGE_AMOUNTS = {
  delivery: 11.5,
  packaging: 2.0,
  signature: 3.5,
  protection: 2.5,
} as const

export interface BookingPriceLineItem {
  label: string
  amount: number
}

const PACKAGING_FEE_LABEL = 'Packaging Fee'

export function buildBookingPriceLineItems(draft: ManualBookingDraft): BookingPriceLineItem[] {
  const items: BookingPriceLineItem[] = []

  if (draft.deliverySelected) {
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

export function calculateBookingTotal(draft: ManualBookingDraft) {
  const items = buildBookingPriceLineItems(draft)
  if (items.length === 0) {
    return null
  }
  const total = items.reduce((sum, item) => sum + item.amount, 0)
  return Math.round(total * 100) / 100
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

/** Fee per additional $100 of declared value above the included $100. */
export const PARCEL_PROTECTION_FEE_PER_100 = BOOKING_CHARGE_AMOUNTS.protection

export function getParcelProtectionBracketCount(declaredValue: number) {
  if (declaredValue <= PARCEL_PROTECTION_INCLUDED_MAX_VALUE) {
    return 0
  }
  const excess = declaredValue - PARCEL_PROTECTION_INCLUDED_MAX_VALUE
  return Math.ceil(excess / 100)
}

export function calculateParcelProtectionFee(declaredValue: number) {
  return getParcelProtectionBracketCount(declaredValue) * PARCEL_PROTECTION_FEE_PER_100
}

export function formatParcelProtectionAddonPrice(parcelValue: string) {
  const amount = getDeclaredParcelValueAmount(parcelValue)
  if (amount === null) {
    return null
  }
  if (amount <= PARCEL_PROTECTION_INCLUDED_MAX_VALUE) {
    return null
  }
  const fee = calculateParcelProtectionFee(amount)
  return `+$${fee.toFixed(2)}`
}

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
    const declared = getDeclaredParcelValueAmount(parcelValue)
    if (declared === null) {
      return null
    }
    return calculateParcelProtectionFee(declared)
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
    if (!draft.deliverySelected) {
      return 'Select a delivery method'
    }
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

function shortenAddressForSuccessRoute(address: string) {
  const trimmed = address.trim()
  if (!trimmed) {
    return ''
  }
  return trimmed.split(',')[0]?.trim() ?? trimmed
}

/** Single-line route on the booking success card (e.g. Bondi Beach → 25 Spring St). */
export function buildSuccessRouteHeadline(draft: ManualBookingDraft) {
  let origin: string
  if (draft.deliveryMethod === 'atl') {
    origin = 'Bondi Junction'
  } else if (draft.deliveryMethod === 'atl-only') {
    origin = 'Bondi Beach'
  } else {
    origin = getParcelpointStoreName(draft.parcelpointStoreId) ?? 'Hubbed'
  }

  const fallbackDestination =
    draft.deliveryMethod === 'atl'
      ? '25 Spring St'
      : draft.deliveryMethod === 'atl-only'
        ? '12 Hall St'
        : 'Destination'

  const destination =
    shortenAddressForSuccessRoute(draft.receiverAddress) || fallbackDestination

  return `${origin} → ${destination}`
}

export function buildSuccessParcelSubtitle(draft: ManualBookingDraft) {
  const size = getParcelSizeById(draft.parcelSizeId)
  const content = getContentTypeLabel(draft.contentType)
  if (size) {
    return `${size.name} · ${size.weight}`
  }
  return content
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
