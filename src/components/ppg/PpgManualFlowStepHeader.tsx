import { useState } from 'react'
import { DangerousGoodsDialog } from './DangerousGoodsDialog'
import {
  ManualContentsStepHeading,
  ManualStepHeading,
} from './manualFormShared'

const STEP_TITLES: Record<number, { step: number; title: string }> = {
  1: { step: 1, title: 'Parcel Details' },
  2: { step: 2, title: 'Sender Details' },
  3: { step: 3, title: 'Receiver Details' },
  4: { step: 4, title: 'Delivery Address' },
  6: { step: 6, title: 'Offer Add-ons to Customer' },
}

export function PpgManualFlowStepHeader({ manualStep }: { manualStep: number }) {
  const [dangerousGoodsOpen, setDangerousGoodsOpen] = useState(false)

  if (manualStep < 1 || manualStep > 6) {
    return null
  }

  if (manualStep === 5) {
    return (
      <>
        <div className="shrink-0 border-b border-border-light bg-white pb-4">
          <ManualContentsStepHeading
            pinned
            onDangerousGoodsClick={() => setDangerousGoodsOpen(true)}
          />
        </div>
        <DangerousGoodsDialog
          open={dangerousGoodsOpen}
          onClose={() => setDangerousGoodsOpen(false)}
        />
      </>
    )
  }

  const meta = STEP_TITLES[manualStep]
  if (!meta) {
    return null
  }

  return (
    <div className="shrink-0 border-b border-border-light bg-white pb-4">
      <ManualStepHeading step={meta.step} title={meta.title} pinned />
    </div>
  )
}
