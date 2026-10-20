export type Meridiem = 'AM' | 'PM'

export interface HubTimeValue {
  hour: string
  minute: string
  period: Meridiem
}

export interface HubDayOperatingHours {
  day: string
  open: boolean
  openTime: HubTimeValue
  closeTime: HubTimeValue
}

export const HUB_OPERATING_HOURS_SUMMARY =
  'Operating Hours : Monday : closed, Tuesday : 06:00 AM - 09:00 PM, Wednesday - Thursday : 05:00 AM - 09:00 PM, Friday : closed, Saturday : 05:00 AM - 12:00 PM, Sunday : closed.'

export const HUB_OPERATING_HOURS_SCHEDULE: HubDayOperatingHours[] = [
  {
    day: 'Monday',
    open: false,
    openTime: { hour: 'HH', minute: 'MM', period: 'AM' },
    closeTime: { hour: 'HH', minute: 'MM', period: 'AM' },
  },
  {
    day: 'Tuesday',
    open: true,
    openTime: { hour: '06', minute: '00', period: 'AM' },
    closeTime: { hour: '09', minute: '00', period: 'PM' },
  },
  {
    day: 'Wednesday',
    open: true,
    openTime: { hour: '05', minute: '00', period: 'AM' },
    closeTime: { hour: '09', minute: '00', period: 'PM' },
  },
  {
    day: 'Thursday',
    open: true,
    openTime: { hour: '05', minute: '00', period: 'AM' },
    closeTime: { hour: '09', minute: '00', period: 'PM' },
  },
  {
    day: 'Friday',
    open: false,
    openTime: { hour: 'HH', minute: 'MM', period: 'AM' },
    closeTime: { hour: 'HH', minute: 'MM', period: 'AM' },
  },
  {
    day: 'Saturday',
    open: true,
    openTime: { hour: '05', minute: '00', period: 'AM' },
    closeTime: { hour: '12', minute: '00', period: 'PM' },
  },
  {
    day: 'Sunday',
    open: false,
    openTime: { hour: 'HH', minute: 'MM', period: 'AM' },
    closeTime: { hour: 'HH', minute: 'MM', period: 'AM' },
  },
]
