import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type ThemeMode = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: ReactNode
  defaultMode?: ThemeMode
  storageKey?: string
}

type ThemeProviderState = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const initialState: ThemeProviderState = {
  mode: "system",
  setMode: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultMode = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem(storageKey) as ThemeMode) || defaultMode
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(mode)
  }, [mode])

  const value = {
    mode,
    setMode: (mode: ThemeMode) => {
      localStorage.setItem(storageKey, mode)
      setMode(mode)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}