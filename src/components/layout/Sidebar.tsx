import type { LucideIcon } from 'lucide-react'
import { navItems, type NavItemId } from '../../config/navigation'
import { HubbedLogo } from './HubbedLogo'

const INTERACTIVE_NAV_IDS: NavItemId[] = ['returns', 'ppg']

/** Bottom bar on small screens — must include interactive destinations (e.g. PPG). */
const MOBILE_NAV_IDS: NavItemId[] = [
  'collection',
  'returns',
  'manual-checkin',
  'reports',
  'ppg',
]

interface SidebarProps {
  activeId: NavItemId
  onNavigate: (id: NavItemId) => void
}

function navItemClassName(active: boolean, interactive: boolean) {
  if (!interactive) {
    return 'flex w-full flex-col items-center gap-1 px-1 py-2.5 text-gray-500'
  }
  return `group flex w-full flex-col items-center gap-1 px-1 py-2.5 transition-colors ${
    active ? 'text-black' : 'text-gray-700 hover:text-black'
  }`
}

function NavItemContent({
  label,
  icon: Icon,
  active,
  badge,
}: {
  label: string
  icon: LucideIcon
  active?: boolean
  badge?: number
}) {
  return (
    <>
      <span className="relative">
        <Icon className="size-6" strokeWidth={active ? 2.25 : 1.75} />
        {badge !== undefined && (
          <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold leading-none text-white">
            {badge}
          </span>
        )}
      </span>
      <span
        className={`max-w-[72px] text-center text-[10px] leading-tight sm:text-[11px] ${
          active ? 'font-semibold' : 'font-medium'
        }`}
      >
        {label}
      </span>
    </>
  )
}

export function Sidebar({ activeId, onNavigate }: SidebarProps) {
  return (
    <>
      <aside className="sticky top-0 hidden h-svh w-[88px] shrink-0 flex-col border-r border-border-light bg-white md:flex lg:w-[96px] self-start">
        <div className="flex shrink-0 justify-center border-b border-border-light py-4">
          <HubbedLogo />
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-3" aria-label="Main navigation">
          {navItems.map((item) => {
            const interactive = INTERACTIVE_NAV_IDS.includes(item.id)
            const active = item.id === activeId

            if (interactive) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={navItemClassName(active, true)}
                  aria-current={active ? 'page' : undefined}
                >
                  <NavItemContent
                    label={item.label}
                    icon={item.icon}
                    active={active}
                    badge={item.badge}
                  />
                </button>
              )
            }

            return (
              <div
                key={item.id}
                className={navItemClassName(active, false)}
                aria-hidden={false}
              >
                <NavItemContent
                  label={item.label}
                  icon={item.icon}
                  active={false}
                  badge={item.badge}
                />
              </div>
            )
          })}
        </nav>
      </aside>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border-light bg-white md:hidden"
        aria-label="Main navigation"
      >
        {MOBILE_NAV_IDS.map((id) => navItems.find((item) => item.id === id))
          .filter((item): item is (typeof navItems)[number] => item !== undefined)
          .map((item) => {
          const Icon = item.icon
          const active = item.id === activeId
          const interactive = INTERACTIVE_NAV_IDS.includes(item.id)

          if (interactive) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[9px] ${
                  active ? 'font-semibold text-black' : 'font-medium text-gray-600'
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                <span className="truncate px-0.5">{item.label.split(' ')[0]}</span>
                {item.badge !== undefined && (
                  <span className="absolute right-2 top-1 size-3.5 rounded-full bg-red-600 text-[8px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          }

          return (
            <div
              key={item.id}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[9px] font-medium text-gray-400"
            >
              <Icon className="size-5" strokeWidth={1.75} />
              <span className="truncate px-0.5">{item.label.split(' ')[0]}</span>
              {item.badge !== undefined && (
                <span className="absolute right-2 top-1 size-3.5 rounded-full bg-red-600 text-[8px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
