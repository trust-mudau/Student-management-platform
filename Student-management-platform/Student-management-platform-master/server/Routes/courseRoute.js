const express = require("express")
const router = express.Router()

// Import controllers with error handling
let getAllCourses, updateCourse, deletecourse, getAllEnrollments, enrollStudents, createCourses

try {
  const courseControllers = require("../controllers/courseController")
  getAllCourses = courseControllers.getAllCourses
  updateCourse = courseControllers.updateCourse
  deletecourse = courseControllers.deletecourse
  getAllEnrollments = courseControllers.getAllEnrollments
  enrollStudents = courseControllers.enrollStudents
  createCourses = courseControllers.createCourses

  // Verify all functions are loaded
  if (!getAllCourses || !updateCourse || !deletecourse || !getAllEnrollments || !enrollStudents || !createCourses) {
    throw new Error("One or more course controller functions are undefined")
  }

  console.log("✅ Course controllers loaded successfully")
} catch (error) {
  console.error("❌ Error loading course controllers:", error.message)

  // Create fallback functions to prevent crashes
  const fallbackHandler = (req, res) => {
    res.status(500).json({
      message: "Course service temporarily unavailable",
      error: "Controller loading failed",
      timestamp: new Date().toISOString(),
    })
  }

  getAllCourses = getAllCourses || fallbackHandler
  updateCourse = updateCourse || fallbackHandler
  deletecourse = deletecourse || fallbackHandler
  getAllEnrollments = getAllEnrollments || fallbackHandler
  enrollStudents = enrollStudents || fallbackHandler
  createCourses = createCourses || fallbackHandler
}

const authenticate = require("../middleware/auth")

// Add error handling wrapper for each route
router.get("/all", authenticate, (req, res, next) => {
  try {
    getAllCourses(req, res, next)
  } catch (error) {
    console.error("Get all courses route error:", error)
    res.status(500).json({
      message: "Failed to get courses",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.post("/", authenticate, (req, res, next) => {
  try {
    createCourses(req, res, next)
  } catch (error) {
    console.error("Create course route error:", error)
    res.status(500).json({
      message: "Failed to create course",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.get("/enrollments", authenticate, (req, res, next) => {
  try {
    getAllEnrollments(req, res, next)
  } catch (error) {
    console.error("Get enrollments route error:", error)
    res.status(500).json({
      message: "Failed to get enrollments",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.put("/:id", authenticate, (req, res, next) => {
  try {
    updateCourse(req, res, next)
  } catch (error) {
    console.error("Update course route error:", error)
    res.status(500).json({
      message: "Failed to update course",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.delete("/:id", authenticate, (req, res, next) => {
  try {
    deletecourse(req, res, next)
  } catch (error) {
    console.error("Delete course route error:", error)
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

router.post("/enroll", authenticate, (req, res, next) => {
  try {
    enrollStudents(req, res, next)
  } catch (error) {
    console.error("Enroll student route error:", error)
    res.status(500).json({
      message: "Failed to enroll student",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router
