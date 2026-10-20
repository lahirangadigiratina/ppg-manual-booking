import { createContext, useContext, type ReactNode } from 'react'
import { NotificationPanel } from './NotificationPanel'

interface NotificationPanelContextValue {
  show: boolean
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const NotificationPanelContext = createContext<NotificationPanelContextValue | null>(
  null,
)

export function NotificationPanelProvider({
  show,
  open,
  onOpenChange,
  children,
}: {
  show: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  const value: NotificationPanelContextValue = {
    show,
    open,
    setOpen: onOpenChange,
    toggle: () => onOpenChange(!open),
  }

  return (
    <NotificationPanelContext.Provider value={value}>
      {children}
      {show ? (
        <div className="lg:hidden">
          <NotificationPanel docked={false} open={open} onOpenChange={onOpenChange} />
        </div>
      ) : null}
    </NotificationPanelContext.Provider>
  )
}

export function useNotificationPanel() {
  return useContext(NotificationPanelContext)
}
