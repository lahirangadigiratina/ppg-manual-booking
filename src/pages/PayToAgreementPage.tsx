import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PAYTO_AGREEMENT_DETAILS_PATH } from '../config/appRoutes'
import { HubProfileLayout } from '../components/layout/HubProfileLayout'
import { PayToAgreementIntroDialog } from '../components/layout/PayToAgreementIntroDialog'
import { PayToAgreementTitleTooltip } from '../components/layout/PayToAgreementTitleTooltip'
import { FullScreenBlockingLoader } from '../components/layout/FullScreenBlockingLoader'
import { PayToInstructionsDialog } from '../components/layout/PayToInstructionsDialog'
import {
  addPayToAgreement,
  buildPayToRecordFromForm,
} from '../payto/paytoAgreementStorage'
import { usePayToIntroGate } from '../payto/usePayToIntroGate'
import {
  ManualFieldLabel,
  manualFlowStepHelperClassName,
  manualInputClassName,
  manualPrimaryButtonClassName,
} from '../components/ppg/manualFormShared'

export function PayToAgreementPage() {
  const navigate = useNavigate()

  const [payerName, setPayerName] = useState('')
  const [bsb, setBsb] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const { introOpen, dismissIntro, flowReady } = usePayToIntroGate()
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const PAYTO_SUBMIT_LOADING_MS = 2200

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!flowReady) {
      return
    }
    const record = buildPayToRecordFromForm({
      payerName,
      bsb,
      accountNumber,
    })
    addPayToAgreement(record)
    // PayTo request API to be wired when backend is available.
    setInstructionsOpen(true)
  }

  const handleInstructionsClose = () => {
    setInstructionsOpen(false)
    setSubmitLoading(true)
  }

  useEffect(() => {
    if (!submitLoading) {
      return
    }

    const timer = window.setTimeout(() => {
      navigate(PAYTO_AGREEMENT_DETAILS_PATH)
      setSubmitLoading(false)
    }, PAYTO_SUBMIT_LOADING_MS)

    return () => window.clearTimeout(timer)
  }, [submitLoading, navigate])

  return (
    <HubProfileLayout>
      <div className="relative rounded-sm border border-border-light bg-white p-3 sm:p-4 lg:p-5">
        <PayToAgreementTitleTooltip />
        <p className={`${manualFlowStepHelperClassName} line-clamp-none`}>
          Please provide the account details to request PayTo agreement
        </p>

        <form
          onSubmit={handleSubmit}
          className={`mt-5 flex flex-col gap-4 sm:mt-6 ${introOpen ? 'pointer-events-none opacity-50' : ''}`}
          aria-hidden={introOpen}
        >
          <div>
            <ManualFieldLabel htmlFor="payto-payer-name">Payer Name</ManualFieldLabel>
            <input
              id="payto-payer-name"
              type="text"
              value={payerName}
              onChange={(event) => setPayerName(event.target.value)}
              autoComplete="name"
              className={manualInputClassName}
            />
          </div>
          <div>
            <ManualFieldLabel htmlFor="payto-bsb">BSB</ManualFieldLabel>
            <input
              id="payto-bsb"
              type="text"
              value={bsb}
              onChange={(event) => setBsb(event.target.value)}
              inputMode="numeric"
              autoComplete="off"
              className={manualInputClassName}
            />
          </div>
          <div>
            <ManualFieldLabel htmlFor="payto-account-number">Account Number</ManualFieldLabel>
            <input
              id="payto-account-number"
              type="text"
              value={accountNumber}
              onChange={(event) => setAccountNumber(event.target.value)}
              inputMode="numeric"
              autoComplete="off"
              className={manualInputClassName}
            />
          </div>

          <div className="mt-2 flex flex-col gap-2 pt-2">
            <button type="submit" className={`w-full ${manualPrimaryButtonClassName}`}>
              Request PayTo Agreement
            </button>
            <p className="text-center text-[11px] leading-snug text-text-muted line-clamp-none sm:text-right sm:text-xs">
              Open your banking application to authorise the PayTo agreement
            </p>
          </div>
        </form>

        <PayToAgreementIntroDialog anchor open={introOpen} onClose={dismissIntro} />

        <PayToInstructionsDialog
          anchor
          open={instructionsOpen && flowReady && !submitLoading}
          onClose={handleInstructionsClose}
        />
      </div>

      {submitLoading ? (
        <FullScreenBlockingLoader label="Submitting PayTo agreement request" />
      ) : null}
    </HubProfileLayout>
  )
}
