interface PpgPortalHeaderProps {
  badge: string
  className?: string
  /** Tighter spacing for manual-flow sticky toolbar */
  compact?: boolean
}

export function PpgPortalHeader({
  badge,
  className = '',
  compact = false,
}: PpgPortalHeaderProps) {
  return (
    <header
      className={
        compact
          ? `mb-2 flex items-center justify-between gap-3 pb-2 ${className}`
          : `mb-8 flex items-start justify-between gap-4 border-b border-border-light pb-6 ${className}`
      }
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className={`flex shrink-0 items-center justify-center rounded-full bg-black font-bold text-white ${
            compact ? 'size-8 text-xs' : 'size-9 text-sm'
          }`}
          aria-hidden
        >
          P
        </div>
        <h1
          className={`font-bold tracking-tight text-black ${
            compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
          }`}
        >
          PPG Agent Portal
        </h1>
      </div>
      <span
        className={`shrink-0 rounded-full bg-gray-100 font-medium text-text-muted ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm'
        }`}
      >
        {badge}
      </span>
    </header>
  )
}
