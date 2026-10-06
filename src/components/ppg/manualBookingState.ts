import { PARCELPOINT_STORES } from './parcelPointStores'

export type DeliveryMethod = 'door' | 'parcelpoint'

export const PARCEL_SIZE_CATALOG = [
  { id: 'pouch', name: 'Pouch', dimensions: '20×10×5 cm', weight: '250g' },
  { id: 'satchel', name: 'Satchel', dimensions: '25×15×5 cm', weight: '500g' },
  { id: 'handbag', name: 'Handbag', dimensions: '25×15×10 cm', weight: '1kg' },
  { id: 'shoebox', name: 'Shoebox', dimensions: '30×25×15 cm', weight: '3kg' },
  { id: 'briefcase', name: 'Briefcase', dimensions: '40×30×15 cm', weight: '5kg' },
  { id: 'carry-on', name: 'Carry On', dimensions: '55×40×20 cm', weight: '12kg' },
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
  needsPackaging: boolean
  receiverAddress: string
  deliveryMethod: DeliveryMethod
  parcelpointStoreId: string | null
  contentType: string
  parcelValue: string
  selectedAddons: readonly string[]
}

export function getParcelSizeById(id: string) {
  return PARCEL_SIZE_CATALOG.find((size) => size.id === id) ?? PARCEL_SIZE_CATALOG[3]
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
  delivery: 10.85,
  fuelSurcharge: 1.0,
  packaging: 3.0,
  signature: 2.2,
  protection: 2.5,
} as const

export interface BookingPriceLineItem {
  label: string
  amount: number
}

export function buildBookingPriceLineItems(draft: ManualBookingDraft): BookingPriceLineItem[] {
  const items: BookingPriceLineItem[] = []

  if (draft.manualStep >= 4) {
    items.push({ label: 'Delivery', amount: BOOKING_CHARGE_AMOUNTS.delivery })
    items.push({ label: 'Fuel Surcharge', amount: BOOKING_CHARGE_AMOUNTS.fuelSurcharge })
  }

  if (draft.needsPackaging) {
    items.push({ label: 'Packaging Fee', amount: BOOKING_CHARGE_AMOUNTS.packaging })
  }

  if (draft.manualStep >= 6) {
    if (draft.selectedAddons.includes('signature')) {
      items.push({
        label: 'Signature on Delivery',
        amount: BOOKING_CHARGE_AMOUNTS.signature,
      })
    }
    if (draft.selectedAddons.includes('protection')) {
      items.push({
        label: 'Parcel Protection',
        amount: BOOKING_CHARGE_AMOUNTS.protection,
      })
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  if (subtotal > 0) {
    const gst = Math.round(subtotal * 0.1 * 100) / 100
    items.push({ label: 'GST (10%)', amount: gst })
  }

  return items
}

export function calculateBookingTotal(draft: ManualBookingDraft) {
  const items = buildBookingPriceLineItems(draft)
  const subtotalBeforeGst = items
    .filter((item) => item.label !== 'GST (10%)')
    .reduce((sum, item) => sum + item.amount, 0)

  if (subtotalBeforeGst <= 0) {
    return null
  }

  const gstItem = items.find((item) => item.label === 'GST (10%)')
  const gst = gstItem?.amount ?? 0
  return Math.round((subtotalBeforeGst + gst) * 100) / 100
}

export function formatBookingAmount(amount: number) {
  return `$${amount.toFixed(2)}`
}

export function isParcelValueProvided(parcelValue: string) {
  const trimmed = parcelValue.trim()
  if (!trimmed) {
    return false
  }
  const amount = Number(trimmed)
  return Number.isFinite(amount) && amount > 0
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
  if (draft.manualStep < 4) {
    return 'Add delivery details in step 4.'
  }

  if (draft.deliveryMethod === 'door') {
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
  if (draft.manualStep < 6) {
    return { text: 'Not yet selected', faded: true }
  }

  if (draft.selectedAddons.length === 0) {
    return { text: 'Not yet selected', faded: true }
  }

  const labels = draft.selectedAddons
    .map((id) => ADDON_SUMMARY_LABELS[id])
    .filter(Boolean)

  return { text: labels.join(', '), faded: false }
}
