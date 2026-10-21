export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'

export type TransactionReportTab = 'monthly' | 'all' | 'daily-sweep'

export interface TransactionRecord {
  id: string
  customerName: string
  date: string
  status: TransactionStatus
  product: string
  amount: string
}

export const MOCK_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'HUBBED0004',
    customerName: 'John Doe',
    date: '10/09/2025 1:37 PM',
    status: 'PENDING',
    product: 'Drop-off',
    amount: '$3.50',
  },
  {
    id: 'HUBBED0005',
    customerName: 'Jane Smith',
    date: '10/09/2025 2:15 PM',
    status: 'COMPLETED',
    product: 'Drop-off',
    amount: '$5.00',
  },
  {
    id: 'HUBBED0006',
    customerName: 'Bob Wilson',
    date: '10/09/2025 3:42 PM',
    status: 'CANCELLED',
    product: 'Drop-off',
    amount: '$2.75',
  },
  {
    id: 'HUBBED0007',
    customerName: 'Alice Brown',
    date: '11/09/2025 9:20 AM',
    status: 'COMPLETED',
    product: 'Drop-off',
    amount: '$4.25',
  },
  {
    id: 'HUBBED0008',
    customerName: 'Charlie Davis',
    date: '11/09/2025 10:05 AM',
    status: 'PENDING',
    product: 'Drop-off',
    amount: '$6.00',
  },
  {
    id: 'HUBBED0009',
    customerName: 'Emma Taylor',
    date: '11/09/2025 11:30 AM',
    status: 'COMPLETED',
    product: 'Drop-off',
    amount: '$3.50',
  },
  {
    id: 'HUBBED0010',
    customerName: 'Frank Miller',
    date: '12/09/2025 8:45 AM',
    status: 'PENDING',
    product: 'Drop-off',
    amount: '$7.25',
  },
  {
    id: 'HUBBED0011',
    customerName: 'Grace Lee',
    date: '12/09/2025 1:12 PM',
    status: 'COMPLETED',
    product: 'Drop-off',
    amount: '$2.50',
  },
  {
    id: 'HUBBED0012',
    customerName: 'Henry Clark',
    date: '12/09/2025 2:55 PM',
    status: 'CANCELLED',
    product: 'Drop-off',
    amount: '$4.00',
  },
  {
    id: 'HUBBED0013',
    customerName: 'Ivy Martinez',
    date: '13/09/2025 9:08 AM',
    status: 'COMPLETED',
    product: 'Drop-off',
    amount: '$5.75',
  },
]

export type DailySweepStatus = 'PENDING' | 'DECLINED' | 'FAILED' | 'APPROVED'

export interface DailySweepRecord {
  id: string
  status: DailySweepStatus
  time: string
  sweepAmount: string
  totalAmount: string
}

export const MOCK_DAILY_SWEEP: DailySweepRecord[] = [
  { id: 'HUBBED0004', status: 'PENDING', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'HUBBED0004', status: 'DECLINED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'HUBBED0004', status: 'FAILED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'HUBBED0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'HUBBED0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'HUBBED0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'HUBBED0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'HUBBED0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'HUBBED0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'HUBBED0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
]

const REPORT_ROW_COUNT = 50

export const REPORT_TRANSACTIONS: TransactionRecord[] = Array.from(
  { length: REPORT_ROW_COUNT },
  (_, index) => {
    const seed = MOCK_TRANSACTIONS[index % MOCK_TRANSACTIONS.length]
    return {
      ...seed,
      id: `HUBBED${String(index + 4).padStart(4, '0')}`,
    }
  },
)

export const REPORT_DAILY_SWEEP: DailySweepRecord[] = Array.from(
  { length: REPORT_ROW_COUNT },
  (_, index) => {
    const seed = MOCK_DAILY_SWEEP[index % MOCK_DAILY_SWEEP.length]
    return {
      ...seed,
      id: `HUBBED${String(index + 4).padStart(4, '0')}`,
    }
  },
)
