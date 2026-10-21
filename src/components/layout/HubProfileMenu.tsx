import type { LucideIcon } from 'lucide-react'
import { Calendar, MapPin, User } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  HUB_OPERATING_HOURS_PATH,
  HUB_PERSONAL_STORE_PATH,
  NOPAYTO_AGREEMENT_PATH,
  PAYTO_AGREEMENT_PATH,
} from '../../config/appRoutes'
import { noPayToProfilePath } from '../../nopayto/noPayToAgreementStorage'
import { paytoProfilePath } from '../../payto/paytoAgreementStorage'

function AgreementMark({
  active,
  label,
}: {
  active: boolean
  label: string
}) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
        active ? 'bg-white' : 'border border-border-light bg-white'
      }`}
      aria-hidden
    >
      <span className="text-[7px] font-bold leading-none tracking-tight text-black">{label}</span>
    </span>
  )
}

function MenuItem({
  active,
  label,
  icon: Icon,
  leading,
  onClick,
}: {
  active: boolean
  label: string
  icon?: LucideIcon
  leading?: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
        active ? 'bg-[#2b2f36] text-white' : 'text-black hover:bg-gray-50'
      }`}
    >
      {leading ??
        (Icon ? (
          <Icon
            className={`size-5 shrink-0 ${active ? 'text-white' : 'text-black'}`}
            strokeWidth={1.75}
            aria-hidden
          />
        ) : null)}
      <span>{label}</span>
    </button>
  )
}

export function HubProfileMenu() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const payToActive = pathname.startsWith(PAYTO_AGREEMENT_PATH)
  const noPayToActive = pathname.startsWith(NOPAYTO_AGREEMENT_PATH)
  const personalActive = pathname.startsWith(HUB_PERSONAL_STORE_PATH)
  const hoursActive = pathname.startsWith(HUB_OPERATING_HOURS_PATH)

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const goTo = (path: string) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <div ref={rootRef} className="relative">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className="relative z-50 flex size-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-gray-100 transition-colors hover:bg-gray-200"
        aria-label="Hub profile"
      >
        <User className="size-5 text-gray-700" strokeWidth={1.75} aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Hub profile sections"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border-light bg-white p-1.5 shadow-lg"
        >
          <MenuItem
            active={personalActive}
            label="Location Details"
            icon={MapPin}
            onClick={() => goTo(HUB_PERSONAL_STORE_PATH)}
          />
          <MenuItem
            active={hoursActive}
            label="Operating Hours"
            icon={Calendar}
            onClick={() => goTo(HUB_OPERATING_HOURS_PATH)}
          />
          <MenuItem
            active={payToActive}
            label="PayTo Agreement"
            leading={<AgreementMark active={payToActive} label="PayTo" />}
            onClick={() => goTo(paytoProfilePath())}
          />
          <MenuItem
            active={noPayToActive}
            label="NoPayTo Agreement"
            leading={<AgreementMark active={noPayToActive} label="NoPT" />}
            onClick={() => goTo(noPayToProfilePath())}
          />
        </div>
      )}
    </div>
  )
}
