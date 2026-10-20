const BAR_HEIGHTS = [18, 32, 44, 32, 18] as const

function HubbedBarLoader() {
  return (
    <div className="flex items-end justify-center gap-1.5 sm:gap-2" aria-hidden>
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className="w-1.5 origin-bottom animate-[hubbed-bar-pulse_0.9s_ease-in-out_infinite] rounded-sm bg-white sm:w-2"
          style={{
            height,
            animationDelay: `${index * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}

export function FullScreenBlockingLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      <HubbedBarLoader />
    </div>
  )
}
