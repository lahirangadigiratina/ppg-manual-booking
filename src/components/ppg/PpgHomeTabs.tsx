import { Clock, User } from 'lucide-react'
import type { ReactNode } from 'react'

export type PpgHomeTabId = 'booking' | 'profile' | 'pay' | 'report'

const HOME_TABS: {
  id: PpgHomeTabId
  label: string
  available: boolean
}[] = [
  { id: 'booking', label: 'Booking', available: true },
  { id: 'profile', label: 'Profile', available: true },
  { id: 'pay', label: 'Pay to', available: false },
  { id: 'report', label: 'Report', available: false },
]

export function PpgHomeTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: PpgHomeTabId
  onTabChange: (tab: PpgHomeTabId) => void
}) {
  return (
    <nav
      className="mb-6 flex gap-1 overflow-x-auto border-b border-border-light pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="PPG home sections"
    >
      {HOME_TABS.map((tab) => {
        const selected = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-current={selected ? 'page' : undefined}
            className={`relative shrink-0 px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 sm:text-base ${
              selected
                ? 'text-black after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-hubbed-orange sm:after:inset-x-3'
                : 'text-text-muted hover:text-black'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {!tab.available ? (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Soon
                </span>
              ) : null}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border-light py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm font-semibold text-black sm:text-right">{value}</span>
    </div>
  )
}

export function PpgHomeProfilePanel() {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border-light bg-gray-100">
          <User className="size-6 text-gray-700" strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <p className="text-lg font-bold text-black">Agent profile</p>
          <p className="text-sm text-text-muted">Store and terminal details for this hub</p>
        </div>
      </div>

      <div className="rounded-xl border border-border-light bg-white p-4 sm:p-5">
        <ProfileRow label="Store" value="Kavanaghs Pharmacy" />
        <ProfileRow label="Location" value="Parcelpoint Martin Place" />
        <ProfileRow label="Hub" value="HUBBED Martin Place Metro" />
        <ProfileRow label="Agent" value="Demo Agent" />
        <ProfileRow label="PPG merchant ID" value="PPG-AU-10482" />
        <ProfileRow label="Terminal" value="PARCELPOINT · Lane 1" />
        <ProfileRow label="Support" value="support@hubbed.com.au" />
      </div>

      <p className="mt-4 text-xs leading-snug text-text-muted sm:text-sm">
        Demo profile data for layout review. Live profile sync will connect to your store account.
      </p>
    </div>
  )
}

export function PpgHomeComingSoonPanel({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border-light bg-gray-50 px-6 py-12 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Clock className="size-6 text-hubbed-orange" strokeWidth={1.75} aria-hidden />
      </span>
      <h3 className="text-lg font-bold text-black">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">{description}</p>
    </div>
  )
}

export function PpgHomeTabPanel({
  activeTab,
  bookingContent,
}: {
  activeTab: PpgHomeTabId
  bookingContent: ReactNode
}) {
  if (activeTab === 'booking') {
    return <>{bookingContent}</>
  }

  if (activeTab === 'profile') {
    return <PpgHomeProfilePanel />
  }

  if (activeTab === 'pay') {
    return (
      <PpgHomeComingSoonPanel
        title="Pay to"
        description="In-store pay-to-store flows and settlement views will be available here in a future release."
      />
    )
  }

  return (
    <PpgHomeComingSoonPanel
      title="Report"
      description="Booking and payment reports for your store will be available here in a future release."
    />
  )
}
