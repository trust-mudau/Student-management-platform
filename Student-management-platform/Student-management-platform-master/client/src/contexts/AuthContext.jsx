import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../services/api"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", { email, password: "***" })
      const response = await api.post("/auth/login", { email, password })
      console.log("Login response:", response.data)
      const { token, user: userData } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(userData)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message)
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      console.log("Attempting registration with:", { ...userData, password: "***" })
      const response = await api.post("/auth/register", userData)
      console.log("Registration response:", response.data)
      const { token, user: newUser } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(newUser))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(newUser)
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message)
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
