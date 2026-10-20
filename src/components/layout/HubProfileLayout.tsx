import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { HubProfileTabs } from './HubProfileTabs'
export function HubProfileLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-black"
        >
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
          Back
        </button>

        <HubProfileTabs />
        {children}
      </div>
    </div>
  )
}
