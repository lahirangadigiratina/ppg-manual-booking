import { useCallback, useState } from 'react'

const NOPAYTO_INTRO_DISMISSED_KEY = 'hubbed-nopayto-intro-dismissed'

function isNoPayToIntroDismissed() {
  try {
    return sessionStorage.getItem(NOPAYTO_INTRO_DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

export function useNoPayToIntroGate() {
  const [introOpen, setIntroOpen] = useState(() => !isNoPayToIntroDismissed())

  const dismissIntro = useCallback(() => {
    try {
      sessionStorage.setItem(NOPAYTO_INTRO_DISMISSED_KEY, '1')
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
