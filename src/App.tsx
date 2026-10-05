import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PpgAgentPortal } from './components/ppg/PpgAgentPortal'
import type { NavItemId } from './config/navigation'
import { PPG_HOME_PATH } from './config/ppgRoutes'
import { ReturnParcelContent } from './pages/ReturnParcelContent'

const hubMeta = {
  locationName: 'Parcelpoint Martin Place',
  hubName: 'HUBBED Martin Place Metro',
} as const

function pageTitleForNav(id: NavItemId): string {
  if (id === 'returns') return 'Return Parcel'
  if (id === 'ppg') return 'PPG Agent Portal'
  return 'Return Parcel'
}

function navIdFromPath(pathname: string): NavItemId {
  return pathname.startsWith(PPG_HOME_PATH) ? 'ppg' : 'returns'
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
    navigate(id === 'ppg' ? PPG_HOME_PATH : '/returns')
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/returns" replace />} />
      <Route
        path="*"
        element={
          <AppLayout
            activeNavId={activeNavId}
            onNavigate={handleNavigate}
            pageTitle={pageTitleForNav(activeNavId)}
            locationName={hubMeta.locationName}
            hubName={hubMeta.hubName}
            mainClassName={
              activeNavId === 'ppg'
                ? 'flex min-h-0 flex-col overflow-hidden bg-page-bg'
                : 'overflow-y-auto bg-page-bg'
            }
          >
            {activeNavId === 'ppg' ? <PpgAgentPortal /> : <ReturnParcelContent />}
          </AppLayout>
        }
      />
    </Routes>
  )
}

export default App
