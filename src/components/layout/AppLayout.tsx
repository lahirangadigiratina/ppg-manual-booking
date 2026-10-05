import type { NavItemId } from '../../config/navigation'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

interface AppLayoutProps {
  activeNavId: NavItemId
  onNavigate: (id: NavItemId) => void
  pageTitle: string
  locationName: string
  hubName: string
  showTopHeader?: boolean
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
  contentShellClassName = 'bg-page-bg',
  mainClassName = 'overflow-y-auto bg-page-bg',
  children,
}: AppLayoutProps) {
  return (
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
            notificationCount={0}
          />
        )}
        <main className={`min-h-0 flex-1 ${mainClassName}`}>{children}</main>
      </div>
    </div>
  )
}
