import type { LucideIcon } from 'lucide-react'
import { Calendar, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  HUB_OPERATING_HOURS_PATH,
  HUB_PERSONAL_STORE_PATH,
  PAYTO_AGREEMENT_PATH,
} from '../../config/appRoutes'

function PayToMark({ active }: { active: boolean }) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-md sm:size-7 ${
        active ? 'bg-white' : 'border border-border-light bg-white'
      }`}
      aria-hidden
    >
      <span className="text-[8px] font-bold leading-none tracking-tight text-black sm:text-[9px]">
        PayTo
      </span>
    </span>
  )
}

function HubProfileTab({
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
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-center text-[10px] font-bold leading-snug transition-colors sm:gap-2 sm:px-3 sm:py-3 sm:text-xs lg:text-sm ${
        active
          ? 'bg-[#2b2f36] text-white shadow-sm'
          : 'border border-border-light bg-gray-50 text-black hover:border-gray-300 hover:bg-white'
      }`}
    >
      {leading ??
        (Icon ? (
          <Icon
            className={`size-5 shrink-0 sm:size-6 ${active ? 'text-white' : 'text-black'}`}
            strokeWidth={1.75}
            aria-hidden
          />
        ) : null)}
      <span className="min-w-0">{label}</span>
    </button>
  )
}

export function HubProfileTabs() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const payToActive = pathname.startsWith(PAYTO_AGREEMENT_PATH)
  const personalActive = pathname.startsWith(HUB_PERSONAL_STORE_PATH)
  const hoursActive = pathname.startsWith(HUB_OPERATING_HOURS_PATH)

  return (
    <nav className="mb-4 flex flex-row gap-2 sm:mb-5" aria-label="Hub profile sections">
      <HubProfileTab
        active={personalActive}
        label="Location Details"
        icon={MapPin}
        onClick={() => navigate(HUB_PERSONAL_STORE_PATH)}
      />
      <HubProfileTab
        active={hoursActive}
        label="Operating Hours"
        icon={Calendar}
        onClick={() => navigate(HUB_OPERATING_HOURS_PATH)}
      />
      <HubProfileTab
        active={payToActive}
        label="PayTo Agreement"
        leading={<PayToMark active={payToActive} />}
        onClick={() => navigate(PAYTO_AGREEMENT_PATH)}
      />
    </nav>
  )
}
