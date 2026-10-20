export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'

export type TransactionReportTab = 'all' | 'daily-sweep'

export interface TransactionRecord {
  id: string
  customerName: string
  date: string
  status: TransactionStatus
  servicePillar: string
  serviceType: string
  product: string
  amount: string
}

export const MOCK_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'NQNCA0004',
    customerName: 'John Doe',
    date: '10/09/2025 1:37 PM',
    status: 'PENDING',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$3.50',
  },
  {
    id: 'NQNCA0005',
    customerName: 'Jane Smith',
    date: '10/09/2025 2:15 PM',
    status: 'COMPLETED',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$5.00',
  },
  {
    id: 'NQNCA0006',
    customerName: 'Bob Wilson',
    date: '10/09/2025 3:42 PM',
    status: 'CANCELLED',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$2.75',
  },
  {
    id: 'NQNCA0007',
    customerName: 'Alice Brown',
    date: '11/09/2025 9:20 AM',
    status: 'COMPLETED',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$4.25',
  },
  {
    id: 'NQNCA0008',
    customerName: 'Charlie Davis',
    date: '11/09/2025 10:05 AM',
    status: 'PENDING',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$6.00',
  },
  {
    id: 'NQNCA0009',
    customerName: 'Emma Taylor',
    date: '11/09/2025 11:30 AM',
    status: 'COMPLETED',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$3.50',
  },
  {
    id: 'NQNCA0010',
    customerName: 'Frank Miller',
    date: '12/09/2025 8:45 AM',
    status: 'PENDING',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$7.25',
  },
  {
    id: 'NQNCA0011',
    customerName: 'Grace Lee',
    date: '12/09/2025 1:12 PM',
    status: 'COMPLETED',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$2.50',
  },
  {
    id: 'NQNCA0012',
    customerName: 'Henry Clark',
    date: '12/09/2025 2:55 PM',
    status: 'CANCELLED',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$4.00',
  },
  {
    id: 'NQNCA0013',
    customerName: 'Ivy Martinez',
    date: '13/09/2025 9:08 AM',
    status: 'COMPLETED',
    servicePillar: 'NewsCorp Australia',
    serviceType: 'India',
    product: 'Send',
    amount: '$5.75',
  },
]

export const TRANSACTION_TOTAL_COUNT = 628

export type DailySweepStatus = 'PENDING' | 'DECLINED' | 'FAILED' | 'APPROVED'

export interface DailySweepRecord {
  id: string
  status: DailySweepStatus
  time: string
  sweepAmount: string
  totalAmount: string
}

export const MOCK_DAILY_SWEEP: DailySweepRecord[] = [
  { id: 'NQNCA0004', status: 'PENDING', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'NQNCA0004', status: 'DECLINED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'NQNCA0004', status: 'FAILED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'NQNCA0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'NQNCA0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'NQNCA0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'NQNCA0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'NQNCA0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'NQNCA0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
  { id: 'NQNCA0004', status: 'APPROVED', time: '10/09/2025 1:37 PM', sweepAmount: '$5', totalAmount: '$5' },
]
