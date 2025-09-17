const express = require("express")
const path = require("path")
const ConnectDB = require("./config/db")
const dotenv = require("dotenv")
const cors = require("cors")

// Load environment variables first
dotenv.config()

console.log("🚀 Starting Student Management System...")
console.log("📊 Environment Variables Check:")
console.log("  NODE_ENV:", process.env.NODE_ENV || "❌ Not set")
console.log("  PORT:", process.env.PORT || "❌ Not set")
console.log("  MONGO_URI:", process.env.MONGO_URI ? "✅ Configured" : "❌ Not configured")
console.log("  JWT_SIGN:", process.env.JWT_SIGN ? "✅ Configured" : "❌ Not configured")

const app = express()

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// CORS configuration - Allow your Vercel frontend
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    /\.vercel\.app$/, // Allow all Vercel subdomains
    /\.onrender\.com$/, // Allow Render domains
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

// Request logging middleware with better error handling
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("❌ Global Error Handler:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.url,
    method: req.method,
  })

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    timestamp: new Date().toISOString(),
  })
})

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🎉 Student Management API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    status: "healthy",
    endpoints: {
      health: "/api/health",
      test: "/api/test",
      setup: "/api/setup/status",
      auth: "/api/auth/*",
      faculty: "/api/faculty/*",
      department: "/api/department/*",
      course: "/api/course/*",
      lecturer: "/api/lecturer/*",
    },
  })
})

// API root route
app.get("/api", (req, res) => {
  res.json({
    message: "🚀 Student Management API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    status: "running",
    endpoints: [
      "GET /api/health - Health check",
      "GET /api/test - Test endpoint",
      "GET /api/setup/status - System status",
      "POST /api/setup/initialize - Initialize system",
      "POST /api/auth/register - User registration",
      "POST /api/auth/login - User login",
      "GET /api/faculty/all - Get all faculties",
      "GET /api/department/all - Get all departments",
    ],
  })
})

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "✅ API is working perfectly!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "not-set",
    envCheck: {
      mongoUri: process.env.MONGO_URI ? "✅ configured" : "❌ missing",
      jwtSign: process.env.JWT_SIGN ? "✅ configured" : "❌ missing",
      nodeEnv: process.env.NODE_ENV || "not-set",
      port: process.env.PORT || "not-set",
    },
  })
})

// Import and use routes with better error handling
console.log("📦 Loading routes...")

// Health route
try {
  const healthRoute = require("./Routes/healthRoute")
  app.use("/api/health", healthRoute)
  console.log("✅ Health route loaded")
} catch (error) {
  console.error("❌ Failed to load health route:", error.message)
}

// Setup route - CRITICAL for initialization
try {
  const setupRoute = require("./Routes/setupRoute")
  app.use("/api/setup", setupRoute)
  console.log("✅ Setup route loaded")
} catch (error) {
  console.error("❌ CRITICAL: Failed to load setup route:", error.message)
  console.error("This will prevent system initialization!")
}

// Auth route with error handling
try {
  const authRoute = require("./Routes/authRoute")
  app.use("/api/auth", (req, res, next) => {
    try {
      authRoute(req, res, next)
    } catch (error) {
      console.error("❌ Auth route error:", error)
      res.status(500).json({
        message: "Authentication service error",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })
  console.log("✅ Auth route loaded")
} catch (error) {
  console.error("❌ Failed to load auth route:", error.message)
}

// Faculty route with error handling
try {
  const facultyRoute = require("./Routes/facultyRoute")
  app.use("/api/faculty", (req, res, next) => {
    try {
      facultyRoute(req, res, next)
    } catch (error) {
      console.error("❌ Faculty route error:", error)
      res.status(500).json({
        message: "Faculty service error",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })
  console.log("✅ Faculty route loaded")
} catch (error) {
  console.error("❌ Failed to load faculty route:", error.message)
}

// Department route with error handling
try {
  const departmentRoute = require("./Routes/departmentRoute")
  app.use("/api/department", (req, res, next) => {
    try {
      departmentRoute(req, res, next)
    } catch (error) {
      console.error("❌ Department route error:", error)
      res.status(500).json({
        message: "Department service error",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })
  console.log("✅ Department route loaded")
} catch (error) {
  console.error("❌ Failed to load department route:", error.message)
}

// Course route with error handling
try {
  const courseRoute = require("./Routes/courseRoute")
  app.use("/api/course", (req, res, next) => {
    try {
      courseRoute(req, res, next)
    } catch (error) {
      console.error("❌ Course route error:", error)
      res.status(500).json({
        message: "Course service error",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })
  console.log("✅ Course route loaded")
} catch (error) {
  console.error("❌ Failed to load course route:", error.message)
}

// Lecturer route with error handling
try {
  const lecturerRoute = require("./Routes/lecturerRoute")
  app.use("/api/lecturer", (req, res, next) => {
    try {
      lecturerRoute(req, res, next)
    } catch (error) {
      console.error("❌ Lecturer route error:", error)
      res.status(500).json({
        message: "Lecturer service error",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })
  console.log("✅ Lecturer route loaded")
} catch (error) {
  console.error("❌ Failed to load lecturer route:", error.message)
}

console.log("✅ Route loading completed!")

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "dist")
  console.log("📁 Serving static files from:", staticPath)

  app.use(express.static(staticPath))

  // Handle React Router (return `index.html` for all non-API routes)
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(staticPath, "index.html"))
    } else {
      res.status(404).json({
        message: "API route not found",
        path: req.path,
        timestamp: new Date().toISOString(),
      })
    }
  })
}

// Handle 404 for API routes only
app.use("/api/*", (req, res) => {
  console.log("404 - API route not found:", req.path)
  res.status(404).json({
    message: "API route not found",
    path: req.path,
    availableRoutes: ["/api", "/api/health", "/api/test", "/api/setup/status"],
    timestamp: new Date().toISOString(),
  })
})

const PORT = process.env.PORT || 5000

// Connect to database first, then start server
const startServer = async () => {
  try {
    console.log("🔄 Connecting to database...")
    await ConnectDB()

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${PORT}`)
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`)
      console.log(`⚙️ Setup endpoint: http://localhost:${PORT}/api/setup/status`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log("🎉 Server started successfully!")
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error.message)

    // In production, try to start server anyway for debugging
    if (process.env.NODE_ENV === "production") {
      console.log("⚠️ Starting server without database connection for debugging...")
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`⚠️ Server running on port ${PORT} (database connection failed)`)
        console.log("🔧 Check your MONGO_URI environment variable")
      })
    } else {
      process.exit(1)
    }
  }
}

startServer()
