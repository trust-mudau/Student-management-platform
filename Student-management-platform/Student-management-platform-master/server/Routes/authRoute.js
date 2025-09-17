const express = require("express")
const router = express.Router()

// Import controllers with error handling
let signup, login, getMyUser, getAllUsers

try {
  const authControllers = require("../controllers/authControllers")
  signup = authControllers.signup
  login = authControllers.login
  getMyUser = authControllers.getMyUser
  getAllUsers = authControllers.getAllUsers

  // Verify all functions are loaded
  if (!signup || !login || !getMyUser || !getAllUsers) {
    throw new Error("One or more auth controller functions are undefined")
  }

  console.log("✅ Auth controllers loaded successfully")
} catch (error) {
  console.error("❌ Error loading auth controllers:", error.message)

  // Create fallback functions to prevent crashes
  const fallbackHandler = (req, res) => {
    res.status(500).json({
      message: "Auth service temporarily unavailable",
      error: "Controller loading failed",
      timestamp: new Date().toISOString(),
    })
  }

  signup = signup || fallbackHandler
  login = login || fallbackHandler
  getMyUser = getMyUser || fallbackHandler
  getAllUsers = getAllUsers || fallbackHandler
}

const authenticate = require("../middleware/auth")

// Public routes (no authentication required)
router.post("/register", (req, res, next) => {
  try {
    signup(req, res, next)
  } catch (error) {
    console.error("Registration route error:", error)
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.post("/login", (req, res, next) => {
  try {
    login(req, res, next)
  } catch (error) {
    console.error("Login route error:", error)
    res.status(500).json({
      message: "Login failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// Protected routes (authentication required)
router.get("/me", authenticate, (req, res, next) => {
  try {
    getMyUser(req, res, next)
  } catch (error) {
    console.error("Get user route error:", error)
    res.status(500).json({
      message: "Failed to get user",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.get("/all", authenticate, (req, res, next) => {
  try {
    getAllUsers(req, res, next)
  } catch (error) {
    console.error("Get all users route error:", error)
    res.status(500).json({
      message: "Failed to get users",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router
