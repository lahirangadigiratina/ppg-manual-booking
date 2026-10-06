import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  ManualFieldLabel,
  manualInputClassName,
} from './manualFormShared'

const contentTypes = [
  { value: 'electronics', label: 'Electronics', emoji: '💻' },
  { value: 'clothing-fashion', label: 'Clothing & Fashion', emoji: '👕' },
  { value: 'food-perishables', label: 'Food & Perishables', emoji: '🍎' },
  { value: 'fragile-items', label: 'Fragile Items', emoji: '⚠️' },
  { value: 'sporting-goods', label: 'Sporting Goods', emoji: '⚽' },
  { value: 'books-media', label: 'Books & Media', emoji: '📚' },
  { value: 'health-beauty', label: 'Health & Beauty', emoji: '💊' },
  { value: 'household-items', label: 'Household Items', emoji: '🏡' },
  { value: 'other', label: 'Other', emoji: '📦' },
] as const

function WhatsInsideSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = contentTypes.find((type) => type.value === value) ?? contentTypes[0]

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id="whats-inside"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`${manualInputClassName} flex w-full items-center justify-between gap-3 py-3.5 pl-4 pr-4 text-left`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="text-lg leading-none" aria-hidden>
            {selected.emoji}
          </span>
          <span className="truncate text-base text-black">{selected.label}</span>
        </span>
        <ChevronDown
          className={`size-5 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby="whats-inside"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-border-light bg-white py-1 shadow-lg"
        >
          {contentTypes.map((type) => {
            const isSelected = type.value === value
            return (
              <li key={type.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(type.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                    isSelected ? 'bg-[#fff0eb]' : ''
                  }`}
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {type.emoji}
                  </span>
                  <span className="flex-1 text-sm font-medium text-black sm:text-base">
                    {type.label}
                  </span>
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-black" strokeWidth={2.5} aria-hidden />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

interface ManualContentsStepProps {
  parcelValue: string
  onParcelValueChange: (value: string) => void
  contentType: string
  onContentTypeChange: (value: string) => void
}

export function ManualContentsStep({
  parcelValue,
  onParcelValueChange,
  contentType,
  onContentTypeChange,
}: ManualContentsStepProps) {
  const [referenceNumber, setReferenceNumber] = useState('')

  return (
    <div>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <ManualFieldLabel htmlFor="whats-inside">What&apos;s inside?</ManualFieldLabel>
          <WhatsInsideSelect value={contentType} onChange={onContentTypeChange} />
        </div>

        <div>
          <ManualFieldLabel htmlFor="parcel-value" required>
            Parcel Value ($)
          </ManualFieldLabel>
          <input
            id="parcel-value"
            type="number"
            min={0.01}
            step={0.01}
            required
            value={parcelValue}
            onChange={(e) => onParcelValueChange(e.target.value)}
            className={manualInputClassName}
            aria-required="true"
          />
        </div>

        <div>
          <ManualFieldLabel htmlFor="reference-number">
            Reference number (optional)
          </ManualFieldLabel>
          <input
            id="reference-number"
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="e.g. REF2026ORDER001"
            className={manualInputClassName}
          />
        </div>
      </form>

    </div>
  )
}
