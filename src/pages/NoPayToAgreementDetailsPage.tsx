import { ChevronDown } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PayToAgreementRecord, PayToAgreementStatus } from '../config/appRoutes'
import { HubProfileLayout } from '../components/layout/HubProfileLayout'
import { NoPayToAgreementIntroDialog } from '../components/layout/NoPayToAgreementIntroDialog'
import { NoPayToInstructionsDialog } from '../components/layout/NoPayToInstructionsDialog'
import {
  manualFlowStepTitleClassName,
  manualSecondaryButtonClassName,
} from '../components/ppg/manualFormShared'
import {
  getNoPayToAgreementsForDisplay,
  noPayToCreateAgreementPath,
} from '../nopayto/noPayToAgreementStorage'
import { useNoPayToIntroGate } from '../nopayto/useNoPayToIntroGate'

function statusLabel(status: PayToAgreementStatus) {
  if (status === 'active') {
    return 'Active'
  }
  return 'Pending authorisation'
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-0.5 border-b border-border-light py-3 text-sm last:border-b-0">
      <span className="font-medium text-black">{label}</span>
      <span className="justify-self-end text-right font-semibold text-black">{value}</span>
    </div>
  )
}

function AgreementCard({
  agreement,
  index,
  total,
  expanded,
  onToggle,
}: {
  agreement: PayToAgreementRecord
  index: number
  total: number
  expanded: boolean
  onToggle: () => void
}) {
  const panelId = useId()
  const title = total > 1 ? `Agreement ${index + 1}` : 'NoPayTo agreement'
  const summaryBits = [agreement.payerName, agreement.agreementId, statusLabel(agreement.status)]
    .filter(Boolean)
    .join(' · ')

  return (
    <section
      className="overflow-hidden rounded-lg border border-border-light"
      aria-label={
        total > 1 ? `NoPayTo agreement ${index + 1} of ${total}` : 'NoPayTo agreement'
      }
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-gray-50 sm:px-4"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-black">{title}</p>
          <p className="mt-0.5 truncate text-xs text-text-muted">{summaryBits}</p>
        </div>
        <ChevronDown
          className={`size-5 shrink-0 text-gray-600 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      {expanded ? (
        <div id={panelId} className="border-t border-border-light px-3 sm:px-4">
          <DetailRow label="BSB" value={agreement.bsb} />
          <DetailRow label="Account Number" value={agreement.accountNumber} />
          <DetailRow label="Name" value={agreement.payerName} />
          <DetailRow label="Agreement ID" value={agreement.agreementId} />
          <DetailRow label="Agreement Summary" value={agreement.agreementSummary} />
          <DetailRow label="Payment Frequency" value={agreement.paymentFrequency} />
          <DetailRow label="Status" value={statusLabel(agreement.status)} />
        </div>
      ) : null}
    </section>
  )
}

export function NoPayToAgreementDetailsPage() {
  const navigate = useNavigate()
  const agreements = useMemo(() => getNoPayToAgreementsForDisplay(), [])
  const { introOpen, dismissIntro } = useNoPayToIntroGate()
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(() =>
    Math.max(0, agreements.length - 1),
  )

  return (
    <HubProfileLayout>
      <div className="relative overflow-hidden rounded-sm border border-border-light bg-white p-3 sm:p-4 lg:p-5">
        <div
          className={introOpen ? 'pointer-events-none opacity-50' : undefined}
          aria-hidden={introOpen}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className={manualFlowStepTitleClassName}>NoPayTo Agreement Details</h1>
              <p className="mt-0.5 text-[11px] leading-snug text-text-muted line-clamp-none sm:text-xs">
                {agreements.length > 1
                  ? `${agreements.length} NoPayTo agreement requests for this store`
                  : 'Your NoPayTo agreement request for this store'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(noPayToCreateAgreementPath())}
              className="shrink-0 rounded-md bg-black px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-900 sm:py-2.5 sm:text-base"
            >
              Create new agreement
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:mt-6">
            {agreements.map((agreement, index) => (
              <AgreementCard
                key={`${agreement.agreementId}-${index}`}
                agreement={agreement}
                index={index}
                total={agreements.length}
                expanded={expandedIndex === index}
                onToggle={() =>
                  setExpandedIndex((current) => (current === index ? -1 : index))
                }
              />
            ))}
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setInstructionsOpen(true)}
              className={`w-full ${manualSecondaryButtonClassName}`}
            >
              View authorisation instructions
            </button>
          </div>
        </div>

        <NoPayToAgreementIntroDialog anchor open={introOpen} onClose={dismissIntro} />

        <NoPayToInstructionsDialog
          anchor
          open={instructionsOpen && !introOpen}
          onClose={() => setInstructionsOpen(false)}
        />
      </div>
    </HubProfileLayout>
  )
}
