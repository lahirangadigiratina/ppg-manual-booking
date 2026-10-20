import {
  ArrowDownToLine,
  ArrowLeftRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  SlidersHorizontal,
} from 'lucide-react'
import { useState } from 'react'
import {
  MOCK_DAILY_SWEEP,
  MOCK_TRANSACTIONS,
  TRANSACTION_TOTAL_COUNT,
  type DailySweepStatus,
  type TransactionReportTab,
  type TransactionStatus,
} from '../reports/transactionHistoryMock'
import {
  manualFlowStepTitleClassName,
  manualPrimaryButtonClassName,
} from '../components/ppg/manualFormShared'

const STATIC_PAGE_SIZE = 10
const ALL_TRANSACTION_ROWS = MOCK_TRANSACTIONS.slice(0, STATIC_PAGE_SIZE)
const DAILY_SWEEP_ROWS = MOCK_DAILY_SWEEP.slice(0, STATIC_PAGE_SIZE)

/** Both tables fill the report card width (same footprint when switching tabs). */
const REPORT_TABLE_CLASS =
  'w-full min-w-[960px] table-fixed border-collapse text-left text-sm'

const reportHeadCellClassName =
  'bg-gray-100 px-3 py-3 text-left text-xs font-bold text-black'

const reportBodyRowClassName = 'h-12 border-b border-border-light'

const reportCellClassName = 'px-3 py-3 align-middle'

const reportsReadOnlyFieldClassName =
  'w-full cursor-default rounded-lg border border-[#d1d5db] bg-[#eceff2] px-3.5 py-2.5 text-sm font-semibold text-[#374151] outline-none read-only:focus:border-[#d1d5db] read-only:focus:ring-0 sm:px-4 sm:py-3 sm:text-base'

function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  const styles =
    status === 'PENDING'
      ? 'text-amber-700'
      : status === 'COMPLETED'
        ? 'text-emerald-700'
        : 'text-red-600'

  const dot =
    status === 'PENDING'
      ? 'bg-amber-500'
      : status === 'COMPLETED'
        ? 'bg-emerald-500'
        : 'bg-red-500'

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase ${styles}`}>
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
      {status}
    </span>
  )
}

function DailySweepStatusBadge({ status }: { status: DailySweepStatus }) {
  const styles =
    status === 'PENDING'
      ? 'text-amber-700'
      : status === 'APPROVED'
        ? 'text-emerald-700'
        : status === 'DECLINED'
          ? 'text-red-600'
          : 'text-gray-600'

  const dot =
    status === 'PENDING'
      ? 'bg-amber-500'
      : status === 'APPROVED'
        ? 'bg-emerald-500'
        : status === 'DECLINED'
          ? 'bg-red-500'
          : 'bg-gray-500'

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase ${styles}`}>
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
      {status}
    </span>
  )
}

function ReportTab({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: typeof ArrowLeftRight
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
        active
          ? 'bg-[#2b2f36] text-white shadow-sm'
          : 'border border-border-light bg-white text-black hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      {label}
    </button>
  )
}

function FilterHeaderCell() {
  return (
    <th scope="col" className="w-10 shrink-0 bg-gray-100 px-2 py-3">
      <SlidersHorizontal className="mx-auto size-4 text-gray-600" aria-hidden />
    </th>
  )
}

