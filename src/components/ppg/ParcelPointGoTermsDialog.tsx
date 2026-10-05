import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TermsSection {
  id: string
  number: number | null
  title: string
  paragraphs: string[]
}

const TERMS_SECTIONS: TermsSection[] = [
  {
    id: 'agreement',
    number: 1,
    title: 'Agreement',
    paragraphs: [
      'These Terms apply to bookings made on or after the Effective Date and govern your access to and use of the PARCELPOINT Go platform, including the PARCELPOINT Go mobile application, website and related services (collectively, PARCELPOINT Go), operated by Hubbed Pty Ltd (ABN 99 600 398 178) (Hubbed, we, us or our).',
      'By creating an account, accepting these Terms, placing a booking, or otherwise using PARCELPOINT Go, you agree to be bound by these Terms.',
      'These Terms govern your ongoing use of PARCELPOINT Go. A separate contract for each booking is formed when we accept your booking and issue a booking confirmation.',
      'If you place a booking, you are the Sender for that booking. A Recipient who accesses PARCELPOINT Go to track, collect, redirect or otherwise manage a Parcel must also comply with these Terms to the extent they apply to Recipients.',
      'These Terms should be read together with the documents and information identified during the booking process, including our Privacy Policy and Prohibited Goods List.',
      'If there is any inconsistency, the booking confirmation prevails for that booking, followed by these Terms, except to the extent the Australian Consumer Law requires otherwise.',
    ],
  },
  {
    id: 'eligibility',
    number: 2,
    title: 'Eligibility, Accounts and Verification',
    paragraphs: [
      'You must be at least 18 years old and capable of entering a binding contract to use PARCELPOINT Go.',
      'We may require identity verification, account details or other information before accepting a booking or enabling certain features.',
    ],
  },
  {
    id: 'services',
    number: 3,
    title: 'Our Services',
    paragraphs: [
      'PARCELPOINT Go enables you to book parcel send and collection services through participating locations and carriers shown during the booking process.',
      'Service availability, carriers and delivery options may vary by location and are displayed at the time of booking.',
    ],
  },
  {
    id: 'shipping',
    number: 4,
    title: 'Shipping',
    paragraphs: [
      'Estimated delivery timeframes are indicative only and are not guaranteed unless expressly stated in your booking confirmation.',
      'You are responsible for providing accurate sender, recipient and delivery details.',
    ],
  },
  {
    id: 'parcel-size',
    number: 5,
    title: 'Parcel Size, Weight and Pricing',
    paragraphs: [
      'You must select the correct parcel size and weight band. Additional charges may apply if the parcel exceeds the booked size or weight.',
      'Pricing shown during booking includes applicable service fees unless otherwise stated.',
    ],
  },
  {
    id: 'prohibited-goods',
    number: 6,
    title: 'Prohibited, Dangerous and Restricted Goods',
    paragraphs: [
      'You must not send prohibited, dangerous or restricted goods. Our Prohibited Goods List forms part of these Terms.',
      'We may refuse, hold or dispose of parcels that breach these requirements.',
    ],
  },
  {
    id: 'sender-obligations',
    number: 7,
    title: 'Sender Obligations and Packaging',
    paragraphs: [
      'You must pack parcels securely using suitable materials and attach any required labels provided through PARCELPOINT Go.',
      'You are responsible for the contents of your parcel and for complying with applicable laws.',
    ],
  },
  {
    id: 'collection',
    number: 8,
    title: 'Collection Services',
    paragraphs: [
      'Where collection from a PARCELPOINT location is selected, the recipient must collect within the hold period shown in the booking confirmation.',
      'Uncollected parcels may be returned or disposed of in accordance with carrier and location policies.',
    ],
  },
  {
    id: 'charges',
    number: 9,
    title: 'Charges and Payment',
    paragraphs: [
      'You must pay all charges for your booking at the time specified during the booking process.',
      'We may use third-party payment providers to process payments securely.',
    ],
  },
  {
    id: 'cancellations',
    number: 10,
    title: 'Cancellations, Changes and Refunds',
    paragraphs: [
      'Cancellation and change rights depend on the service selected and the status of your booking.',
      'Refunds, where applicable, will be processed using the original payment method unless we agree otherwise.',
    ],
  },
  {
    id: 'parcel-protection',
    number: null,
    title: 'Parcel Protection',
    paragraphs: [
      'Optional Parcel Protection provides cover based on the declared value of goods, subject to these Terms and the protection summary shown at booking.',
      'Claims require proof of value and evidence of loss or damage within the stated claim period. Exclusions apply.',
    ],
  },
  {
    id: 'tracking',
    number: 12,
    title: 'Tracking and Communications',
    paragraphs: [
      'We and our partners may send booking, tracking and service messages by SMS, email or in-app notification.',
      'You are responsible for keeping your contact details up to date.',
    ],
  },
  {
    id: 'liability',
    number: 13,
    title: 'Consumer Guarantees and Liability',
    paragraphs: [
      'Our services come with guarantees that cannot be excluded under the Australian Consumer Law.',
      'To the extent permitted by law, our liability is limited as set out in these Terms and your booking confirmation.',
    ],
  },
  {
    id: 'indemnity',
    number: 14,
    title: 'Indemnity',
    paragraphs: [
      'You indemnify Hubbed and its personnel against losses arising from your breach of these Terms, unlawful parcel contents or misuse of PARCELPOINT Go.',
    ],
  },
]

