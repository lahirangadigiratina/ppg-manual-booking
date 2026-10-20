import { CircleHelp } from 'lucide-react'
import { useCallback, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PayToAgreementIntroContent } from '../../payto/PayToAgreementIntroContent'
import { manualFlowStepTitleClassName } from '../ppg/manualFormShared'

const TOOLTIP_WIDTH_PX = 600
const TOOLTIP_GAP_PX = 8

export function PayToAgreementTitleTooltip({ children }: { children?: ReactNode }) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) {
      return
    }
    const rect = anchor.getBoundingClientRect()
    const maxLeft = window.innerWidth - TOOLTIP_WIDTH_PX - 16
    const left = Math.min(Math.max(16, rect.left), Math.max(16, maxLeft))
    setPosition({
      top: rect.bottom + TOOLTIP_GAP_PX,
      left,
    })
  }, [])

  const showTooltip = () => {
    updatePosition()
    setOpen(true)
  }

  const hideTooltip = () => {
    setOpen(false)
  }

  return (
    <>
      <div
        ref={anchorRef}
        className="relative z-[1] w-fit max-w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-indigo-100"
        tabIndex={0}
        aria-describedby={open ? 'payto-agreement-title-tooltip' : undefined}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        <div className="flex items-center gap-2">
          <h1 className={manualFlowStepTitleClassName}>
            {children ?? 'Request PayTo Agreement'}
          </h1>
          <CircleHelp
            className="size-4 shrink-0 text-text-muted sm:size-[18px]"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      </div>

      {open
        ? createPortal(
            <div
              role="tooltip"
              id="payto-agreement-title-tooltip"
              className="pointer-events-none fixed z-[200] box-border rounded-md border border-border-light bg-white p-3 shadow-lg sm:p-4"
              style={{
                top: position.top,
                left: position.left,
                width: TOOLTIP_WIDTH_PX,
                maxWidth: 'calc(100vw - 2rem)',
              }}
            >
              <p className="mb-2 text-xs font-bold text-black sm:text-sm">
                What is a PayTo agreement?
              </p>
              <PayToAgreementIntroContent />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
