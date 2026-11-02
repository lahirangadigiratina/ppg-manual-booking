/** Matches Confirm Dropoff actions on Returns (history row, cash confirmation dialog). */
export const confirmDropoffButtonClassName =
  'rounded-md bg-hubbed-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-hubbed-orange-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-hubbed-orange sm:px-6 sm:py-3'

export const DEMO_SHIPPING_LABEL_PDF_URL = '/labels/Label_HCIGLJJJ3_1.pdf'
export const DEMO_SHIPPING_LABEL_PDF_FILENAME = 'Label_HCIGLJJJ3_1.pdf'

export function downloadDemoShippingLabel(): void {
  const link = document.createElement('a')
  link.href = DEMO_SHIPPING_LABEL_PDF_URL
  link.download = DEMO_SHIPPING_LABEL_PDF_FILENAME
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
}