function AllTransactionsTable() {
  return (
    <table className={REPORT_TABLE_CLASS}>
      <thead className="sticky top-0 z-[1]">
        <tr className="border-b border-border-light bg-gray-100">
          <FilterHeaderCell />
          <th scope="col" className={`${reportHeadCellClassName} w-[10%]`}>
            Transaction ID
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[12%]`}>
            Customer Name
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[16%]`}>
            Date
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[12%]`}>
            Status
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[22%]`}>
            Service Pillar
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[10%]`}>
            Service Type
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[8%]`}>
            Product
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[10%]`}>
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {ALL_TRANSACTION_ROWS.map((row, index) => (
          <tr
            key={`${row.id}-${index}`}
            className={`${reportBodyRowClassName} ${index % 2 === 1 ? 'bg-gray-50/80' : 'bg-white'}`}
          >
            <td className="px-2 py-3" />
            <td className={`${reportCellClassName} whitespace-nowrap font-medium text-black`}>
              {row.id}
            </td>
            <td className={`${reportCellClassName} whitespace-nowrap text-black`}>
              {row.customerName}
            </td>
            <td className={`${reportCellClassName} whitespace-nowrap text-text-muted`}>
              {row.date}
            </td>
            <td className={reportCellClassName}>
              <TransactionStatusBadge status={row.status} />
            </td>
            <td className={`${reportCellClassName} text-black`} title={row.servicePillar}>
              {row.servicePillar}
            </td>
            <td className={`${reportCellClassName} text-black`}>{row.serviceType}</td>
            <td className={`${reportCellClassName} text-black`}>{row.product}</td>
            <td className={`${reportCellClassName} font-semibold text-black`}>{row.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DailySweepTable() {
  return (
    <table className={REPORT_TABLE_CLASS}>
      <thead className="sticky top-0 z-[1]">
        <tr className="border-b border-border-light bg-gray-100">
          <FilterHeaderCell />
          <th scope="col" className={`${reportHeadCellClassName} w-[16%]`}>
            Transaction ID
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[14%]`}>
            Status
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[30%]`}>
            Time
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[20%]`}>
            Sweep Amount
          </th>
          <th scope="col" className={`${reportHeadCellClassName} w-[20%]`}>
            Total Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {DAILY_SWEEP_ROWS.map((row, index) => (
          <tr
            key={`${row.id}-${row.status}-${index}`}
            className={`${reportBodyRowClassName} ${index % 2 === 1 ? 'bg-gray-50/80' : 'bg-white'}`}
          >
            <td className="px-2 py-3" />
            <td className={`${reportCellClassName} font-medium text-black`}>{row.id}</td>
            <td className={reportCellClassName}>
              <DailySweepStatusBadge status={row.status} />
            </td>
            <td className={`${reportCellClassName} text-text-muted`}>{row.time}</td>
            <td className={`${reportCellClassName} font-semibold text-black`}>{row.sweepAmount}</td>
            <td className={`${reportCellClassName} font-semibold text-black`}>{row.totalAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ReportsPaginationFooter() {
  return (
    <div className="relative z-[2] shrink-0 border-t border-border-light bg-white pt-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="min-w-0 text-xs text-text-muted sm:text-sm">
          Showing 1 to {STATIC_PAGE_SIZE} of {TRANSACTION_TOTAL_COUNT} entries
        </p>

        <div className="flex min-w-0 flex-wrap items-center justify-start gap-3 sm:justify-end">
          <div className="flex shrink-0 items-center gap-2 text-xs text-black sm:text-sm">
            <span>Show</span>
            <div className="relative">
              <input
                type="text"
                readOnly
                tabIndex={-1}
                value="25"
                aria-readonly="true"
                className={`${reportsReadOnlyFieldClassName} w-16 py-2 pr-7 text-center sm:w-[4.5rem]`}
              />
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-[#374151]"
                aria-hidden
              />
            </div>
            <span>Entries</span>
          </div>

          <div className="flex shrink-0 flex-nowrap items-center gap-1" aria-label="Pagination">
            <span className="rounded-md border border-border-light p-1.5 text-gray-400">
              <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-8 rounded-md bg-[#2b2f36] px-2 py-1 text-center text-sm font-semibold text-white">
              1
            </span>
            <span className="min-w-8 rounded-md border border-border-light bg-white px-2 py-1 text-center text-sm font-semibold text-black">
              2
            </span>
            <span className="rounded-md border border-border-light p-1.5 text-black">
              <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReportsContent() {
  const [tab, setTab] = useState<TransactionReportTab>('all')

  return (
    <div className="mx-auto flex h-full w-full min-h-0 min-w-0 max-w-[1600px] flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <h1 className={`${manualFlowStepTitleClassName} mb-4 shrink-0 sm:mb-5`}>
        Transaction History
      </h1>

      <div className="mb-4 flex shrink-0 flex-wrap gap-2 sm:mb-5" aria-label="Report type">
        <ReportTab
          active={tab === 'all'}
          label="All Transactions"
          icon={ArrowLeftRight}
          onClick={() => setTab('all')}
        />
        <ReportTab
          active={tab === 'daily-sweep'}
          label="Daily Sweep"
          icon={Database}
          onClick={() => setTab('daily-sweep')}
        />
      </div>

      <div className="flex w-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-sm border border-border-light bg-white">
        <div className="shrink-0 border-b border-border-light p-4 sm:p-5 lg:px-6 lg:pt-6 lg:pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <label htmlFor="transaction-search" className="mb-1 block text-xs font-bold text-black">
                Search
              </label>
              <input
                id="transaction-search"
                type="search"
                readOnly
                tabIndex={-1}
                value=""
                placeholder="Transaction ID, customer, status..."
                aria-readonly="true"
                className={reportsReadOnlyFieldClassName}
              />
            </div>
            <div
              className={`inline-flex w-full shrink-0 cursor-default items-center justify-center gap-2 sm:w-auto ${manualPrimaryButtonClassName}`}
              aria-hidden
            >
              <ArrowDownToLine className="size-4" strokeWidth={2} aria-hidden />
              Download CSV
            </div>
          </div>
        </div>

        <div className="relative min-h-[12rem] min-w-0 flex-1 basis-0">
          <div
            className="absolute inset-0 w-full overflow-x-scroll overflow-y-scroll overscroll-contain [scrollbar-gutter:stable]"
            role="region"
            aria-label="Transaction table"
            tabIndex={0}
          >
            <div className="w-full min-w-full">
              {tab === 'all' ? <AllTransactionsTable /> : <DailySweepTable />}
            </div>
          </div>
        </div>

        <div className="shrink-0 px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
          <ReportsPaginationFooter />
        </div>
      </div>
    </div>
  )
}
