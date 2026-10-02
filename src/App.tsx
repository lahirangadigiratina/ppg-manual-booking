import { useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { PpgAgentPortal } from './components/ppg/PpgAgentPortal'
import type { NavItemId } from './config/navigation'
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

function App() {
  const [activeNavId, setActiveNavId] = useState<NavItemId>('returns')

  const isPpg = activeNavId === 'ppg'

  return (
    <AppLayout
      activeNavId={activeNavId}
      onNavigate={setActiveNavId}
      pageTitle={pageTitleForNav(activeNavId)}
      locationName={hubMeta.locationName}
      hubName={hubMeta.hubName}
      showTopHeader={!isPpg}
      mainClassName={
        isPpg
          ? 'flex min-h-0 flex-col overflow-hidden bg-white'
          : 'overflow-y-auto bg-page-bg'
      }
    >
      {isPpg ? <PpgAgentPortal /> : <ReturnParcelContent />}
    </AppLayout>
  )
}

export default App
