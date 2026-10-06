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

export function calculateBookingTotal(draft: ManualBookingDraft) {
  let subtotal = 0

  if (draft.manualStep >= 4) {
    subtotal += 10.85 + 1.0
  }

  if (draft.needsPackaging) {
    subtotal += 3.0
  }

  if (draft.manualStep >= 6) {
    if (draft.selectedAddons.includes('signature')) {
      subtotal += 2.2
    }
    if (draft.selectedAddons.includes('protection')) {
      subtotal += 2.5
    }
  }

  if (subtotal <= 0) {
    return null
  }

  const gst = Math.round(subtotal * 0.1 * 100) / 100
  const total = Math.round((subtotal + gst) * 100) / 100
  return total
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
