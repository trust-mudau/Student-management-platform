import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { useEffect, useState } from "react"
import { checkHealth } from "./services/api"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Setup from "./pages/Setup"
import Dashboard from "./pages/Dashboard"
import Courses from "./pages/Courses"
import Students from "./pages/Students"
import Lecturers from "./pages/Lecturers"
import Faculties from "./pages/Faculties"
import Departments from "./pages/Departments"
import Layout from "./components/Layouts"
import { Toaster } from "sonner"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppContent() {
  const [healthStatus, setHealthStatus] = useState(null)
  const [healthError, setHealthError] = useState(null)

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const health = await checkHealth()
        setHealthStatus(health)
        console.log("Backend health:", health)
      } catch (error) {
        setHealthError(error.message)
        console.error("Backend health check failed:", error)
      }
    }

    checkBackendHealth()
  }, [])

  if (healthError && !healthStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-destructive text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Backend Connection Error</h1>
          <p className="text-muted-foreground mb-6">
            Unable to connect to the backend server. Please check if the server is running.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Retry Connection
          </button>
          <div className="mt-4 text-sm text-muted-foreground">Error: {healthError}</div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/setup" element={<Setup />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="students" element={<Students />} />
        <Route path="lecturers" element={<Lecturers />} />
        <Route path="faculties" element={<Faculties />} />
        <Route path="departments" element={<Departments />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <AuthProvider>
          <Router>
            <AppContent />
            <Toaster
              position="top-right"
              toastOptions={{
                className: "bg-background border-border text-foreground",
              }}
            />
          </Router>
        </AuthProvider>
      </div>
    </ThemeProvider>
  )
}
export default App
