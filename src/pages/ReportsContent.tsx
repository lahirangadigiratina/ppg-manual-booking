import {
  ArrowDownToLine,
  ArrowLeftRight,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  REPORT_DAILY_SWEEP,
  REPORT_TRANSACTIONS,
  type DailySweepRecord,
  type DailySweepStatus,
  type TransactionRecord,
  type TransactionReportTab,
  type TransactionStatus,
} from '../reports/transactionHistoryMock'
import { manualPrimaryButtonClassName } from '../components/ppg/manualFormShared'

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

/** Tables grow past the card so long headers stay on one line and scroll sideways. */
const REPORT_TABLE_CLASS = 'w-max min-w-full border-collapse text-left text-sm'

const reportHeadCellClassName =
  'whitespace-nowrap bg-gray-100 px-4 py-3 text-left text-xs font-bold text-black'

const reportBodyRowClassName = 'h-12 border-b border-border-light'

const reportCellClassName = 'whitespace-nowrap px-4 py-3 align-middle'

const reportsFieldClassName =
  'w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-sm text-black outline-none placeholder:text-gray-400 focus:border-gray-400 sm:px-4 sm:py-3 sm:text-base'

function matchesQuery(values: string[], query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return values.some((value) => value.toLowerCase().includes(needle))
}

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

