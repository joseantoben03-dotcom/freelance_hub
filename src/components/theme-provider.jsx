import * as React from "react"

const ThemeContext = React.createContext(null)

export function ThemeProvider({
  children,
  defaultTheme = "system",
}) {
  const [theme, setTheme] = React.useState(defaultTheme)
  const [mounted, setMounted] = React.useState(false)
  const [resolvedTheme, setResolvedTheme] = React.useState("light")

  const themes = React.useMemo(
    () => [
      { id: "light", label: "Light", icon: "☀️" },
      { id: "dark", label: "Dark", icon: "🌙" },
      { id: "system", label: "System", icon: "💻" },
    ],
    []
  )

  const getSystemTheme = React.useCallback(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    return "light"
  }, [])

  const resolveTheme = React.useCallback(
    (t) => {
      if (t === "system") return getSystemTheme()
      return t
    },
    [getSystemTheme]
  )

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const saved = localStorage.getItem("theme")
    const initialTheme =
      saved && ["light", "dark", "system"].includes(saved)
        ? saved
        : defaultTheme

    setTheme(initialTheme)
    setResolvedTheme(resolveTheme(initialTheme))
    setMounted(true)
  }, [defaultTheme, resolveTheme])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        const newTheme = getSystemTheme()
        setResolvedTheme(newTheme)
        document.documentElement.classList.toggle("dark", newTheme === "dark")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, getSystemTheme])

  React.useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const finalTheme = resolveTheme(theme)
    setResolvedTheme(finalTheme)

    document.documentElement.classList.remove("dark", "light")
    void document.documentElement.offsetHeight
    document.documentElement.classList.toggle("dark", finalTheme === "dark")

    localStorage.setItem("theme", theme)
  }, [theme, mounted, resolveTheme])

  const toggleTheme = React.useCallback(() => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
  }, [theme])

  const value = {
    theme,
    themes,
    setTheme,
    toggleTheme,
    resolvedTheme,
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
