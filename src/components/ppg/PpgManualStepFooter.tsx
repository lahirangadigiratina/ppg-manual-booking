import { ManualStepNav } from './manualFormShared'

interface PpgManualStepFooterProps {
  manualStep: number
  onBack: () => void
  onNext: () => void
  nextDisabled?: boolean
}

export function PpgManualStepFooter({
  manualStep,
  onBack,
  onNext,
  nextDisabled = false,
}: PpgManualStepFooterProps) {
  if (manualStep < 1 || manualStep > 5) {
    return null
  }

  return (
    <div className="shrink-0 border-t border-border-light bg-white pt-4">
      <ManualStepNav
        onBack={onBack}
        onNext={onNext}
        nextDisabled={nextDisabled}
        nextLabel={manualStep === 5 ? 'Pay' : 'Next'}
      />
    </div>
  )
}
