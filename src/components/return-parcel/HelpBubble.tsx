import { X } from 'lucide-react'
import { useState } from 'react'

export function HelpBubble() {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-border-light bg-white py-2 pl-4 pr-2 shadow-md md:bottom-6 md:right-6">
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
