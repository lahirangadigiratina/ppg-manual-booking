import { AppLayout } from '../components/layout/AppLayout'
import { ReturnParcelContent } from './ReturnParcelContent'

export function ReturnParcelPage() {
  return (
    <AppLayout
      activeNavId="returns"
      onNavigate={() => {}}
      pageTitle="Return Parcel"
      locationName="Parcelpoint Martin Place"
      hubName="HUBBED Martin Place Metro"
    >
      <ReturnParcelContent />
    </AppLayout>
  )
}
