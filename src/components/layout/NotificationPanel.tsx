import { ChevronRight } from 'lucide-react'
import { MOCK_HUB_NOTIFICATIONS, type HubNotification } from './notificationsMock'

interface NotificationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  docked?: boolean
}

function NotificationCard({ item }: { item: HubNotification }) {
  return (
    <article className="rounded-md bg-[#eceff2] px-3.5 py-3 shadow-[0_2px_0_0_#d5d8dc]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-sm font-bold leading-snug text-black">{item.title}</h3>
        <time className="shrink-0 text-[11px] font-normal leading-none text-[#9ca3af]">
          {item.date}
        </time>
      </div>
      {item.rawMessage ? (
        <p className="mt-2 break-words text-xs leading-snug text-[#4b5563]">{item.rawMessage}</p>
      ) : (
        <p className="mt-2 text-xs leading-snug text-[#4b5563]">
          {item.message}
          {item.linkHref && item.linkLabel ? (
            <>
              {' '}
              <a
                href={item.linkHref}
                target="_blank"
                rel="noreferrer"
                className="text-black underline underline-offset-2 hover:text-text-muted"
              >
                {item.linkLabel}
              </a>
            </>
          ) : null}
        </p>
      )}
    </article>
  )
}

function RailToggleTriangle({ direction }: { direction: 'left' | 'right' }) {
  if (direction === 'right') {
    return (
      <span
        className="block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-black"
        aria-hidden
      />
    )
  }
  return (
    <span
      className="block h-0 w-0 border-y-[6px] border-r-[9px] border-y-transparent border-r-black"
      aria-hidden
    />
  )
}

function RailToggleButton({
  direction,
  onClick,
  ariaLabel,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center p-0"
      aria-label={ariaLabel}
    >
      <RailToggleTriangle direction={direction} />
    </button>
  )
}

function NotificationList() {
  return (
    <ul className="flex flex-col gap-2.5">
      {MOCK_HUB_NOTIFICATIONS.map((item) => (
        <li key={item.id}>
          <NotificationCard item={item} />
        </li>
      ))}
    </ul>
  )
}

function DockedNotificationRail({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <aside
      className={`relative hidden h-full shrink-0 overflow-hidden rounded-lg border border-border-light bg-white shadow-md transition-[width] duration-200 ease-out lg:flex ${
        open ? 'w-[21.5rem]' : 'w-5'
      }`}
      aria-label="Notifications"
    >
      <div className="relative flex w-5 shrink-0 flex-col border-r border-border-light bg-[#e8eaed]">
        <div className="relative min-h-0 flex-1">
          <RailToggleButton
            direction={open ? 'right' : 'left'}
            onClick={() => onOpenChange(!open)}
            ariaLabel={open ? 'Collapse notifications' : 'Expand notifications'}
          />
        </div>
      </div>

      {open ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
          <div className="flex shrink-0 items-center justify-between gap-2 px-4 pb-3 pt-4">
            <h2 className="text-[15px] font-bold text-black">Notification</h2>
            <button
              type="button"
              className="text-sm font-bold text-black underline underline-offset-2 hover:text-text-muted"
            >
              View All
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-0">
            <NotificationList />
          </div>
        </div>
      ) : null}
    </aside>
  )
}

export function NotificationPanel({
  open,
  onOpenChange,
  docked = true,
}: NotificationPanelProps) {
  if (docked) {
    return <DockedNotificationRail open={open} onOpenChange={onOpenChange} />
  }

  if (!open) {
    return null
  }

  const collapse = () => onOpenChange(false)

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        role="presentation"
        onClick={collapse}
      />
      <aside
        className="fixed inset-y-0 right-0 z-40 flex w-[min(100vw-2rem,21.5rem)] flex-col overflow-hidden rounded-l-lg border border-border-light bg-white shadow-xl"
        aria-label="Notifications"
      >
        <button
          type="button"
          onClick={collapse}
          className="absolute left-3 top-3 rounded-md p-1 text-text-muted hover:bg-gray-100 hover:text-black"
          aria-label="Close notifications"
        >
          <ChevronRight className="size-5" strokeWidth={2} aria-hidden />
        </button>

        <div className="flex shrink-0 items-center justify-between gap-2 px-4 pb-2.5 pt-12">
          <h2 className="text-[15px] font-bold text-black">Notification</h2>
          <button
            type="button"
            className="text-sm font-bold text-black underline underline-offset-2 hover:text-text-muted"
          >
            View All
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-white px-3 pb-4">
          <NotificationList />
        </div>
      </aside>
    </>
  )
}
