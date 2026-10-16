import { useState } from 'react'
import { DangerousGoodsDialog } from './DangerousGoodsDialog'
import {
  ManualContentsStepHeading,
  ManualStepHeading,
} from './manualFormShared'

const STEP_TITLES: Record<number, { step: number; title: string; helperText: string }> = {
  1: {
    step: 1,
    title: 'Parcel Details',
    helperText: 'Size, packaging, receiver address, and door delivery.',
  },
  2: {
    step: 2,
    title: 'Sender Details',
    helperText:
      'Enter the sender’s mobile first. If we recognize the number, we’ll fill in their details.',
  },
  3: {
    step: 3,
    title: 'Receiver Details',
    helperText: 'Enter who will receive the parcel and how to reach them.',
  },
}

export function PpgManualFlowStepHeader({ manualStep }: { manualStep: number }) {
  const [dangerousGoodsOpen, setDangerousGoodsOpen] = useState(false)

  if (manualStep < 1 || manualStep > 4) {
    return null
  }

  if (manualStep === 4) {
    return (
      <>
        <div className="shrink-0 border-b border-border-light bg-white pb-2">
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
    <div className="shrink-0 border-b border-border-light bg-white pb-1.5">
      <ManualStepHeading
        step={meta.step}
        title={meta.title}
        helperText={meta.helperText}
        pinned
      />
    </div>
  )
}
