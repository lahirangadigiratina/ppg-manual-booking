import { useCallback, useState } from 'react'

const PAYTO_INTRO_DISMISSED_KEY = 'hubbed-payto-intro-dismissed'

function isPayToIntroDismissed() {
  try {
    return sessionStorage.getItem(PAYTO_INTRO_DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

export function usePayToIntroGate() {
  const [introOpen, setIntroOpen] = useState(() => !isPayToIntroDismissed())

  const dismissIntro = useCallback(() => {
    try {
      sessionStorage.setItem(PAYTO_INTRO_DISMISSED_KEY, '1')
    } catch {
      // ignore storage failures in demo
    }
    setIntroOpen(false)
  }, [])

  return {
    introOpen,
    dismissIntro,
    flowReady: !introOpen,
  }
}
