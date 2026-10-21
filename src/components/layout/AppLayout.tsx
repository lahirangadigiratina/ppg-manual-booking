import { useEffect, useState } from 'react'
import type { NavItemId } from '../../config/navigation'
import { MOCK_HUB_NOTIFICATIONS } from './notificationsMock'
import { HelpChatViewportFab } from './HelpChatButton'
import { NotificationPanel } from './NotificationPanel'
import { NotificationPanelProvider } from './NotificationPanelContext'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

interface AppLayoutProps {
  activeNavId: NavItemId
  onNavigate: (id: NavItemId) => void
  pageTitle: string
  locationName: string
  hubName: string
  showTopHeader?: boolean
  showNotificationPanel?: boolean
  showHelpChat?: boolean
  /** Background for the main content column (Returns: gray, PPG: white). */
  contentShellClassName?: string
  mainClassName?: string
  children: React.ReactNode
}

export function AppLayout({
  activeNavId,
  onNavigate,
  pageTitle,
  locationName,
  hubName,
  showTopHeader = true,
  showNotificationPanel = false,
  showHelpChat = false,
  contentShellClassName = 'bg-page-bg',
  mainClassName = 'overflow-y-auto bg-page-bg',
  children,
}: AppLayoutProps) {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(true)

  useEffect(() => {
    if (!showNotificationPanel) {
      return
    }
    const media = window.matchMedia('(min-width: 1024px)')
    const syncPanelForViewport = () => {
      setNotificationPanelOpen(media.matches)
    }
    syncPanelForViewport()
    media.addEventListener('change', syncPanelForViewport)
    return () => media.removeEventListener('change', syncPanelForViewport)
  }, [showNotificationPanel])

  const toggleNotifications = () => {
    setNotificationPanelOpen((open) => !open)
  }

  return (
    <NotificationPanelProvider
      show={showNotificationPanel}
      open={notificationPanelOpen}
      onOpenChange={setNotificationPanelOpen}
    >
      <div className="flex h-svh min-h-0 overflow-hidden bg-page-bg">
        <Sidebar activeId={activeNavId} onNavigate={onNavigate} />
        <div
          className={`flex min-h-0 min-w-0 flex-1 flex-col pb-16 md:pb-0 ${contentShellClassName}`}
        >
          {showTopHeader && (
            <TopHeader
              pageTitle={pageTitle}
              locationName={locationName}
              hubName={hubName}
              notificationCount={MOCK_HUB_NOTIFICATIONS.length}
              onNotificationClick={showNotificationPanel ? toggleNotifications : undefined}
            />
          )}
          <div className="flex min-h-0 min-w-0 flex-1">
            <main className={`min-h-0 min-w-0 flex-1 ${mainClassName}`}>{children}</main>
            {showNotificationPanel ? (
              <div className="box-border flex min-h-0 shrink-0 flex-col self-stretch pr-5 pt-5 sm:pt-6 lg:pt-8">
                <div className="min-h-0 flex-1">
                  <NotificationPanel
                    docked
                    open={notificationPanelOpen}
                    onOpenChange={setNotificationPanelOpen}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {showHelpChat ? <HelpChatViewportFab /> : null}
      </div>
    </NotificationPanelProvider>
  )
}
