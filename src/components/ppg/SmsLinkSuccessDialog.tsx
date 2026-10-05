import { Check } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface SmsLinkSuccessDialogProps {
  open: boolean
  mobileNumber: string
  onClose: () => void
}

function formatAustralianMobileDisplay(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return '—'
  }
  if (trimmed.startsWith('+')) {
    return trimmed
  }
  const digits = trimmed.replace(/\D/g, '')
  if (digits.startsWith('61')) {
    return `+${digits}`
  }
  if (digits.startsWith('0')) {
    return `+61 ${digits.slice(1)}`
  }
  return `+61 ${digits}`
}

export function SmsLinkSuccessDialog({
  open,
  mobileNumber,
  onClose,
}: SmsLinkSuccessDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sms-success-title"
        aria-describedby="sms-success-desc"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100">
          <Check className="size-6 text-green-700" strokeWidth={2.5} aria-hidden />
        </div>
        <h2 id="sms-success-title" className="text-center text-lg font-bold text-black">
          Success
        </h2>
        <p id="sms-success-desc" className="mt-2 text-center text-sm leading-snug text-text-muted sm:text-base">
          Link successfully sent to{' '}
          <span className="font-semibold tabular-nums text-black">
            {formatAustralianMobileDisplay(mobileNumber)}
          </span>
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900 sm:text-base"
        >
          OK
        </button>
      </div>
    </div>
  )
}
