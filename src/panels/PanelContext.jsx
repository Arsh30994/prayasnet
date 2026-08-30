import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Holds which slide-over is open. One panel at a time — opening another
// swaps the contents rather than stacking, so the overlay never doubles up.
const PanelContext = createContext(null)

export function usePanel() {
  const ctx = useContext(PanelContext)
  if (!ctx) throw new Error('usePanel must be used inside <PanelProvider>')
  return ctx
}

export function PanelProvider({ children }) {
  const [panel, setPanel] = useState(null) // { type, payload } | null

  const openPanel = useCallback((type, payload = null) => {
    setPanel({ type, payload })
  }, [])

  const closePanel = useCallback(() => setPanel(null), [])

  const value = useMemo(
    () => ({
      panel,
      panelType: panel?.type ?? null,
      payload: panel?.payload ?? null,
      isOpen: panel != null,
      openPanel,
      closePanel,
    }),
    [panel, openPanel, closePanel],
  )

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
}
