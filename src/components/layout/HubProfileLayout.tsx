import type { ReactNode } from 'react'

export function HubProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </div>
  )
}
