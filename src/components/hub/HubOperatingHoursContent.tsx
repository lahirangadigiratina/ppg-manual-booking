import { ChevronDown, ChevronUp, Clock } from 'lucide-react'
import {
  HUB_OPERATING_HOURS_SCHEDULE,
  HUB_OPERATING_HOURS_SUMMARY,
  type HubDayOperatingHours,
  type HubTimeValue,
} from './hubOperatingHoursData'

function HubHoursToggle({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        on ? 'bg-black' : 'bg-[#d1d5db]'
      }`}
      aria-hidden
    >
      <span
        className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
          on ? 'translate-x-[1.375rem]' : 'translate-x-0.5'
        }`}
      />
    </span>
  )
}

function TimeSpinnerArrows() {
  return (
    <span className="flex flex-col text-[#6b7280]" aria-hidden>
      <ChevronUp className="-mb-1 size-3" strokeWidth={2.5} />
      <ChevronDown className="size-3" strokeWidth={2.5} />
    </span>
  )
}

function HubTimePickerField({
  value,
  enabled,
  id,
}: {
  value: HubTimeValue
  enabled: boolean
  id: string
}) {
  const placeholder = !enabled
  const valueClass = enabled
    ? 'font-semibold text-[#374151]'
    : 'font-medium text-[#9ca3af]'

  return (
    <div
      className={`flex min-w-[11.5rem] items-center gap-1.5 rounded-md border border-[#d1d5db] bg-[#eceff2] px-2 py-1.5 sm:min-w-[12.5rem] sm:px-2.5 ${
        enabled ? '' : 'opacity-90'
      }`}
      id={id}
      aria-disabled={!enabled}
    >
      <div className={`flex items-center gap-0.5 text-sm ${valueClass}`}>
        <span className="tabular-nums">{value.hour}</span>
        {enabled ? <TimeSpinnerArrows /> : null}
      </div>
      <span className={`text-sm ${enabled ? 'text-[#374151]' : 'text-[#9ca3af]'}`}>:</span>
      <div className={`flex items-center gap-0.5 text-sm ${valueClass}`}>
        <span className="tabular-nums">{value.minute}</span>
        {enabled ? <TimeSpinnerArrows /> : null}
      </div>
      <div
        className={`ml-0.5 flex items-center gap-0.5 text-sm ${valueClass} ${
          placeholder ? 'text-[#9ca3af]' : ''
        }`}
      >
        <span>{value.period}</span>
        <ChevronDown className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
      </div>
      <Clock
        className={`ml-auto size-4 shrink-0 ${enabled ? 'text-[#374151]' : 'text-[#9ca3af]'}`}
        strokeWidth={2}
        aria-hidden
      />
    </div>
  )
}

function OperatingHoursRow({ row }: { row: HubDayOperatingHours }) {
  const dayId = row.day.toLowerCase()

  return (
    <tr className="border-b border-border-light last:border-b-0">
      <td className="whitespace-nowrap py-3 pr-3 text-sm font-medium text-black sm:py-3.5 sm:pr-4">
        {row.day}
      </td>
      <td className="py-3 pr-3 sm:py-3.5 sm:pr-4">
        <HubHoursToggle on={row.open} />
        <span className="sr-only">{row.open ? 'Open' : 'Closed'}</span>
      </td>
      <td className="py-3 pr-3 sm:py-3.5 sm:pr-4">
        <HubTimePickerField
          id={`${dayId}-open-time`}
          value={row.openTime}
          enabled={row.open}
        />
      </td>
      <td className="py-3 sm:py-3.5">
        <HubTimePickerField
          id={`${dayId}-close-time`}
          value={row.closeTime}
          enabled={row.open}
        />
      </td>
    </tr>
  )
}

export function HubOperatingHoursContent() {
  return (
    <>
      <p className="text-xs leading-relaxed text-black sm:text-sm">{HUB_OPERATING_HOURS_SUMMARY}</p>

      <div className="mt-5 overflow-x-auto sm:mt-6">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="bg-black text-white">
              <th scope="col" className="px-3 py-2.5 text-xs font-semibold sm:px-4 sm:text-sm">
                Working day
              </th>
              <th scope="col" className="px-3 py-2.5 text-xs font-semibold sm:px-4 sm:text-sm">
                Close / Open
              </th>
              <th scope="col" className="px-3 py-2.5 text-xs font-semibold sm:px-4 sm:text-sm">
                Open Time
              </th>
              <th scope="col" className="px-3 py-2.5 text-xs font-semibold sm:px-4 sm:text-sm">
                Close Time
              </th>
            </tr>
          </thead>
          <tbody>
            {HUB_OPERATING_HOURS_SCHEDULE.map((row) => (
              <OperatingHoursRow key={row.day} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
