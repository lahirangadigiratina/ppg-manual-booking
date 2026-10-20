import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PpgAgentPortal } from './components/ppg/PpgAgentPortal'
import type { NavItemId } from './config/navigation'
import { PPG_HOME_PATH } from './config/ppgRoutes'
import {
  HUB_OPERATING_HOURS_PATH,
  HUB_PERSONAL_STORE_PATH,
  isHubProfilePath,
  PAYTO_AGREEMENT_DETAILS_PATH,
  PAYTO_AGREEMENT_PATH,
  REPORTS_PATH,
} from './config/appRoutes'
import { HubProfileRouter } from './pages/HubProfileRouter'
import { ReportsContent } from './pages/ReportsContent'
import { ReturnParcelContent } from './pages/ReturnParcelContent'

const hubMeta = {
  locationName: 'Parcelpoint Martin Place',
  hubName: 'HUBBED Martin Place Metro',
} as const

function pageTitleForNav(id: NavItemId): string {
  if (id === 'returns') return 'Return Parcel'
  if (id === 'reports') return 'Transaction History'
  if (id === 'ppg') return 'PPG Agent Portal'
  return 'Return Parcel'
}

function pageTitleForPath(pathname: string, navId: NavItemId): string {
  if (pathname.startsWith(PAYTO_AGREEMENT_DETAILS_PATH)) {
    return 'PayTo Agreement Details'
  }
  if (pathname.startsWith(PAYTO_AGREEMENT_PATH)) {
    return 'PayTo Agreement'
  }
  if (pathname.startsWith(HUB_PERSONAL_STORE_PATH)) {
    return 'Location Details'
  }
  if (pathname.startsWith(HUB_OPERATING_HOURS_PATH)) {
    return 'Operating Hours'
  }
  return pageTitleForNav(navId)
}

function navIdFromPath(pathname: string): NavItemId {
  if (pathname.startsWith(PPG_HOME_PATH)) {
    return 'ppg'
  }
  if (pathname.startsWith(REPORTS_PATH)) {
    return 'reports'
  }
  return 'returns'
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeNavId, setActiveNavId] = useState<NavItemId>(() =>
    navIdFromPath(location.pathname),
  )

  useEffect(() => {
    setActiveNavId(navIdFromPath(location.pathname))
  }, [location.pathname])

  const handleNavigate = (id: NavItemId) => {
    setActiveNavId(id)
    if (id === 'ppg') {
      navigate(PPG_HOME_PATH)
      return
    }
    if (id === 'reports') {
      navigate(REPORTS_PATH)
      return
    }
    navigate('/returns')
  }

  const isHubProfile = isHubProfilePath(location.pathname)
  const isPpgMain =
    activeNavId === 'ppg' &&
    !isHubProfile &&
    location.pathname.startsWith(PPG_HOME_PATH)
  const isReportsMain =
    activeNavId === 'reports' &&
    !isHubProfile &&
    location.pathname.startsWith(REPORTS_PATH)

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/returns" replace />} />
      <Route
        path="*"
        element={
          <AppLayout
            activeNavId={activeNavId}
            onNavigate={handleNavigate}
            pageTitle={pageTitleForPath(location.pathname, activeNavId)}
            locationName={hubMeta.locationName}
            hubName={hubMeta.hubName}
            showNotificationPanel={!isPpgMain}
            mainClassName={
              isPpgMain || isReportsMain
                ? 'flex min-h-0 flex-col overflow-hidden bg-page-bg'
                : 'overflow-y-auto bg-page-bg'
            }
          >
            {isHubProfile ? (
              <HubProfileRouter />
            ) : activeNavId === 'ppg' ? (
              <PpgAgentPortal />
            ) : activeNavId === 'reports' ? (
              <ReportsContent />
            ) : (
              <ReturnParcelContent />
            )}
          </AppLayout>
        }
      />
    </Routes>
  )
}

export default App
