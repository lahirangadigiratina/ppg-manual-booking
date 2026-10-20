import { HubOperatingHoursContent } from '../components/hub/HubOperatingHoursContent'
import { HubProfileLayout } from '../components/layout/HubProfileLayout'
import { manualFlowStepTitleClassName } from '../components/ppg/manualFormShared'

export function HubOperatingHoursPage() {
  return (
    <HubProfileLayout>
      <div className="rounded-sm border border-border-light bg-white p-3 sm:p-4 lg:p-5">
        <h1 className={manualFlowStepTitleClassName}>Operating Hours</h1>

        <div className="mt-2 sm:mt-2.5">
          <HubOperatingHoursContent />
        </div>
      </div>
    </HubProfileLayout>
  )
}
