export function NoPayToAgreementIntroContent({ className = '' }: { className?: string }) {
  return (
    <div className={`text-sm leading-relaxed text-gray-700 sm:text-[15px] ${className}`}>
      <p>
        <strong className="font-bold text-black">PayTo</strong> is an Australian payment service
        that lets businesses collect payments directly from a customer&apos;s bank account when the
        customer has given approval in advance.
      </p>
      <p className="mt-3">
        A <strong className="font-bold text-black">PayTo agreement</strong> is the authorisation your
        store sets up with its nominated account. Once you request an agreement and approve it in
        your banking app, HUBBED can collect eligible store payments through PayTo without needing
        card details for each transaction.
      </p>
      <p className="mt-3">
        You stay in control: you review the payment terms in your bank before approving, and you
        can manage or cancel the agreement through your bank at any time.
      </p>
    </div>
  )
}
