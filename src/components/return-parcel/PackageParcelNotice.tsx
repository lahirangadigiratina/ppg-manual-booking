import { Package } from 'lucide-react'

export function PackageParcelNotice({ className = 'mt-4' }: { className?: string }) {
  return (
    <div
      className={`flex w-full items-center gap-2.5 rounded-lg border border-border-light bg-gray-100 px-3 py-2.5 text-sm font-medium text-black ${className}`}
    >
      <Package className="size-4 shrink-0 text-black" strokeWidth={2} aria-hidden />
      <span>Please package this parcel before proceeding.</span>
    </div>
  )
}
