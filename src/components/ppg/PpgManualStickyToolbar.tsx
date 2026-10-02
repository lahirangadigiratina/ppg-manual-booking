import { ManualFlowStepper } from './ManualFlowStepper'
import { PpgPortalHeader } from './PpgPortalHeader'

interface PpgManualStickyToolbarProps {
  manualStep: number
  manualStepCount: number
}

function manualBadge(manualStep: number, manualStepCount: number) {
  if (manualStep === 8) {
    return 'Awaiting payment'
  }
  if (manualStep === 7) {
    return 'Ready to charge'
  }
  return `Manual · ${Math.min(manualStep, manualStepCount)}/${manualStepCount}`
}

/** Fixed chrome at top of manual flow; scroll happens in sibling content area. */
export function PpgManualStickyToolbar({
  manualStep,
  manualStepCount,
}: PpgManualStickyToolbarProps) {
  const showStepper = manualStep >= 1 && manualStep <= 8

  return (
    <div className="shrink-0 space-y-0 bg-white">
      <PpgPortalHeader badge={manualBadge(manualStep, manualStepCount)} compact />
      {showStepper && <ManualFlowStepper manualStep={manualStep} compact />}
      <div
        className="mt-3 border-b border-border-light sm:mt-4"
        aria-hidden
      />
    </div>
  )
}
