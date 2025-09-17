import axios from "axios"

// Get API URL from environment or use production default
const getApiUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  // In production, if no VITE_API_URL is set, use relative path
  if (import.meta.env.PROD) {
    return "/api"
  }

  // Development fallback
  return "http://localhost:5000/api"
}

console.log("API Base URL:", getApiUrl())

export const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increased timeout for production
  withCredentials: false, // Set to false to avoid CORS issues
})

// Add token to requests if available (only for protected routes)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    // Only add token for protected routes
    const protectedRoutes = ["/course", "/lecturer", "/auth/me", "/auth/all"]
    const isProtectedRoute = protectedRoutes.some((route) => config.url?.includes(route))

    if (token && isProtectedRoute) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Adding auth token to request:", config.url)
    } else {
      console.log("Public request (no token):", config.url)
    }

    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.config.url, response.status)
    return response
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    })

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      // Only redirect if not already on login page and not a public route
      const publicRoutes = ["/faculty/all", "/department/all", "/auth/register", "/auth/login"]
      const isPublicRoute = publicRoutes.some((route) => error.config?.url?.includes(route))

      if (!window.location.pathname.includes("/login") && !isPublicRoute) {
        window.location.href = "/login"
      }
    } else if (error.response?.status === 403) {
      console.error("403 Forbidden - Check if route should be public:", error.config?.url)
    } else if (error.code === "NETWORK_ERROR" || error.code === "ECONNABORTED") {
      console.error("Network error - check if backend is running")
    }

    return Promise.reject(error)
  },
)

// Health check function
export const checkHealth = async () => {
  try {
    const response = await api.get("/health")
    return response.data
  } catch (error) {
    console.error("Health check failed:", error)
    throw error
  }
}

// Test API connection
export const testConnection = async () => {
  try {
    const response = await api.get("/test")
    console.log("API Test successful:", response.data)
    return response.data
  } catch (error) {
    console.error("API Test failed:", error)
    throw error
  }
}
