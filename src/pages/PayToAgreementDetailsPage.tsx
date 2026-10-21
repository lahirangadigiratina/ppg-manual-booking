import { useMemo, useState } from 'react'
import type { PayToAgreementStatus } from '../config/appRoutes'
import { HubProfileLayout } from '../components/layout/HubProfileLayout'
import { PayToAgreementIntroDialog } from '../components/layout/PayToAgreementIntroDialog'
import { PayToInstructionsDialog } from '../components/layout/PayToInstructionsDialog'
import {
  manualFlowStepTitleClassName,
  manualSecondaryButtonClassName,
} from '../components/ppg/manualFormShared'
import { getPayToAgreementForDisplay } from '../payto/paytoAgreementStorage'
import { usePayToIntroGate } from '../payto/usePayToIntroGate'

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

export function PayToAgreementDetailsPage() {
  const agreement = useMemo(() => getPayToAgreementForDisplay(), [])
  const { introOpen, dismissIntro } = usePayToIntroGate()
  const [instructionsOpen, setInstructionsOpen] = useState(false)

  return (
    <HubProfileLayout>
      <div className="relative overflow-hidden rounded-sm border border-border-light bg-white p-3 sm:p-4 lg:p-5">
        <div
          className={introOpen ? 'pointer-events-none opacity-50' : undefined}
          aria-hidden={introOpen}
        >
          <h1 className={manualFlowStepTitleClassName}>PayTo Agreement Details</h1>
        <p className="mt-0.5 text-[11px] leading-snug text-text-muted line-clamp-none sm:text-xs">
          Your PayTo agreement request for this hub
        </p>

        <div className="mt-5 rounded-lg border border-border-light px-3 sm:mt-6 sm:px-4">
          <DetailRow label="BSB" value={agreement.bsb} />
          <DetailRow label="Account Number" value={agreement.accountNumber} />
          <DetailRow label="Name" value={agreement.payerName} />
          <DetailRow label="Agreement ID" value={agreement.agreementId} />
          <DetailRow label="Agreement Summary" value={agreement.agreementSummary} />
          <DetailRow label="Payment Frequency" value={agreement.paymentFrequency} />
          <DetailRow label="Status" value={statusLabel(agreement.status)} />
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

        <PayToAgreementIntroDialog anchor open={introOpen} onClose={dismissIntro} />

        <PayToInstructionsDialog
          anchor
          open={instructionsOpen && !introOpen}
          onClose={() => setInstructionsOpen(false)}
        />
      </div>
    </HubProfileLayout>
  )
}
