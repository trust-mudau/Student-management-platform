const express = require("express")
const router = express.Router()

// Import controllers with error handling
let getAllLecturers, getMyLecturer, createLecturer, updateLecturer, deleteLecturer

try {
  const lecturerControllers = require("../controllers/lecturerControllers")
  getAllLecturers = lecturerControllers.getAllLecturers
  getMyLecturer = lecturerControllers.getMyLecturer
  createLecturer = lecturerControllers.createLecturer
  updateLecturer = lecturerControllers.updateLecturer
  deleteLecturer = lecturerControllers.deleteLecturer

  // Verify all functions are loaded
  if (!getAllLecturers || !getMyLecturer || !createLecturer || !updateLecturer || !deleteLecturer) {
    throw new Error("One or more lecturer controller functions are undefined")
  }

  console.log("✅ Lecturer controllers loaded successfully")
} catch (error) {
  console.error("❌ Error loading lecturer controllers:", error.message)

  // Create fallback functions to prevent crashes
  const fallbackHandler = (req, res) => {
    res.status(500).json({
      message: "Lecturer service temporarily unavailable",
      error: "Controller loading failed",
      timestamp: new Date().toISOString(),
    })
  }

  getAllLecturers = getAllLecturers || fallbackHandler
  getMyLecturer = getMyLecturer || fallbackHandler
  createLecturer = createLecturer || fallbackHandler
  updateLecturer = updateLecturer || fallbackHandler
  deleteLecturer = deleteLecturer || fallbackHandler
}

const authenticate = require("../middleware/auth")

// Add error handling wrapper for each route
router.get("/", authenticate, (req, res, next) => {
  try {
    getAllLecturers(req, res, next)
  } catch (error) {
    console.error("Get all lecturers route error:", error)
    res.status(500).json({
      message: "Failed to get lecturers",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.get("/:id", authenticate, (req, res, next) => {
  try {
    getMyLecturer(req, res, next)
  } catch (error) {
    console.error("Get lecturer route error:", error)
    res.status(500).json({
      message: "Failed to get lecturer",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.post("/", authenticate, (req, res, next) => {
  try {
    createLecturer(req, res, next)
  } catch (error) {
    console.error("Create lecturer route error:", error)
    res.status(500).json({
      message: "Failed to create lecturer",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.put("/:id", authenticate, (req, res, next) => {
  try {
    updateLecturer(req, res, next)
  } catch (error) {
    console.error("Update lecturer route error:", error)
    res.status(500).json({
      message: "Failed to update lecturer",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.delete("/:id", authenticate, (req, res, next) => {
  try {
    deleteLecturer(req, res, next)
  } catch (error) {
    console.error("Delete lecturer route error:", error)
    res.status(500).json({
      message: "Failed to delete lecturer",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router
