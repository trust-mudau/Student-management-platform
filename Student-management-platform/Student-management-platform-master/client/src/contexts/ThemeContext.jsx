import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
})

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Check localStorage first
        const savedTheme = localStorage.getItem("theme")

        // Check system preference
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

        // Use saved theme or fall back to system preference
        const initialTheme = savedTheme || systemTheme

        console.log("🎨 Theme initialization:", {
          saved: savedTheme,
          system: systemTheme,
          chosen: initialTheme,
        })

        setTheme(initialTheme)
        applyTheme(initialTheme)
        setMounted(true)
      } catch (error) {
        console.error("Theme initialization error:", error)
        setTheme("light")
        applyTheme("light")
        setMounted(true)
      }
    }

    initializeTheme()
  }, [])

  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return

    applyTheme(theme)

    try {
      localStorage.setItem("theme", theme)
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }, [theme, mounted])

  const applyTheme = (newTheme) => {
    try {
      const root = document.documentElement

      // Remove existing theme classes
      root.classList.remove("light", "dark")

      // Add new theme class
      root.classList.add(newTheme)

      // Set data attribute for additional styling
      root.setAttribute("data-theme", newTheme)

      console.log("🎨 Applied theme:", newTheme, "Classes:", root.classList.toString())
    } catch (error) {
      console.error("Failed to apply theme:", error)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    console.log("🎨 Toggling theme:", theme, "→", newTheme)
    setTheme(newTheme)
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  }

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
