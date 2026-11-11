import { Box, CircleDollarSign, Route, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { manualFlowStepTitleClassName } from './manualFormShared'
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
      className={`flex gap-2 border-b border-border-light py-2 last:border-b-0 sm:gap-2.5 sm:py-2.5 ${
        faded ? 'opacity-45' : ''
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10 ${
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
    draft.manualStep >= 4 ? getContentTypeLabel(draft.contentType) : 'Add contents in step 4'
  const routeText = buildRouteSummary(draft)
  const extras = buildExtrasSummary(draft)
  const total = calculateBookingTotal(draft)

  return (
    <aside
      className={`flex flex-col rounded-sm border border-border-light bg-white p-3 sm:p-4 lg:sticky lg:top-0 ${className}`}
      aria-label="Booking summary"
    >
      <h2 className={manualFlowStepTitleClassName}>Booking Summary</h2>

      <div className="mt-1.5">
        <SummaryBlock icon={Box} label="Parcel">
          <p
            className={`text-sm font-bold ${parcel ? 'text-black' : 'text-text-muted italic'}`}
          >
            {parcelSizeLabel}
          </p>
          <p className="text-sm text-[#94a3b8]">{parcelSizeMeta}</p>
          <p
            className={`text-sm ${
              draft.manualStep >= 4 ? 'text-[#94a3b8]' : 'text-text-muted italic'
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
              'text-[#334155]'
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
            className={`text-xl font-bold tracking-tight sm:text-2xl ${
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
