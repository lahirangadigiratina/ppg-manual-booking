import { Box, CircleDollarSign, Route, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  buildExtrasSummary,
  buildRouteSummary,
  calculateBookingTotal,
  formatDeclaredValue,
  formatWeightForSummary,
  getContentTypeLabel,
  getParcelSizeById,
  type ManualBookingDraft,
} from './manualBookingState'

function SummaryBlock({
  icon: Icon,
  label,
  faded,
  children,
}: {
  icon: LucideIcon
  label: string
  faded?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`flex gap-3 border-b border-border-light py-4 last:border-b-0 ${
        faded ? 'opacity-45' : ''
      }`}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
          faded ? 'bg-gray-50' : 'bg-gray-100'
        }`}
      >
        <Icon className="size-[18px] text-gray-700" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-muted">{label}</p>
        <div className="mt-1 space-y-0.5">{children}</div>
      </div>
    </div>
  )
}

interface PpgBookingSummaryPanelProps {
  draft: ManualBookingDraft
  className?: string
}

export function PpgBookingSummaryPanel({ draft, className = '' }: PpgBookingSummaryPanelProps) {
  const parcel = getParcelSizeById(draft.parcelSizeId)
  const parcelSizeLabel = parcel?.name ?? 'Select size in step 1'
  const parcelSizeMeta = parcel
    ? `${formatWeightForSummary(parcel.weight)} · ${parcel.dimensions.replace(/×/g, 'x')}`
    : '—'
  const contentLabel =
    draft.manualStep >= 5 ? getContentTypeLabel(draft.contentType) : 'Add contents in step 5'
  const routeText = buildRouteSummary(draft)
  const extras = buildExtrasSummary(draft)
  const total = calculateBookingTotal(draft)

  return (
    <aside
      className={`flex flex-col rounded-sm border border-border-light bg-white p-5 sm:p-6 ${className}`}
      aria-label="Booking summary"
    >
      <h2 className="text-base font-bold text-black sm:text-lg">Booking Summary</h2>

      <div className="mt-2">
        <SummaryBlock icon={Box} label="Parcel">
          <p
            className={`text-sm font-bold ${parcel ? 'text-black' : 'text-text-muted italic'}`}
          >
            {parcelSizeLabel}
          </p>
          <p className="text-sm text-[#94a3b8]">{parcelSizeMeta}</p>
          <p
            className={`text-sm ${
              draft.manualStep >= 5 ? 'text-[#94a3b8]' : 'text-text-muted italic'
            }`}
          >
            {contentLabel}
          </p>
          <p className="text-sm text-text-muted">
            Declared value: {formatDeclaredValue(draft.parcelValue)}
          </p>
        </SummaryBlock>

        <SummaryBlock icon={Route} label="Route">
          <p
            className={`text-sm leading-snug ${
              draft.manualStep >= 4 ? 'text-[#334155]' : 'text-[#94a3b8]'
            }`}
          >
            {routeText}
          </p>
        </SummaryBlock>

        <SummaryBlock icon={Shield} label="Extras" faded={extras.faded}>
          <p className="text-sm text-text-muted">{extras.text}</p>
        </SummaryBlock>

        <SummaryBlock icon={CircleDollarSign} label="Estimated Price">
          <p
            className={`text-2xl font-bold tracking-tight ${
              total === null ? 'text-gray-300' : 'text-black'
            }`}
          >
            {total === null ? '$—.—' : `$${total.toFixed(2)}`}
          </p>
        </SummaryBlock>
      </div>
    </aside>
  )
}
