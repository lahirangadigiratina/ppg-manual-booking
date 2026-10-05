import { ManualStepNav } from './manualFormShared'

interface PpgManualStepFooterProps {
  manualStep: number
  onBack: () => void
  onNext: () => void
}

export function PpgManualStepFooter({
  manualStep,
  onBack,
  onNext,
}: PpgManualStepFooterProps) {
  if (manualStep < 1 || manualStep > 7) {
    return null
  }

  return (
    <div className="shrink-0 border-t border-border-light bg-white pt-4">
      <ManualStepNav onBack={onBack} onNext={onNext} />
    </div>
  )
}
