import type { LucideIcon } from 'lucide-react'
import {
  Ban,
  Banknote,
  Box,
  FlaskConical,
  PawPrint,
  Pill,
  Snowflake,
  X,
} from 'lucide-react'
import type { SVGProps } from 'react'
import { useEffect, useRef } from 'react'

function FirecrackerIcon({
  className,
  strokeWidth = 1.75,
  ...props
}: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2.5V6" />
      <path d="M10 2.5c0-.8 2-.8 2 0" />
      <path d="M9.5 2l1 2M14.5 2l-1 2" />
      <path d="M9.5 7.5h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1z" />
      <path d="M9.5 11.5h5M9.5 15h5" />
    </svg>
  )
}

const RESTRICTED_ITEMS: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: 'Illegal Goods',
    description: 'Illegal or stolen goods.',
    icon: Ban,
  },
  {
    title: 'Weapons & Explosives',
    description: 'Firearms, weapons, ammunition, explosives and fireworks',
    icon: FirecrackerIcon as LucideIcon,
  },
  {
    title: 'Hazardous Materials',
    description:
      'Radioactive, corrosive, toxic, flammable, oxidising or otherwise hazardous substances',
    icon: FlaskConical,
  },
  {
    title: 'Cash & Valuables',
    description: 'Cash, bullion, negotiable instruments, securities or similar valuables',
    icon: Banknote,
  },
  {
    title: 'Live Animals & Biological Materials',
    description: 'Live animals, human or animal remains and biological materials.',
    icon: PawPrint,
  },
  {
    title: 'Medicines',
    description:
      'Prescription medicines, controlled drugs or pharmaceuticals unless accepted under the selected service.',
    icon: Pill,
  },
  {
    title: 'Perishables',
    description: 'Perishable goods or goods requiring refrigeration or temperature control',
    icon: Snowflake,
  },
  {
    title: 'Specialist Handling',
    description:
      'Any goods requiring specialist handling that are not expressly accepted through PARCELPOINT Go',
    icon: Box,
  },
]

interface DangerousGoodsDialogProps {
  open: boolean
  onClose: () => void
}

export function DangerousGoodsDialog({ open, onClose }: DangerousGoodsDialogProps) {
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
        aria-labelledby="dangerous-goods-title"
        className="flex max-h-[min(90vh,720px)] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-light px-5 py-4 sm:px-6">
          <h2 id="dangerous-goods-title" className="text-lg font-bold text-black sm:text-xl">
            Dangerous &amp; prohibited goods
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {RESTRICTED_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className="rounded-xl border border-border-light bg-white p-4"
                >
                  <Icon
                    className="mb-2 size-5 text-hubbed-orange"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <h3 className="text-sm font-bold text-black">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-snug text-text-muted sm:text-sm">
                    {item.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
