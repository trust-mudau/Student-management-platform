import { useTheme } from "../contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle({ size = "default", className = "" }) {
  const { theme, toggleTheme, isDark } = useTheme()

  console.log("🎨 ThemeToggle render:", { theme, isDark })

  return (
    <Button
      variant="outline"
      size={size}
      onClick={() => {
        console.log("🎨 Theme toggle clicked!")
        toggleTheme()
      }}
      className={`relative border-2 ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Current: ${theme} mode. Click to switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Always show both icons for debugging */}
      <div className="flex items-center space-x-1">
        {isDark ? (
          <>
            <Sun className="h-4 w-4" />
            <span className="text-xs hidden sm:inline">Light</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4" />
            <span className="text-xs hidden sm:inline">Dark</span>
          </>
        )}
      </div>

      {/* Debug indicator */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-50"></div>
    </Button>
  )
}

// Debug component to show theme status
export function ThemeDebug() {
  const { theme, isDark } = useTheme()

  return (
    <div className="fixed bottom-4 left-4 p-2 bg-black/80 text-white text-xs rounded z-50">
      <div>Theme: {theme}</div>
      <div>isDark: {isDark.toString()}</div>
      <div>HTML class: {document.documentElement.className}</div>
    </div>
  )
}
