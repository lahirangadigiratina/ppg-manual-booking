export interface HubNotification {
  id: string
  title: string
  date: string
  message: string
  linkHref?: string
  linkLabel?: string
  /** Shown verbatim (reference UI for link/HTML rows). */
  rawMessage?: string
}

/** Notification list matching hub portal reference UI. */
export const MOCK_HUB_NOTIFICATIONS: HubNotification[] = [
  {
    id: '1',
    title: 'TEST 17th april 2025',
    date: '17 Apr 2025',
    message: 'test message',
  },
  {
    id: '2',
    title: 'Test Amazon Print Free',
    date: '2 Mar 2025',
    message: 'Attention Team, Please check on this',
  },
  {
    id: '3',
    title: 'Test 5',
    date: '5 Jun 2024',
    message: 'Test 5',
  },
  {
    id: '4',
    title: 'Link Test',
    date: '13 Feb 2024',
    message: 'Location',
    rawMessage: 'Location <a href="https://www.google.com">Visit google!</a>',
  },
  {
    id: '5',
    title: 'Test1',
    date: '9 Feb 2024',
    message: 'This location is opened from 8am - 5pm.',
  },
]
