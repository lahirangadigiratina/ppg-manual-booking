import { Bell, User } from 'lucide-react'

interface TopHeaderProps {
  pageTitle: string
  locationName: string
  hubName: string
  notificationCount?: number
}

export function TopHeader({
  pageTitle,
  locationName,
  hubName,
  notificationCount = 0,
}: TopHeaderProps) {
  return (
    <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border-light bg-white px-4 py-3 sm:px-6 lg:px-8">
      <h1 className="text-lg font-bold text-black sm:text-xl">{pageTitle}</h1>

      <div className="hidden flex-1 justify-center lg:flex">
        <p className="text-sm font-bold text-black sm:text-base">{locationName}</p>
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative rounded p-1 text-black hover:bg-gray-100"
          aria-label={`Notifications, ${notificationCount} unread`}
        >
          <Bell className="size-5" strokeWidth={1.75} />
          <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {notificationCount}
          </span>
        </button>

        <span className="hidden h-8 w-px bg-border-light sm:block" aria-hidden />

        <div className="hidden items-center gap-2 sm:flex">
          <span className="max-w-[140px] truncate text-xs font-semibold text-black lg:max-w-none lg:text-sm">
            {hubName}
          </span>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-gray-100">
            <User className="size-5 text-gray-700" strokeWidth={1.75} />
          </div>
        </div>
      </div>

      <p className="w-full text-center text-sm font-bold text-black lg:hidden">{locationName}</p>
    </header>
  )
}
