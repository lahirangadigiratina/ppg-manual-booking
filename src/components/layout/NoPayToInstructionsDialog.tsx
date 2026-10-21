import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface NoPayToInstructionsDialogProps {
  open: boolean
  onClose: () => void
  anchor?: boolean
}

function InstructionsList() {
  return (
    <ol className="min-h-0 list-none space-y-4 overflow-y-auto px-4 py-4 sm:space-y-5 sm:px-5 sm:py-5">
      <li className="flex gap-3 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
          1
        </span>
        <span className="min-w-0 pt-0.5">Log in to your internet or mobile banking app.</span>
      </li>
      <li className="flex gap-3 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
          2
        </span>
        <span className="min-w-0 pt-0.5">
          Find the section where your bank displays your PayTo agreements. PayTo agreement that
          needs your approval will be marked as{' '}
          <strong className="font-bold text-black">&ldquo;Pending authorisation&rdquo;</strong>.
        </span>
      </li>
      <li className="flex gap-3 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
          3
        </span>
        <span className="min-w-0 pt-0.5">
          Once you click on the PayTo agreement, the payment terms will be displayed for you to
          check.
        </span>
      </li>
      <li className="flex gap-3 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
          4
        </span>
        <span className="min-w-0 pt-0.5">
          If you are ready to authorise it, click{' '}
          <strong className="font-bold text-black">&lsquo;Approve&rsquo;</strong>. The agreement
          will then be marked as{' '}
          <strong className="font-bold text-black">&lsquo;Active&rsquo;</strong>.
        </span>
      </li>
    </ol>
  )
}

export function NoPayToInstructionsDialog({
  open,
  onClose,
  anchor = false,
}: NoPayToInstructionsDialogProps) {
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

  const overlayClassName = anchor
    ? 'absolute inset-0 z-10 flex items-center justify-center rounded-sm bg-black/40 p-3 sm:p-4'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'

  const panelClassName = anchor
    ? 'flex max-h-full min-h-0 w-full flex-col overflow-hidden rounded-sm border border-border-light bg-white shadow-xl'
    : 'flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col rounded-sm border border-border-light bg-white shadow-xl'

  return (
    <div className={overlayClassName} role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nopayto-instructions-title"
        className={panelClassName}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-light px-4 py-3 sm:px-5 sm:py-4">
          <h2 id="nopayto-instructions-title" className="text-lg font-bold text-black sm:text-xl">
            Instructions
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
            aria-label="Close instructions"
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <InstructionsList />
      </div>
    </div>
  )
}