interface ParcelPointGoTermsDialogProps {
  open: boolean
  onClose: () => void
}

const termsPanelHeightClassName = 'h-[min(58vh,520px)] min-h-[280px]'

export function ParcelPointGoTermsDialog({ open, onClose }: ParcelPointGoTermsDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [activeSectionId, setActiveSectionId] = useState(TERMS_SECTIONS[0].id)

  useEffect(() => {
    if (!open) {
      return
    }

    setActiveSectionId(TERMS_SECTIONS[0].id)
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open || !contentRef.current) {
      return
    }

    const root = contentRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) {
          setActiveSectionId(visible.target.id)
        }
      },
      { root, rootMargin: '-12% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] },
    )

    for (const section of TERMS_SECTIONS) {
      const node = sectionRefs.current[section.id]
      if (node) {
        observer.observe(node)
      }
    }

    return () => observer.disconnect()
  }, [open])

  if (!open) {
    return null
  }

  const scrollToSection = (id: string) => {
    setActiveSectionId(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3 sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="parcelpoint-terms-title"
        className="flex max-h-[min(92vh,820px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-[#eef0f2] shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-end gap-2 px-3 pt-3 sm:px-4 sm:pt-4">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-white/80 hover:text-black"
            aria-label="Close terms and conditions"
          >
            <X className="size-5" strokeWidth={2.5} aria-hidden />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-3 pb-4 sm:px-4 sm:pb-5">
          <div className="shrink-0 rounded-xl border border-border-light bg-[#e8eaed] px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-xs font-semibold tracking-wide text-black sm:text-sm">
              PARCELPOINT Go
            </p>
            <h2
              id="parcelpoint-terms-title"
              className="mt-1 text-2xl font-bold tracking-tight text-hubbed-orange sm:text-3xl lg:text-4xl"
            >
              TERMS AND CONDITIONS
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              (Version 1 – Effective Date 9 July 2026)
            </p>
          </div>

          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
            <article
              className={`${termsPanelHeightClassName} min-w-0 flex-1 overflow-hidden rounded-xl border border-border-light bg-white`}
              aria-label="Terms and conditions full text"
            >
              <div
                ref={contentRef}
                className="h-full overflow-y-auto px-5 py-6 sm:px-7 sm:py-7"
              >
                {TERMS_SECTIONS.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    ref={(node) => {
                      sectionRefs.current[section.id] = node
                    }}
                    className={`scroll-mt-6 ${
                      index > 0 ? 'mt-10 border-t border-border-light pt-8' : ''
                    }`}
                    aria-labelledby={`${section.id}-heading`}
                  >
                    <div className="flex items-center gap-3">
                      {section.number !== null && (
                        <span
                          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-hubbed-orange text-sm font-bold text-white"
                          aria-hidden
                        >
                          {section.number}
                        </span>
                      )}
                      <h3
                        id={`${section.id}-heading`}
                        className="text-lg font-bold text-black sm:text-xl"
                      >
                        {section.title}
                      </h3>
                    </div>
                    <ul className="mt-5 divide-y divide-gray-100">
                      {section.paragraphs.map((paragraph) => (
                        <li
                          key={paragraph}
                          className="flex gap-3 py-4 text-sm leading-relaxed text-gray-700 first:pt-0 sm:text-[15px]"
                        >
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-hubbed-orange"
                            aria-hidden
                          />
                          <span>{paragraph}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>

            <aside
              className={`${termsPanelHeightClassName} flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-border-light bg-white lg:w-56 xl:w-60`}
            >
              <div className="shrink-0 p-4 pb-0">
                <p className="text-[10px] font-bold tracking-wider text-text-muted">ON THIS PAGE</p>
              </div>
              <nav className="min-h-0 flex-1 overflow-y-auto p-4 pt-3" aria-label="Terms sections">
                <ul className="space-y-0.5">
                  {TERMS_SECTIONS.map((section) => {
                    const active = activeSectionId === section.id
                    const label =
                      section.number !== null
                        ? `${section.number}. ${section.title}`
                        : section.title
                    return (
                      <li key={section.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(section.id)}
                          aria-current={active ? 'true' : undefined}
                          className={`block w-full border-l-2 py-2 pl-3 text-left text-xs leading-snug transition-colors sm:text-sm ${
                            active
                              ? 'border-hubbed-orange font-semibold text-hubbed-orange'
                              : 'border-transparent text-text-muted hover:text-black'
                          }`}
                        >
                          {label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