function ReportChoice({
  selected,
  title,
  description,
  detail,
  icon: Icon,
  onClick,
}: {
  selected: boolean
  title: string
  description: string
  detail: string
  icon: typeof ArrowLeftRight
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`relative flex w-full flex-col rounded-lg border p-3 text-left transition-colors sm:p-3.5 ${
        selected
          ? 'border-[#2b2f36] bg-[#2b2f36] text-white shadow-sm'
          : 'border-border-light bg-white text-black hover:border-gray-300'
      }`}
    >
      <span className="text-sm font-bold leading-snug sm:text-base">{title}</span>
      <span
        className={`mt-1.5 text-xs leading-snug sm:text-sm ${
          selected ? 'text-white/85' : 'text-text-muted'
        }`}
      >
        {description}
      </span>
      <div
        className={`mt-2 border-t pt-2 sm:mt-2.5 sm:pt-2 ${
          selected ? 'border-white/20' : 'border-border-light'
        }`}
      >
        <span
          className={`flex items-center gap-1.5 text-[11px] font-medium sm:text-xs ${
            selected ? 'text-white/90' : 'text-text-muted'
          }`}
        >
          <Icon className="size-3.5 shrink-0 sm:size-4" strokeWidth={1.75} aria-hidden />
          {detail}
        </span>
      </div>
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

function AllTransactionsTable({ rows }: { rows: TransactionRecord[] }) {
  return (
    <table className={REPORT_TABLE_CLASS}>
      <thead className="sticky top-0 z-[1]">
        <tr className="border-b border-border-light bg-gray-100">
          <FilterHeaderCell />
          <th scope="col" className={`${reportHeadCellClassName} min-w-[9.5rem]`}>
            Transaction ID
          </th>
          <th scope="col" className={`${reportHeadCellClassName} min-w-[10rem]`}>
            Customer Name
          </th>
          <th scope="col" className={`${reportHeadCellClassName} min-w-[11rem]`}>
            Date
          </th>
          <th scope="col" className={`${reportHeadCellClassName} min-w-[7.5rem]`}>
            Status
          </th>
          <th scope="col" className={`${reportHeadCellClassName} min-w-[11rem]`}>
            Product Service Type
          </th>
          <th scope="col" className={`${reportHeadCellClassName} min-w-[6.5rem]`}>
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr className={reportBodyRowClassName}>
            <td colSpan={7} className="px-4 py-8 text-center text-sm text-text-muted">
              No transactions match this search.
            </td>
          </tr>
        ) : (
          rows.map((row, index) => (
            <tr
              key={`${row.id}-${index}`}
              className={`${reportBodyRowClassName} ${index % 2 === 1 ? 'bg-gray-50/80' : 'bg-white'}`}
            >
              <td className="px-2 py-3" />
              <td className={`${reportCellClassName} font-medium text-black`}>{row.id}</td>
              <td className={`${reportCellClassName} text-black`}>{row.customerName}</td>
              <td className={`${reportCellClassName} text-text-muted`}>{row.date}</td>
              <td className={reportCellClassName}>
                <TransactionStatusBadge status={row.status} />
              </td>
              <td className={`${reportCellClassName} text-black`}>{row.product}</td>
              <td className={`${reportCellClassName} font-semibold text-black`}>{row.amount}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

function DailySweepTable({ rows }: { rows: DailySweepRecord[] }) {
  return (
    <table className={REPORT_TABLE_CLASS}>
      <thead className="sticky top-0 z-[1]">
        <tr className="border-b border-border-light bg-gray-100">
          <FilterHeaderCell />
          <th scope="col" className={`${reportHeadCellClassName} min-w-[9.5rem]`}>
            Transaction ID
          </th>
          <th scope="col" className={`${reportHeadCellClassName} min-w-[7.5rem]`}>
            Status
          </th>
          <th scope="col" className={`${reportHeadCellClassName} min-w-[14rem]`}>
            Time
          </th>
          <th scope="col" className={`${reportHeadCellClassName} min-w-[9rem]`}>
            Sweep Amount
          </th>
          <th scope="col" className={`${reportHeadCellClassName} min-w-[9rem]`}>
            Total Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr className={reportBodyRowClassName}>
            <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-muted">
              No transactions match this search.
            </td>
          </tr>
        ) : (
          rows.map((row, index) => (
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
          ))
        )}
      </tbody>
    </table>
  )
}

function monthlyReportOptions() {
  const options: { value: string; label: string }[] = []
  const cursor = new Date()
  cursor.setDate(1)
  for (let index = 0; index < 12; index += 1) {
    cursor.setMonth(cursor.getMonth() - 1)
    const value = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
    const label = cursor.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
    options.push({ value, label })
  }
  return options
}

function MonthlyTransactionReport() {
  const [month, setMonth] = useState('')
  const months = monthlyReportOptions()

  return (
    <div className="max-w-3xl">
      <p className="max-w-3xl text-sm leading-snug text-text-muted">
        Please note that GST is not included in the data presented within the reports. The report
        for the current month will be ready by 20th of the following month.
      </p>
      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
        <div className="w-full max-w-xs">
          <label htmlFor="monthly-report-month" className="mb-1.5 block text-sm font-medium text-black">
            Select Month
          </label>
          <div className="relative">
            <select
              id="monthly-report-month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className={`w-full appearance-none rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gray-400 sm:px-4 sm:py-3 ${
                month ? 'text-black' : 'text-gray-400'
              }`}
            >
              <option value="">Select Month</option>
              {months.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500"
              aria-hidden
            />
          </div>
        </div>
        <button type="button" className={`${manualPrimaryButtonClassName} min-w-40 bg-[#4b5563] hover:bg-[#374151]`}>
          Download
        </button>
      </div>
    </div>
  )
}

function ReportsPaginationFooter({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <div className="relative z-[2] shrink-0 border-t border-border-light bg-white pt-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="min-w-0 text-xs text-text-muted sm:text-sm">
          {total === 0 ? 'Showing 0 entries' : `Showing ${start} to ${end} of ${total} entries`}
        </p>

        <div className="flex min-w-0 flex-wrap items-center justify-start gap-3 sm:justify-end">
          <div className="flex shrink-0 items-center gap-2 text-xs text-black sm:text-sm">
            <label htmlFor="report-page-size">Show</label>
            <div className="relative">
              <select
                id="report-page-size"
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                className="h-9 w-[4.5rem] appearance-none rounded-lg border border-[#d1d5db] bg-white pl-3 pr-8 text-left text-sm leading-none text-black outline-none focus:border-gray-400"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#374151]"
                aria-hidden
              />
            </div>
            <span>Entries</span>
          </div>

          <div className="flex shrink-0 flex-nowrap items-center gap-1" aria-label="Pagination">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="rounded-md border border-border-light p-1.5 text-black disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
            </button>
            {pages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-current={pageNumber === page ? 'page' : undefined}
                className={`min-w-8 rounded-md px-2 py-1 text-center text-sm font-semibold ${
                  pageNumber === page
                    ? 'bg-[#2b2f36] text-white'
                    : 'border border-border-light bg-white text-black'
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pageCount}
              aria-label="Next page"
              className="rounded-md border border-border-light p-1.5 text-black disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TransactionReportTable({ tab }: { tab: 'all' | 'daily-sweep' }) {
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState<number>(25)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (tab === 'daily-sweep') {
      return REPORT_DAILY_SWEEP.filter((row) =>
        matchesQuery([row.id, row.status, row.time, row.sweepAmount, row.totalAmount], query),
      )
    }
    return REPORT_TRANSACTIONS.filter((row) =>
      matchesQuery(
        [row.id, row.customerName, row.date, row.status, row.product, row.amount],
        query,
      ),
    )
  }, [query, tab])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const startIndex = (currentPage - 1) * pageSize
  const visible = filtered.slice(startIndex, startIndex + pageSize)

  return (
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
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Transaction ID, customer, status..."
              className={reportsFieldClassName}
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
            {tab === 'daily-sweep' ? (
              <DailySweepTable rows={visible as DailySweepRecord[]} />
            ) : (
              <AllTransactionsTable rows={visible as TransactionRecord[]} />
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
        <ReportsPaginationFooter
          page={currentPage}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>
    </div>
  )
}

const REPORT_DRAWER_TITLES: Record<TransactionReportTab, string> = {
  monthly: 'PARCELPOINT Monthly Report',
  all: 'PPG Transactions',
  'daily-sweep': 'PPG Daily Sweep',
}

function ReportDrawer({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close report"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-full max-w-[calc(100%-1.25rem)] animate-[report-drawer-in_450ms_ease-out] flex-col bg-white shadow-2xl sm:max-w-[calc(100%-8rem)] lg:max-w-[calc(100%-14rem)]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border-light px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-black sm:text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-md text-black hover:bg-gray-100"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export function ReportsContent() {
  const [tab, setTab] = useState<TransactionReportTab | null>(null)

  return (
    <div className="mx-auto flex h-full w-full min-h-0 min-w-0 max-w-[1600px] flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div
        className="mb-4 grid shrink-0 grid-cols-1 gap-2 sm:mb-5 sm:grid-cols-3 sm:gap-3"
        aria-label="Report type"
      >
          <ReportChoice
            selected={false}
            title="PARCELPOINT Monthly Report"
            description="Transactions grouped for the current month"
            detail="This month"
            icon={CalendarRange}
            onClick={() => setTab('monthly')}
          />
          <ReportChoice
            selected={false}
            title="PPG Transactions"
            description="Every booking and payment recorded for this store"
            detail="Full history"
            icon={ArrowLeftRight}
            onClick={() => setTab('all')}
          />
          <ReportChoice
            selected={false}
            title="PPG Daily Sweep"
            description="End-of-day sweep totals for this store"
            detail="End of day"
            icon={Database}
            onClick={() => setTab('daily-sweep')}
          />
      </div>
      {tab ? (
        <ReportDrawer title={REPORT_DRAWER_TITLES[tab]} onClose={() => setTab(null)}>
          {tab === 'monthly' ? (
            <MonthlyTransactionReport />
          ) : (
            <TransactionReportTable key={tab} tab={tab} />
          )}
        </ReportDrawer>
      ) : null}
    </div>
  )
}
