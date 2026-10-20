import { X } from 'lucide-react'
import { useState } from 'react'

/** Speech bubble mark (pill + tail) matching hub help rail artwork. */
export function HubbedChatBubbleIcon({ className = 'size-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 26"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <rect x="1" y="3" width="42" height="13" rx="6.5" />
      <polygon points="27,16 34,16 30.5,23" />
    </svg>
  )
}

/** Hubbed orange chat FAB — bottom-right of the app shell (desktop). */
export function HelpChatViewportFab() {
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <>
      <HelpChatPopover
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        className="fixed bottom-[4.75rem] right-5 z-[60] w-[min(calc(100vw-2.5rem),16rem)] rounded-md lg:block"
      />
      <button
        type="button"
        onClick={() => setHelpOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-[60] hidden size-11 items-center justify-center bg-hubbed-orange text-black shadow-md transition-colors hover:bg-hubbed-orange-hover lg:flex"
        aria-label="Get help"
      >
        <HubbedChatBubbleIcon className="size-7" />
      </button>
    </>
  )
}

export function HelpBubble() {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-border-light bg-white py-2 pl-4 pr-2 shadow-md md:bottom-6 md:right-6 lg:hidden">
      <p className="text-sm text-black">Hi. Need any help?</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        aria-label="Dismiss help message"
      >
        <X className="size-4" strokeWidth={2} />
      </button>
    </div>
  )
}

export function HelpChatPopover({
  open,
  onClose,
  className = '',
}: {
  open: boolean
  onClose: () => void
  className?: string
}) {
  if (!open) {
    return null
  }

  return (
    <div
      className={`border border-border-light bg-white p-3 shadow-lg ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-black">Hi. Need any help?</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 text-gray-600 hover:bg-gray-100"
          aria-label="Close help"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
